const encoder = new TextEncoder();
const decoder = new TextDecoder();

function getSecret(): string {
  return (
    process.env.NEXT_PUBLIC_CONTACT_MESSAGE_SECRET ??
    process.env.CONTACT_MESSAGE_SECRET ??
    "nadssu-contact-message-secret-v1"
  );
}

async function getAesKey() {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(getSecret()),
  );
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, [
    "encrypt",
    "decrypt",
  ]);
}

function hexToUint8Array(value: string): Uint8Array {
  const normalized = value.replace(/\s+/g, "");
  if (!normalized || normalized.length % 2 !== 0) {
    throw new Error("Invalid encrypted payload");
  }

  const bytes = new Uint8Array(normalized.length / 2);
  for (let index = 0; index < normalized.length; index += 2) {
    bytes[index / 2] = Number.parseInt(normalized.slice(index, index + 2), 16);
  }
  return bytes;
}

function uint8ArrayToHex(value: Uint8Array): string {
  return Array.from(value)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function encryptText(value: string): Promise<string> {
  if (!value) return value;

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getAesKey();
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(value),
  );

  const output = new Uint8Array(iv.length + encrypted.byteLength);
  output.set(iv, 0);
  output.set(new Uint8Array(encrypted), iv.length);

  return uint8ArrayToHex(output);
}

export async function decryptText(value: string): Promise<string> {
  if (!value) return value;

  let bytes: Uint8Array;

  try {
    if (/^[0-9a-fA-F]+$/.test(value) && value.length % 2 === 0) {
      bytes = hexToUint8Array(value);
    } else {
      const binary = atob(value);
      bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    }
  } catch {
    return value;
  }

  if (bytes.length < 12) {
    return value;
  }

  const iv = bytes.slice(0, 12);
  const cipher = bytes.slice(12);
  const key = await getAesKey();

  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      cipher,
    );
    return decoder.decode(decrypted);
  } catch {
    return value;
  }
}

export function extractReplyPhone(message: string): string | null {
  const normalized = message.replace(/\r/g, "");
  const patterns = [
    /(?:whatsapp|WhatsApp|whatsapp number|WhatsApp number)\s*[:\-]?\s*(\+?[0-9][0-9\s().-]{5,})/i,
    /(?:reply to|reply via|call me on|contact me on)\s*[:\-]?\s*(\+?[0-9][0-9\s().-]{5,})/i,
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match?.[1]) {
      const cleaned = match[1].replace(/[^+\d]/g, "");
      if (cleaned.length >= 10) {
        return cleaned;
      }
    }
  }

  const fallbackMatch = normalized.match(/(?:\b\+?\d[\d\s().-]{8,}\d\b)/);
  if (fallbackMatch?.[0]) {
    const cleaned = fallbackMatch[0].replace(/[^+\d]/g, "");
    if (cleaned.length >= 10) {
      return cleaned;
    }
  }

  return null;
}

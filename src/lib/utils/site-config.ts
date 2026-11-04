import { createClient } from "@/lib/supabase/server";
import type { SiteConfig } from "@/lib/types";
import { DEFAULT_SITE_CONFIG } from "@/lib/utils/site-config-defaults";

function stripWrappingQuotes(value: string): string {
  let cleaned = value.trim();

  while (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  return cleaned;
}

function isSafeUrl(value: string): boolean {
  const cleaned = stripWrappingQuotes(value).trim();

  if (!cleaned) return false;
  if (cleaned.startsWith("/")) return true;

  try {
    const url = new URL(cleaned);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function normalizeUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const cleaned = stripWrappingQuotes(value).trim();
  if (!cleaned) return null;

  if (cleaned.startsWith("/")) return cleaned;
  return isSafeUrl(cleaned) ? cleaned : null;
}

function normalizeCta(
  value: unknown,
  fallback: { label: string; href: string },
) {
  if (typeof value !== "object" || value === null) {
    return fallback;
  }

  const entry = value as Record<string, unknown>;
  const label =
    typeof entry.label === "string" && entry.label.trim()
      ? entry.label.trim()
      : fallback.label;
  const hrefRaw =
    typeof entry.href === "string"
      ? stripWrappingQuotes(entry.href).trim()
      : "";

  const href =
    hrefRaw &&
    (hrefRaw.startsWith("/") || hrefRaw.startsWith("#") || isSafeUrl(hrefRaw))
      ? hrefRaw
      : fallback.href;

  return { label, href };
}

function normalizeSocialLinks(value: unknown) {
  if (typeof value !== "object" || value === null) {
    return { ...DEFAULT_SITE_CONFIG.social_links };
  }

  const entries = value as Record<string, unknown>;
  const socialLinks = { ...DEFAULT_SITE_CONFIG.social_links };

  for (const [key, val] of Object.entries(entries)) {
    if (!(key in socialLinks)) continue;

    const normalized = normalizeUrl(val);
    socialLinks[key as keyof typeof socialLinks] = normalized ?? "";
  }

  return socialLinks;
}

function normalizePhoneNumbers(value: unknown): string[] {
  if (!Array.isArray(value)) return [...DEFAULT_SITE_CONFIG.contact_phone];

  const numbers = value
    .map((item) =>
      typeof item === "string" ? stripWrappingQuotes(item).trim() : "",
    )
    .filter(Boolean);

  return numbers.length > 0 ? numbers : [...DEFAULT_SITE_CONFIG.contact_phone];
}

function parseSettingValue(value: unknown): unknown {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}

export { DEFAULT_SITE_CONFIG };

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("key, value");

    if (!data || data.length === 0) {
      return DEFAULT_SITE_CONFIG;
    }

    const config: Record<string, unknown> = { ...DEFAULT_SITE_CONFIG };
    const defaultConfigRecord = DEFAULT_SITE_CONFIG as unknown as Record<
      string,
      unknown
    >;

    for (const row of data) {
      const parsedValue = parseSettingValue(row.value);
      const key = row.key as keyof SiteConfig;

      if (row.key === "social_links") {
        config[row.key] = normalizeSocialLinks(parsedValue);
        continue;
      }

      if (row.key === "contact_phone") {
        config[row.key] = normalizePhoneNumbers(parsedValue);
        continue;
      }

      if (row.key === "hero_cta_primary" || row.key === "hero_cta_secondary") {
        const fallback = defaultConfigRecord[row.key] as {
          label: string;
          href: string;
        };
        config[row.key] = normalizeCta(parsedValue, fallback);
        continue;
      }

      if (
        row.key === "logo_url" ||
        row.key === "favicon_url" ||
        row.key === "hero_image_url" ||
        row.key === "patron_image_url" ||
        row.key === "president_image_url"
      ) {
        config[row.key] =
          normalizeUrl(parsedValue) ?? defaultConfigRecord[String(key)];
        continue;
      }

      if (typeof parsedValue === "string") {
        const normalizedString = stripWrappingQuotes(parsedValue).trim();
        config[row.key] = normalizedString || defaultConfigRecord[String(key)];
        continue;
      }

      config[row.key] = parsedValue ?? defaultConfigRecord[String(key)];
    }

    return config as unknown as SiteConfig;
  } catch {
    return DEFAULT_SITE_CONFIG;
  }
}

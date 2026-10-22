"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { submitContactForm } from "@/lib/actions/public";
import { encryptText, extractReplyPhone } from "@/lib/crypto";

const initialState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const [values, setValues] = useState(initialState);
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const rawMessage = values.message.trim();
    const replyPhone = extractReplyPhone(rawMessage);
    const encryptedMessage = await encryptText(rawMessage);

    const result = await submitContactForm({
      ...values,
      message: encryptedMessage,
      reply_phone: replyPhone ?? undefined,
    });

    setStatus(
      result.success
        ? "Your message has been submitted successfully. We will reply by email or WhatsApp."
        : result.error,
    );

    if (result.success) {
      setValues(initialState);
    }

    setIsSubmitting(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Send a message
        </p>
        <h2 className="mt-2 text-3xl font-bold text-navy">Contact form</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-1">
          <label htmlFor="name" className="text-sm font-medium text-navy">
            Full name
          </label>
          <input
            id="name"
            name="name"
            value={values.name}
            onChange={(event) =>
              setValues((current) => ({ ...current, name: event.target.value }))
            }
            className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            placeholder="Your name"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-1">
          <label htmlFor="email" className="text-sm font-medium text-navy">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={values.email}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
            className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="subject" className="text-sm font-medium text-navy">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            value={values.subject}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                subject: event.target.value,
              }))
            }
            className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            placeholder="How can we help?"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="message" className="text-sm font-medium text-navy">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={values.message}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                message: event.target.value,
              }))
            }
            rows={6}
            className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            placeholder="Tell us more about your enquiry..."
            required
          />
        </div>
      </div>

      <div className="mt-4 text-sm text-navy">
        Please include your WhatsApp number in the message if you would like to
        be contacted via WhatsApp.
      </div>

      {status && (
        <div
          className={`mt-5 rounded-xl border px-3 py-2.5 text-sm ${status.toLowerCase().includes("successfully") || status.toLowerCase().includes("reply") ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}
        >
          {status}
        </div>
      )}

      <div className="mt-6 flex items-center justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send message
            </>
          )}
        </button>
      </div>
    </form>
  );
}

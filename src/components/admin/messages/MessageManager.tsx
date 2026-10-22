"use client";

import { useState, useTransition } from "react";
import {
  CheckCheck,
  Mail,
  MessageSquareText,
  Phone,
  Save,
  Send,
} from "lucide-react";
import {
  markMessageRead,
  markMessageResolved,
  updateMessageNotes,
} from "@/lib/actions/admin";

interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  is_resolved: boolean;
  admin_notes: string | null;
  created_at: string;
}

export function MessageManager({ message }: { message: ContactMessageRecord }) {
  const [isRead, setIsRead] = useState(message.is_read);
  const [isResolved, setIsResolved] = useState(message.is_resolved);
  const [notes, setNotes] = useState(message.admin_notes ?? "");
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const replyEmail = `mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject || "Your enquiry"}`)}`;
  const replyWhatsApp = `https://wa.me/${message.email.replace(/\D/g, "") || "256700000000"}`;

  const handleToggleRead = () => {
    startTransition(async () => {
      const result = await markMessageRead(message.id, !isRead);
      if (result.success) {
        setIsRead((current) => !current);
        setStatus("Message status updated.");
      } else {
        setStatus(result.error || "Unable to update the message status.");
      }
    });
  };

  const handleToggleResolved = () => {
    startTransition(async () => {
      const result = await markMessageResolved(message.id, !isResolved);
      if (result.success) {
        setIsResolved((current) => !current);
        setStatus("Resolution status updated.");
      } else {
        setStatus(result.error || "Unable to update the resolution state.");
      }
    });
  };

  const handleSaveNotes = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await updateMessageNotes(message.id, notes);
      if (result.success) {
        setStatus("Notes saved successfully.");
      } else {
        setStatus(result.error || "Unable to save notes.");
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
      <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isRead ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
          >
            {isRead ? "Read" : "Unread"}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isResolved ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"}`}
          >
            {isResolved ? "Resolved" : "Open"}
          </span>
          <span className="text-xs text-muted-foreground">
            Sent {new Date(message.created_at).toLocaleString()}
          </span>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Name
              </p>
              <p className="mt-1 text-lg font-medium text-navy">
                {message.name}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Email
              </p>
              <p className="mt-1 text-lg font-medium text-navy">
                {message.email}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Subject
            </p>
            <p className="mt-1 text-lg text-navy">
              {message.subject || "No subject"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Message
            </p>
            <div className="mt-2 rounded-2xl bg-muted/40 p-4 text-sm leading-7 text-foreground whitespace-pre-wrap">
              {message.message}
            </div>
          </div>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="rounded-3xl border border-border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-navy">Reply options</h2>
          <div className="mt-4 space-y-3">
            <a
              href={replyEmail}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email
              </span>
              <Send className="h-4 w-4" />
            </a>
            <a
              href={replyWhatsApp}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> WhatsApp
              </span>
              <Send className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Visitors are informed that we reply by email or WhatsApp.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-navy">Admin actions</h2>
          <div className="mt-4 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleToggleRead}
              disabled={isPending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-70"
            >
              <MessageSquareText className="h-4 w-4" />
              {isRead ? "Mark unread" : "Mark as read"}
            </button>
            <button
              type="button"
              onClick={handleToggleResolved}
              disabled={isPending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-70"
            >
              <CheckCheck className="h-4 w-4" />
              {isResolved ? "Reopen issue" : "Mark resolved"}
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-navy">Internal notes</h2>
          <form onSubmit={handleSaveNotes} className="mt-4 space-y-3">
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={6}
              className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              placeholder="Add notes about the follow-up or response status."
            />
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/90 disabled:opacity-70"
            >
              <Save className="h-4 w-4" />
              Save notes
            </button>
          </form>
        </div>

        {status && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700">
            {status}
          </div>
        )}
      </aside>
    </div>
  );
}

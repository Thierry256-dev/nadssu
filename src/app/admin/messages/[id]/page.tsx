import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCheck,
  Mail,
  MessageSquareText,
  Phone,
  Send,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  markMessageRead,
  markMessageResolved,
  updateMessageNotes,
} from "@/lib/actions/admin";

export const metadata: Metadata = {
  title: "Message Details",
  description: "Manage and respond to a contact message.",
};

export default async function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) {
    notFound();
  }

  if (!data.is_read) {
    await markMessageRead(id, true);
    const { data: refreshedData } = await supabase
      .from("contact_messages")
      .select("*")
      .eq("id", id)
      .single();

    if (refreshedData) {
      Object.assign(data, refreshedData);
    }
  }

  const replyEmail = `mailto:${data.email}?subject=${encodeURIComponent(`Re: ${data.subject || "Your enquiry"}`)}`;
  const replyWhatsApp = `https://wa.me/${String(data.email).replace(/\D/g, "") || "256700000000"}`;

  async function handleMarkRead() {
    "use server";
    await markMessageRead(data.id, true);
  }

  async function handleMarkResolved() {
    "use server";
    await markMessageResolved(data.id, !data.is_resolved);
  }

  async function handleSaveNotes(formData: FormData) {
    "use server";
    const notes = String(formData.get("admin_notes") ?? "");
    await updateMessageNotes(data.id, notes);
  }

  return (
    <main className="bg-[linear-gradient(180deg,#f7faf7_0%,#ffffff_100%)]">
      <div className="container-site py-8 lg:py-12">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Messages
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy">
              Message details
            </h1>
          </div>
          <Link
            href="/admin/messages"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to inbox
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${data.is_read ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
              >
                {data.is_read ? "Read" : "Unread"}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${data.is_resolved ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"}`}
              >
                {data.is_resolved ? "Resolved" : "Open"}
              </span>
              <span className="text-xs text-muted-foreground">
                Sent {new Date(data.created_at).toLocaleString()}
              </span>
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    Name
                  </p>
                  <p className="mt-1 text-lg font-medium text-navy">
                    {data.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    Email
                  </p>
                  <p className="mt-1 text-lg font-medium text-navy">
                    {data.email}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Subject
                </p>
                <p className="mt-1 text-lg text-navy">
                  {data.subject || "No subject"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Message
                </p>
                <div className="mt-2 rounded-2xl bg-muted/40 p-4 text-sm leading-7 text-foreground whitespace-pre-wrap">
                  {data.message}
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
                Visitors are informed that we will respond by email or WhatsApp.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-navy">Admin actions</h2>
              <div className="mt-4 flex flex-col gap-3">
                <form action={handleMarkRead}>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
                  >
                    <MessageSquareText className="h-4 w-4" />
                    {data.is_read ? "Mark unread" : "Mark as read"}
                  </button>
                </form>
                <form action={handleMarkResolved}>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    <CheckCheck className="h-4 w-4" />
                    {data.is_resolved ? "Reopen issue" : "Mark resolved"}
                  </button>
                </form>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-navy">
                Internal notes
              </h2>
              <form action={handleSaveNotes} className="mt-4 space-y-3">
                <textarea
                  name="admin_notes"
                  defaultValue={data.admin_notes ?? ""}
                  rows={6}
                  className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                  placeholder="Add notes about the follow-up or response status."
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/90"
                >
                  Save notes
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { Eye, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default async function MessagesAdminPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("contact_messages")
    .select("id,name,email,subject,is_read,is_resolved,created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <AdminModulePage
      title="Messages"
      description="Review inbound questions, enquiries, and contact submissions from visitors."
      rows={rows ?? []}
      emptyMessage="No messages have been received yet."
      ctaLabel="View inbox"
      ctaHref="/admin/messages"
      columns={[
        {
          key: "name",
          label: "Name",
          render: (row) => (
            <div>
              <div className="font-medium text-navy">
                {String(row.name ?? "—")}
              </div>
              <div className="text-xs text-muted-foreground">
                {String(row.email ?? "—")}
              </div>
            </div>
          ),
        },
        {
          key: "subject",
          label: "Subject",
          render: (row) => (
            <span className="text-sm text-foreground">
              {String(row.subject ?? "No subject")}
            </span>
          ),
        },
        {
          key: "is_read",
          label: "Read",
          render: (row) => (
            <span
              className={
                String(row.is_read) === "true"
                  ? "text-green-600"
                  : "text-orange-600"
              }
            >
              {String(row.is_read) === "true" ? "Yes" : "No"}
            </span>
          ),
        },
        {
          key: "is_resolved",
          label: "Status",
          render: (row) => (
            <span
              className={
                String(row.is_resolved) === "true"
                  ? "rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700"
                  : "rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700"
              }
            >
              {String(row.is_resolved) === "true" ? "Resolved" : "Open"}
            </span>
          ),
        },
        {
          key: "created_at",
          label: "Received",
          render: (row) => (
            <span className="text-muted-foreground">
              {row.created_at
                ? new Date(String(row.created_at)).toLocaleDateString()
                : "—"}
            </span>
          ),
        },
        {
          key: "actions",
          label: "Actions",
          render: (row) => (
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/messages/${row.id}`}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                <Eye className="h-4 w-4" />
                View
              </Link>
              <a
                href={`mailto:${row.email}?subject=${encodeURIComponent(`Re: ${String(row.subject ?? "Your enquiry")}`)}`}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                <Mail className="h-4 w-4" />
                Reply
              </a>
            </div>
          ),
        },
      ]}
    />
  );
}

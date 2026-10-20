import { createClient } from "@/lib/supabase/server";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default async function MessagesAdminPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("contact_messages")
    .select("id,name,email,subject,is_read,created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <AdminModulePage
      title="Messages"
      description="Review inbound questions, enquiries, and contact submissions."
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
      ]}
    />
  );
}

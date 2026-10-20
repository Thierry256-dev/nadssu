import { createClient } from "@/lib/supabase/server";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default async function EventsAdminPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("events")
    .select("id,title,category,status,start_date")
    .order("start_date", { ascending: false })
    .limit(50);

  return (
    <AdminModulePage
      title="Events"
      description="Schedule upcoming activities, workshops, and community engagements."
      rows={rows ?? []}
      emptyMessage="No events have been scheduled yet."
      ctaLabel="Add event"
      ctaHref="/admin/events/new"
      columns={[
        {
          key: "title",
          label: "Event",
          render: (row) => (
            <div>
              <div className="font-medium text-navy">
                {String(row.title ?? "Untitled")}
              </div>
              <div className="text-xs text-muted-foreground">
                {String(row.category ?? "General")}
              </div>
            </div>
          ),
        },
        {
          key: "status",
          label: "Status",
          render: (row) => (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              {String(row.status ?? "draft")}
            </span>
          ),
        },
        {
          key: "start_date",
          label: "Date",
          render: (row) => (
            <span className="text-muted-foreground">
              {row.start_date
                ? new Date(String(row.start_date)).toLocaleDateString()
                : "—"}
            </span>
          ),
        },
      ]}
    />
  );
}

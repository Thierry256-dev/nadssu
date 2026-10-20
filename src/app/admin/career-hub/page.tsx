import { createClient } from "@/lib/supabase/server";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default async function CareerHubAdminPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("career_opportunities")
    .select("id,title,category,status,deadline")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <AdminModulePage
      title="Career hub"
      description="Publish openings, internships, and research opportunities for students and members."
      rows={rows ?? []}
      emptyMessage="No opportunities have been added yet."
      ctaLabel="Add opportunity"
      ctaHref="/admin/career-hub/new"
      columns={[
        {
          key: "title",
          label: "Opportunity",
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
            <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-medium text-secondary">
              {String(row.status ?? "draft")}
            </span>
          ),
        },
        {
          key: "deadline",
          label: "Deadline",
          render: (row) => (
            <span className="text-muted-foreground">
              {row.deadline
                ? new Date(String(row.deadline)).toLocaleDateString()
                : "—"}
            </span>
          ),
        },
      ]}
    />
  );
}

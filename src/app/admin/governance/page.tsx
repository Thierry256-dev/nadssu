import { createClient } from "@/lib/supabase/server";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default async function GovernanceAdminPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("governance_members")
    .select("id,name,position,is_published,updated_at")
    .order("sort_order", { ascending: true })
    .limit(50);

  return (
    <AdminModulePage
      title="Governance"
      description="Maintain leadership profiles, committees, and governance listings."
      rows={rows ?? []}
      emptyMessage="No governance members have been added yet."
      ctaLabel="Add member"
      ctaHref="/admin/governance/new"
      columns={[
        {
          key: "name",
          label: "Name",
          render: (row) => (
            <span className="font-medium text-navy">
              {String(row.name ?? "—")}
            </span>
          ),
        },
        {
          key: "position",
          label: "Position",
        },
        {
          key: "is_published",
          label: "Published",
          render: (row) => (
            <span
              className={
                String(row.is_published) === "true"
                  ? "text-green-600"
                  : "text-muted-foreground"
              }
            >
              {String(row.is_published) === "true" ? "Yes" : "No"}
            </span>
          ),
        },
      ]}
    />
  );
}

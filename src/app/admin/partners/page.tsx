import { createClient } from "@/lib/supabase/server";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default async function PartnersAdminPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("partners")
    .select("id,name,website_url,is_published,sort_order")
    .order("sort_order", { ascending: true })
    .limit(50);

  return (
    <AdminModulePage
      title="Partners"
      description="Coordinate institutional, stakeholder, and partner relationships."
      rows={rows ?? []}
      emptyMessage="No partner organisations have been added yet."
      ctaLabel="Add partner"
      ctaHref="/admin/partners/new"
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
          key: "website_url",
          label: "Website",
          render: (row) => (
            <span className="text-muted-foreground">
              {row.website_url ? String(row.website_url) : "—"}
            </span>
          ),
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

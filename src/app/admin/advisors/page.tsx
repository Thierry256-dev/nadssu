import { createClient } from "@/lib/supabase/server";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default async function AdvisorsAdminPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("advisors")
    .select("id,name,title,is_published,sort_order")
    .order("sort_order", { ascending: true })
    .limit(50);

  return (
    <AdminModulePage
      title="Advisors"
      description="Update advisory profiles and professional leadership details."
      rows={rows ?? []}
      emptyMessage="No advisors have been added yet."
      ctaLabel="Add advisor"
      ctaHref="/admin/advisors/new"
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
          key: "title",
          label: "Title",
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

import { createClient } from "@/lib/supabase/server";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default async function PagesAdminPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("page_sections")
    .select("id,page,section_key,title,is_visible,updated_at")
    .order("page", { ascending: true })
    .order("sort_order", { ascending: true })
    .limit(50);

  return (
    <AdminModulePage
      title="Pages"
      description="Update the site’s core sections and page content for the public website."
      rows={rows ?? []}
      emptyMessage="No page sections have been added yet."
      ctaLabel="Add section"
      ctaHref="/admin/pages/new"
      columns={[
        {
          key: "page",
          label: "Page",
          render: (row) => (
            <span className="font-medium text-navy">
              {String(row.page ?? "—")}
            </span>
          ),
        },
        {
          key: "section_key",
          label: "Section",
        },
        {
          key: "is_visible",
          label: "Visible",
          render: (row) => (
            <span
              className={
                String(row.is_visible) === "true"
                  ? "text-green-600"
                  : "text-muted-foreground"
              }
            >
              {String(row.is_visible) === "true" ? "Yes" : "No"}
            </span>
          ),
        },
      ]}
    />
  );
}

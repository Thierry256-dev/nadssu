import { createClient } from "@/lib/supabase/server";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default async function ResourcesAdminPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("resources")
    .select("id,title,category,file_name,is_published,created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <AdminModulePage
      title="Resources"
      description="Manage downloadable reports, guides, templates, and programme resources."
      rows={rows ?? []}
      emptyMessage="No resources have been uploaded yet."
      ctaLabel="Upload resource"
      ctaHref="/admin/resources/new"
      columns={[
        {
          key: "title",
          label: "Title",
          render: (row) => (
            <span className="font-medium text-navy">
              {String(row.title ?? "Untitled")}
            </span>
          ),
        },
        {
          key: "category",
          label: "Category",
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

import Link from "next/link";
import { PencilLine } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminModulePage } from "@/components/admin/AdminModulePage";
import { NewsDeleteButton } from "@/components/admin/news/NewsDeleteButton";

export default async function NewsAdminPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("news_posts")
    .select("id,title,status,category,created_at")
    .order("created_at", { ascending: false })
    .limit(25);

  return (
    <AdminModulePage
      title="News"
      description="Manage official updates, publish new stories, and keep the newsroom current."
      rows={rows ?? []}
      emptyMessage="No news articles have been published yet."
      ctaLabel="Add news"
      ctaHref="/admin/news/new"
      columns={[
        {
          key: "title",
          label: "Title",
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
          key: "created_at",
          label: "Created",
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
                href={`/admin/news/${row.id}`}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                <PencilLine className="h-4 w-4" />
                Edit
              </Link>
              <NewsDeleteButton id={String(row.id)} />
            </div>
          ),
        },
      ]}
    />
  );
}

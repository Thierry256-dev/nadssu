import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { NewsForm } from "@/components/admin/news/NewsForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Edit News Update",
  description: "Edit an existing news update.",
};

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("news_posts")
    .select("id,title,slug,summary,content,author,category,cover_image_url,status,is_featured,published_at")
    .eq("id", id)
    .single();

  if (!data) {
    notFound();
  }

  return (
    <main className="bg-[linear-gradient(180deg,#f7faf7_0%,#ffffff_100%)]">
      <div className="container-site py-8 lg:py-12">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              News updates
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy">Edit update</h1>
          </div>
          <Link
            href="/admin/news"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </Link>
        </div>

        <div className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <NewsForm
            initialValues={{
              id: data.id,
              title: data.title,
              slug: data.slug,
              summary: data.summary ?? "",
              content: data.content ?? "",
              author: data.author ?? "",
              category: data.category ?? "General",
              cover_image_url: data.cover_image_url ?? "",
              status: data.status,
              is_featured: data.is_featured,
              published_at: data.published_at ?? "",
            }}
          />
        </div>
      </div>
    </main>
  );
}

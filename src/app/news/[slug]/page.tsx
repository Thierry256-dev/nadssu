import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { format, parseISO } from "date-fns";
import DOMPurify from "dompurify";
import { createClient } from "@/lib/supabase/server";
import type { NewsPost } from "@/lib/types";
import { PageBanner } from "@/components/layout/PageBanner";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("news_posts")
    .select("title, summary")
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .single();

  if (!data) {
    return { title: "News Not Found" };
  }

  return {
    title: `${data.title} — NADSSU`,
    description: (data.summary ?? "").slice(0, 160),
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: newsPost } = await supabase
    .from("news_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!newsPost) {
    notFound();
  }

  const post = newsPost as NewsPost;
  const hasValidPublicationDate =
    !post.published_at || new Date(post.published_at).getTime() <= Date.now();

  if (!hasValidPublicationDate) {
    notFound();
  }

  return (
    <>
      <PageBanner
        title={post.title}
        subtitle={post.summary ?? "NADSSU update"}
        imageUrl={post.cover_image_url ?? null}
      >
        <Breadcrumb
          items={[{ label: "News", href: "/news" }, { label: post.title }]}
        />
      </PageBanner>

      <section className="bg-white py-12 lg:py-16">
        <div className="container-site">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/news"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft size={14} /> Back to news
            </Link>

            <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {post.category && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {post.category}
                </span>
              )}
              {post.published_at && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={13} />
                  {format(parseISO(post.published_at), "MMMM d, yyyy")}
                </span>
              )}
              {post.author && (
                <span className="inline-flex items-center gap-1.5">
                  <User size={13} />
                  {post.author}
                </span>
              )}
            </div>

            {post.cover_image_url && (
              <div className="relative mb-8 overflow-hidden rounded-2xl border border-border bg-powder">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    width={1600}
                    height={900}
                    className="h-full w-full object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 75vw"
                  />
                </div>
              </div>
            )}

            {post.content && (
              <article
                className="prose-nadssu max-w-none"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(post.content),
                }}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

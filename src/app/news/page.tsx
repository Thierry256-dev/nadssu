import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import type { NewsPost } from "@/lib/types";
import { PageBanner } from "@/components/layout/PageBanner";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "News & Updates — NADSSU",
  description:
    "Browse the latest NADSSU news, announcements, events, and member updates.",
};

export default async function NewsPage() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("news_posts")
    .select("*")
    .eq("status", "published")
    .or(`published_at.is.null,published_at.lte.${new Date().toISOString()}`)
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("[NewsPage] Failed to fetch news posts:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
  }

  const news = (posts as NewsPost[]) ?? [];

  return (
    <>
      <PageBanner
        title="News & Updates"
        subtitle="Latest announcements, stories, and developments from NADSSU."
      >
        <Breadcrumb items={[{ label: "News" }]} />
      </PageBanner>

      <section className="bg-white py-12 lg:py-16">
        <div className="container-site">
          {news.length === 0 ? (
            <div className="rounded-2xl border border-border bg-powder p-10 text-center">
              <h2 className="text-2xl font-bold text-navy">
                No published updates yet
              </h2>
              <p className="mt-2 text-muted-foreground">
                Check back soon for the latest NADSSU announcements and news.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {news.map((post) => (
                <article
                  key={post.id}
                  className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <Link href={`/news/${post.slug}`} className="block">
                    <div className="relative aspect-[16/10] bg-powder">
                      {post.cover_image_url ? (
                        <Image
                          src={post.cover_image_url}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 text-muted-foreground">
                          <span className="text-sm font-medium">
                            NADSSU Update
                          </span>
                        </div>
                      )}
                      <div className="absolute left-3 top-3">
                        <span className="rounded-full bg-primary/90 px-2.5 py-1 text-[11px] font-semibold text-white">
                          {post.category || "General"}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="p-5">
                    <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      {post.published_at
                        ? format(parseISO(post.published_at), "MMM d, yyyy")
                        : "Published recently"}
                    </div>

                    <Link href={`/news/${post.slug}`}>
                      <h2 className="mb-2 text-xl font-bold text-navy transition-colors group-hover:text-primary">
                        {post.title}
                      </h2>
                    </Link>

                    {post.summary && (
                      <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {post.summary}
                      </p>
                    )}

                    <Link
                      href={`/news/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
                    >
                      Read story <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

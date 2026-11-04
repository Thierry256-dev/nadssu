import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getSiteConfig } from "@/lib/utils/site-config";
import type {
  NewsPost,
  Event,
  CareerOpportunity,
  Resource,
  GovernanceMember,
} from "@/lib/types";
import { PageBanner } from "@/components/layout/PageBanner";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "News & Updates — NADSSU",
  description:
    "Browse the latest NADSSU news, announcements, events, and member updates.",
};

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const [supabase, config] = await Promise.all([
    createClient(),
    getSiteConfig(),
  ]);

  const [
    { data: posts },
    { data: events },
    { data: opportunities },
    { data: resources },
    { data: governanceMembers },
  ] = await Promise.all([
    supabase
      .from("news_posts")
      .select("*")
      .eq("status", "published")
      .or(`published_at.is.null,published_at.lte.${new Date().toISOString()}`)
      .order("published_at", { ascending: false, nullsFirst: false }),
    supabase
      .from("events")
      .select("*")
      .eq("status", "published")
      .order("start_date", { ascending: false }),
    supabase
      .from("career_opportunities")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false }),
    supabase
      .from("resources")
      .select("*")
      .eq("is_published", true)
      .order("sort_order"),
    supabase
      .from("governance_members")
      .select("*")
      .eq("is_published", true)
      .order("sort_order"),
  ]);

  if (
    posts?.length ||
    events?.length ||
    opportunities?.length ||
    resources?.length ||
    governanceMembers?.length
  ) {
    // keep data ready for rendering
  }

  const news = ((posts as NewsPost[]) ?? []).filter((post) => {
    if (!q) return true;

    const searchable = [
      post.title,
      post.summary,
      post.category,
      post.author,
      post.slug,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchable.includes(q.toLowerCase());
  });

  const searchResults = q
    ? [
        ...((posts as NewsPost[]) ?? []).map((post) => ({
          type: "News",
          title: post.title,
          description: post.summary ?? "",
          meta: post.category || "News",
          href: `/news/${post.slug}`,
        })),
        ...((events as Event[]) ?? []).map((event) => ({
          type: "Event",
          title: event.title,
          description: event.description ?? event.venue ?? "",
          meta: event.category,
          href: `/events/${event.slug}`,
        })),
        ...((opportunities as CareerOpportunity[]) ?? []).map(
          (opportunity) => ({
            type: "Career Hub",
            title: opportunity.title,
            description:
              opportunity.description ?? opportunity.organisation ?? "",
            meta: opportunity.category,
            href: `/career-hub/${opportunity.slug}`,
          }),
        ),
        ...((resources as Resource[]) ?? []).map((resource) => ({
          type: "Resource",
          title: resource.title,
          description: resource.description ?? resource.category ?? "",
          meta: resource.category,
          href: resource.file_url,
        })),
        ...((governanceMembers as GovernanceMember[]) ?? []).map((member) => ({
          type: "Governance",
          title: member.name,
          description: member.position ?? member.bio ?? "",
          meta: "Leadership",
          href: "/governance",
        })),
        ...(q.toLowerCase().includes("contact") ||
        [
          config.contact_email,
          config.contact_address,
          config.contact_phone.join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .includes(q.toLowerCase())
          ? [
              {
                type: "Contact",
                title: "Contact NADSSU",
                description: `${config.contact_email} • ${config.contact_address}`,
                meta: "Contact",
                href: "/contact",
              },
            ]
          : []),
      ].filter((item) => {
        if (!q) return false;
        const target =
          `${item.title} ${item.description} ${item.meta}`.toLowerCase();
        return target.includes(q.toLowerCase());
      })
    : [];

  const searchResultsLabel = q ? `Search results for “${q}”` : "News & Updates";

  return (
    <>
      <PageBanner
        title={searchResultsLabel}
        subtitle={
          q
            ? "Find matches across our news, events, career hub, resources, governance, and contact information."
            : "Latest announcements, stories, and developments from NADSSU."
        }
      >
        <Breadcrumb items={[{ label: "News" }]} />
      </PageBanner>

      <section className="bg-white py-12 lg:py-16">
        <div className="container-site">
          {q ? (
            searchResults.length === 0 ? (
              <div className="rounded-2xl border border-border bg-powder p-10 text-center">
                <h2 className="text-2xl font-bold text-navy">
                  No matching updates found
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Try searching for a keyword related to news, events, careers,
                  or governance.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {searchResults.map((item, index) => (
                  <article
                    key={`${item.type}-${item.title}-${index}`}
                    className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="border-b border-border bg-powder p-3">
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                        {item.type}
                      </span>
                    </div>
                    <div className="p-5">
                      <Link
                        href={item.href}
                        target={item.type === "Resource" ? "_blank" : undefined}
                        rel={
                          item.type === "Resource"
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        <h2 className="mb-2 text-xl font-bold text-navy transition-colors group-hover:text-primary">
                          {item.title}
                        </h2>
                      </Link>

                      {item.description && (
                        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-medium text-muted-foreground">
                          {item.meta}
                        </span>
                        <Link
                          href={item.href}
                          target={
                            item.type === "Resource" ? "_blank" : undefined
                          }
                          rel={
                            item.type === "Resource"
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
                        >
                          View <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )
          ) : news.length === 0 ? (
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
                          width={1200}
                          height={800}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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

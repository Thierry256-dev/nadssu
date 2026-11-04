import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Search,
  Users,
  Lightbulb,
  Building2,
  HeartHandshake,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getSiteConfig } from "@/lib/utils/site-config";
import type {
  NewsPost,
  Partner,
  HomeStat,
  Event,
  CareerOpportunity,
} from "@/lib/types";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { MandateServices } from "@/components/home/MandateServices";
import { PatronPresident } from "@/components/home/PatronPresident";
import { PartnersSection } from "@/components/home/PartnersSection";
import { LatestNews } from "@/components/home/LatestNews";
import { format } from "date-fns";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NADSSU — Nutrition and Dietetics Students' Society of Uganda",
  description:
    "Advancing nutrition and dietetics education, professional development, and community outreach in Uganda.",
};

export default async function HomePage() {
  const [config, supabase] = await Promise.all([
    getSiteConfig(),
    createClient(),
  ]);

  const [
    { data: stats },
    { data: partners },
    { data: news },
    { data: events },
    { data: careerOpportunities },
  ] = await Promise.all([
    supabase
      .from("home_statistics")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order"),
    supabase
      .from("partners")
      .select("*")
      .eq("is_published", true)
      .order("sort_order"),
    supabase
      .from("news_posts")
      .select(
        "id, title, slug, summary, cover_image_url, category, published_at, author",
      )
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(5),
    supabase
      .from("events")
      .select("id, title, slug, category, start_date, status")
      .eq("status", "published")
      .order("start_date", { ascending: false })
      .limit(5),
    supabase
      .from("career_opportunities")
      .select("id, title, slug, category, organisation, created_at")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const visibleNews = (news as NewsPost[]) ?? [];
  const visibleEvents = (events as Event[]) ?? [];
  const visibleCareerOpportunities =
    (careerOpportunities as CareerOpportunity[]) ?? [];

  const heroItems = [
    ...visibleNews.slice(0, 5).map((post) => ({
      label: "News & Updates",
      type: "News",
      title: post.title,
      href: `/news/${post.slug}`,
      meta: post.category || "News",
    })),
    ...visibleEvents.slice(0, 5).map((event) => ({
      label: "Events",
      type: "Event",
      title: event.title,
      href: `/events/${event.slug}`,
      meta: event.category || "Event",
    })),
    ...visibleCareerOpportunities.slice(0, 5).map((opportunity) => ({
      label: "Career Hub",
      type: "Career Hub",
      title: opportunity.title,
      href: `/career-hub/${opportunity.slug}`,
      meta: opportunity.category || "Opportunity",
    })),
  ];

  const heroContentItems =
    heroItems.length > 0
      ? heroItems
      : [
          {
            label: "News & Updates",
            type: "News",
            title: "Latest NADSSU updates",
            href: "/news",
            meta: "News",
          },
          {
            label: "Events",
            type: "Event",
            title: "Upcoming events and workshops",
            href: "/events",
            meta: "Events",
          },
          {
            label: "Career Hub",
            type: "Career Hub",
            title: "Career opportunities",
            href: "/career-hub",
            meta: "Career",
          },
          {
            label: "Resources",
            type: "Resources",
            title: "Useful resources",
            href: "/resources",
            meta: "Resources",
          },
        ];

  return (
    <>
      {config.announcement && (
        <div className="bg-primary text-primary-foreground text-center text-sm py-2 px-4">
          {config.announcement}
        </div>
      )}

      <HeroSection config={config} items={heroContentItems} />
      <StatsSection stats={(stats as HomeStat[]) ?? []} />
      <MandateServices config={config} />
      <PatronPresident config={config} />
      <PartnersSection partners={(partners as Partner[]) ?? []} />
      <LatestNews posts={visibleNews} />
    </>
  );
}

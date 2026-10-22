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
import type { NewsPost, Partner, HomeStat } from "@/lib/types";
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

  const [{ data: stats }, { data: partners }, { data: news }] =
    await Promise.all([
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
        .limit(3),
    ]);

  const visibleNews = ((news as NewsPost[]) ?? []).filter((post) => {
    if (!post.published_at) return true;
    return new Date(post.published_at).getTime() <= Date.now();
  });

  return (
    <>
      {/* Announcement strip */}
      {config.announcement && (
        <div className="bg-primary text-primary-foreground text-center text-sm py-2 px-4">
          {config.announcement}
        </div>
      )}

      <HeroSection config={config} />
      <StatsSection stats={(stats as HomeStat[]) ?? []} />
      <MandateServices config={config} />
      <PatronPresident config={config} />
      <PartnersSection partners={(partners as Partner[]) ?? []} />
      <LatestNews posts={visibleNews} />
    </>
  );
}

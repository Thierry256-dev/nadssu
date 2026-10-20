import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PageBanner } from "@/components/layout/PageBanner";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { CareerHubContent } from "@/components/career-hub/CareerHubContent";
import type { CareerOpportunity } from "@/lib/types";

export const metadata: Metadata = {
  title: "Career Hub — NADSSU",
  description:
    "Explore internships, job adverts, volunteering opportunities, and research grants for nutrition and dietetics professionals.",
};

export default async function CareerHubPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("career_opportunities")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (params.category && params.category !== "All") {
    query = query.eq("category", params.category);
  }

  const { data: opportunities } = await query;

  return (
    <>
      <PageBanner
        title="Career Hub"
        subtitle="Explore opportunities and grow your career."
      >
        <Breadcrumb items={[{ label: "Career Hub" }]} />
      </PageBanner>
      <CareerHubContent
        opportunities={(opportunities as CareerOpportunity[]) ?? []}
        initialCategory={params.category ?? "All"}
        initialSearch={params.q ?? ""}
      />
    </>
  );
}

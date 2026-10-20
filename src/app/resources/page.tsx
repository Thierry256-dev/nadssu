import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PageBanner } from "@/components/layout/PageBanner";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ResourcesContent } from "@/components/resources/ResourcesContent";
import type { Resource } from "@/lib/types";

export const metadata: Metadata = {
  title: "Resources — NADSSU",
  description:
    "Download official NADSSU documents including the constitution, work plans, membership certificates, and other resources.",
};

export default async function ResourcesPage() {
  const supabase = await createClient();
  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .eq("is_published", true)
    .order("sort_order")
    .order("created_at", { ascending: false });

  return (
    <>
      <PageBanner
        title="Resources"
        subtitle="Documents, guides, and useful materials."
      >
        <Breadcrumb items={[{ label: "Resources" }]} />
      </PageBanner>
      <ResourcesContent resources={(resources as Resource[]) ?? []} />
    </>
  );
}

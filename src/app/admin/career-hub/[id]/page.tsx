import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CareerOpportunityForm } from "@/components/admin/career-hub/CareerOpportunityForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Edit Opportunity",
  description: "Update an existing opportunity in the career hub.",
};

export default async function EditCareerOpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("career_opportunities")
    .select(
      "id,title,slug,category,organisation,org_logo_url,featured_image_url,description,location,work_mode,funding_details,duration,deadline,opens_at,application_link,contact_email,status,is_featured",
    )
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
              Career hub
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy">
              Edit opportunity
            </h1>
          </div>
          <Link
            href="/admin/career-hub"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </Link>
        </div>

        <div className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <CareerOpportunityForm
            initialValues={{
              id: data.id,
              title: data.title,
              slug: data.slug,
              category: data.category,
              organisation: data.organisation ?? "",
              org_logo_url: data.org_logo_url ?? "",
              featured_image_url: data.featured_image_url ?? "",
              description: data.description ?? "",
              location: data.location ?? "",
              work_mode: data.work_mode ?? "Remote",
              funding_details: data.funding_details ?? "",
              duration: data.duration ?? "",
              deadline: data.deadline ?? "",
              opens_at: data.opens_at ?? "",
              application_link: data.application_link ?? "",
              contact_email: data.contact_email ?? "",
              status: data.status,
              is_featured: data.is_featured,
            }}
          />
        </div>
      </div>
    </main>
  );
}

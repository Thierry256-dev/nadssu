import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CareerOpportunityForm } from "@/components/admin/career-hub/CareerOpportunityForm";

export const metadata: Metadata = {
  title: "New Opportunity",
  description:
    "Create a new internship, job advert, grant, or volunteer opportunity.",
};

export default function NewCareerOpportunityPage() {
  return (
    <main className="bg-[linear-gradient(180deg,#f7faf7_0%,#ffffff_100%)]">
      <div className="container-site py-8 lg:py-12">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Career hub
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy">
              Create opportunity
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
          <CareerOpportunityForm />
        </div>
      </div>
    </main>
  );
}

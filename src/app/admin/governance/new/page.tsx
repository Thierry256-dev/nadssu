import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GovernanceMemberForm } from "@/components/admin/governance/GovernanceMemberForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Add Governance Member",
  description: "Add a governance member profile.",
};

export default async function NewGovernanceMemberPage() {
  const supabase = await createClient();
  const { data: units, error } = await supabase
    .from("governance_units")
    .select("id,title")
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Unable to load governance units: ${error.message}`);
  }

  return (
    <main className="bg-[linear-gradient(180deg,#f7faf7_0%,#ffffff_100%)]">
      <div className="container-site py-8 lg:py-12">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Governance
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy">
              Add member
            </h1>
          </div>
          <Link
            href="/admin/governance"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </Link>
        </div>

        <div className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <GovernanceMemberForm units={units ?? []} />
        </div>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { GovernanceMemberForm } from "@/components/admin/governance/GovernanceMemberForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Edit Governance Member",
  description: "Update a governance member profile.",
};

export default async function EditGovernanceMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: member, error: memberError }, { data: units, error: unitsError }] =
    await Promise.all([
      supabase
        .from("governance_members")
        .select("id,name,position,unit_id,bio,photo_url,email,sort_order,is_published")
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("governance_units")
        .select("id,title")
        .order("sort_order", { ascending: true }),
    ]);

  if (memberError) {
    throw new Error(`Unable to load governance member: ${memberError.message}`);
  }
  if (!member) {
    notFound();
  }
  if (unitsError) {
    throw new Error(`Unable to load governance units: ${unitsError.message}`);
  }

  return (
    <main className="bg-[linear-gradient(180deg,#f7faf7_0%,#ffffff_100%)]">
      <div className="container-site py-8 lg:py-12">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Governance
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy">Edit member</h1>
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
          <GovernanceMemberForm
            units={units ?? []}
            initialValues={{
              id: member.id,
              name: member.name,
              position: member.position,
              unit_id: member.unit_id ?? "",
              bio: member.bio ?? "",
              photo_url: member.photo_url ?? "",
              email: member.email ?? "",
              sort_order: member.sort_order,
              is_published: member.is_published,
            }}
          />
        </div>
      </div>
    </main>
  );
}

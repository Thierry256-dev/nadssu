import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PageBanner } from "@/components/layout/PageBanner";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { GovernanceContent } from "@/components/governance/GovernanceContent";
import type { GovernanceMember, GovernanceUnit } from "@/lib/types";

export const metadata: Metadata = {
  title: "Governance — NADSSU",
  description:
    "NADSSU's leadership structure, governance chart, and department profiles.",
};

export default async function GovernancePage() {
  const supabase = await createClient();
  const [{ data: units }, { data: members }] = await Promise.all([
    supabase
      .from("governance_units")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order"),
    supabase
      .from("governance_members")
      .select("*, governance_units(title)")
      .eq("is_published", true)
      .order("sort_order"),
  ]);

  return (
    <>
      <PageBanner
        title="Governance"
        subtitle="Our leadership and organisational structure."
      >
        <Breadcrumb items={[{ label: "Governance" }]} />
      </PageBanner>
      <GovernanceContent
        units={(units as GovernanceUnit[]) ?? []}
        members={(members as GovernanceMember[]) ?? []}
      />
    </>
  );
}

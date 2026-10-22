import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getSiteConfig } from "@/lib/utils/site-config";
import { SiteSettingsForm } from "@/components/admin/settings/SiteSettingsForm";

export const metadata: Metadata = {
  title: "Site Settings",
  description: "Manage the website's branding and global configuration values.",
};

export default async function SettingsAdminPage() {
  const supabase = await createClient();
  const config = await getSiteConfig();
  const { data: rows } = await supabase
    .from("site_settings")
    .select("id,key,value,updated_at")
    .order("key", { ascending: true })
    .limit(100);

  return (
    <main className="bg-[linear-gradient(180deg,#f7faf7_0%,#ffffff_100%)]">
      <div className="container-site py-8 lg:py-12">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Settings
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy">
              Website settings
            </h1>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </div>

        <div className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <SiteSettingsForm
            initialConfig={config}
            currentRows={(rows ?? []) as Array<{ key: string; value: unknown }>}
          />
        </div>
      </div>
    </main>
  );
}

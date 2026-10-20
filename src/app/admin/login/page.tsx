import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin Sign In",
  description: "Secure sign in for NADSSU administrators.",
};

export default async function AdminLoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <main className="min-h-[calc(100vh-12rem)] bg-gradient-to-br from-primary/8 via-background to-secondary/10">
      <div className="container-site py-12 lg:py-16">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-border bg-white shadow-sm">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative hidden overflow-hidden bg-navy p-8 text-white lg:block">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_35%)]" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <div className="inline-flex rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/75">
                    NADSSU Admin
                  </div>
                  <h1 className="mt-6 max-w-md text-4xl font-bold leading-tight">
                    Content management for the national student nutrition
                    network.
                  </h1>
                </div>

                <div className="space-y-4 text-sm text-white/75">
                  <p>
                    Manage pages, events, news, resources, members, governance,
                    and youth programmes from one place.
                  </p>
                  <ul className="space-y-2 text-white/80">
                    <li>• Publish news and updates</li>
                    <li>• Maintain governance and advisor profiles</li>
                    <li>• Review membership applications and enquiries</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center bg-white p-6 sm:p-8 lg:p-12">
              <div className="w-full max-w-md">
                <Link
                  href="/"
                  className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to website
                </Link>
                <AdminLoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

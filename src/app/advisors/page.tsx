import type { Metadata } from "next";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { PageBanner } from "@/components/layout/PageBanner";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { UserCircle2, ExternalLink, Globe } from "lucide-react";
import type { Advisor } from "@/lib/types";

export const metadata: Metadata = {
  title: "Advisors — NADSSU",
  description:
    "Meet NADSSU's distinguished advisors who guide our mission and professional development.",
};

export default async function AdvisorsPage() {
  const supabase = await createClient();
  const { data: advisors } = await supabase
    .from("advisors")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");

  return (
    <>
      <PageBanner
        title="Advisors"
        subtitle="Distinguished professionals who guide NADSSU's mission."
      >
        <Breadcrumb
          items={[
            { label: "Governance", href: "/governance" },
            { label: "Advisors" },
          ]}
        />
      </PageBanner>

      <section className="py-14 lg:py-20 bg-white">
        <div className="container-site">
          {!advisors || advisors.length === 0 ? (
            <div className="text-center py-20 bg-powder rounded-xl border border-border">
              <p className="text-muted-foreground text-sm">
                Advisor profiles will appear here once published.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(advisors as Advisor[]).map((advisor) => (
                <div
                  key={advisor.id}
                  className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48 bg-powder">
                    {advisor.photo_url ? (
                      <Image
                        src={advisor.photo_url}
                        alt={advisor.name}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <UserCircle2
                          size={64}
                          className="text-muted-foreground/30"
                        />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-navy text-lg mb-0.5">
                      {advisor.name}
                    </h3>
                    <p className="text-primary text-sm font-semibold mb-3">
                      {advisor.title}
                    </p>
                    {advisor.background && (
                      <p className="text-xs text-muted-foreground mb-3">
                        {advisor.background}
                      </p>
                    )}
                    {advisor.bio && (
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-4">
                        {advisor.bio}
                      </p>
                    )}
                    {advisor.qualifications && (
                      <p className="text-xs text-navy/60 mb-3 italic">
                        {advisor.qualifications}
                      </p>
                    )}
                    {advisor.professional_links && (
                      <div className="flex gap-2 mt-3">
                        {advisor.professional_links.linkedin && (
                          <a
                            href={advisor.professional_links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <Globe size={12} /> LinkedIn
                          </a>
                        )}
                        {advisor.professional_links.website && (
                          <a
                            href={advisor.professional_links.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <ExternalLink size={12} /> Website
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

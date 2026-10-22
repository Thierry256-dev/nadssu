import type { Metadata } from "next";
import { ContactForm } from "@/components/public/ContactForm";
import { PageBanner } from "@/components/layout/PageBanner";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { createClient } from "@/lib/supabase/server";
import { getSiteConfig } from "@/lib/utils/site-config";

export const metadata: Metadata = {
  title: "Contact NADSSU",
  description: "Get in touch with NADSSU and send us an enquiry or message.",
};

export default async function ContactPage() {
  const [config, supabase] = await Promise.all([
    getSiteConfig(),
    createClient(),
  ]);

  const { data: contactNumbers } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "contact_phone")
    .single();

  const phoneList = contactNumbers?.value
    ? Array.isArray(contactNumbers.value)
      ? contactNumbers.value
      : [String(contactNumbers.value)]
    : config.contact_phone;

  return (
    <>
      <PageBanner
        title="Contact NADSSU"
        subtitle="We would love to hear from you."
      >
        <Breadcrumb items={[{ label: "Contact" }]} />
      </PageBanner>

      <main className="container-site py-10 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6 rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Reach us
              </p>
              <h2 className="mt-2 text-3xl font-bold text-navy">
                Let&apos;s connect
              </h2>
            </div>

            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Send an enquiry, ask a question, or reach out about
                partnerships, membership, or collaboration opportunities.
              </p>
              <p>
                We will reply through the email address you provide or by
                WhatsApp, depending on the contact method you choose.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl bg-muted/30 p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Email
                </p>
                <a
                  href={`mailto:${config.contact_email}`}
                  className="mt-1 block text-base font-medium text-navy"
                >
                  {config.contact_email}
                </a>
              </div>

              {phoneList.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    WhatsApp
                  </p>
                  {phoneList.map((phone) => (
                    <a
                      key={phone}
                      href={`https://wa.me/${String(phone).replace(/\D/g, "") || "256700000000"}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block text-base font-medium text-navy"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              )}

              {config.contact_address && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    Address
                  </p>
                  <p className="mt-1 text-base font-medium text-navy">
                    {config.contact_address}
                  </p>
                </div>
              )}
            </div>
          </div>

          <ContactForm />
        </div>
      </main>
    </>
  );
}

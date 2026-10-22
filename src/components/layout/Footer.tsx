import Link from "next/link";
import Image from "next/image";
import { Globe, Mail, Phone, MapPin } from "lucide-react";
import type { SiteConfig } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

const QUICK_LINKS = [
  { label: "About NADSSU", href: "/about" },
  { label: "Membership", href: "/members" },
  { label: "Governance", href: "/governance" },
  { label: "Career Hub", href: "/career-hub" },
  { label: "Resources", href: "/resources" },
  { label: "Events", href: "/events" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

const SOCIAL_ICONS = {
  facebook: Globe,
  twitter: Globe,
  instagram: Globe,
  linkedin: Globe,
  youtube: Globe,
};

interface FooterProps {
  config: SiteConfig;
}

export async function Footer({ config }: FooterProps) {
  const year = new Date().getFullYear();
  const socialEntries = Object.entries(config.social_links ?? {}).filter(
    ([, v]) => v,
  );

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminHref = user ? "/admin" : "/admin/login";
  const adminLabel = user ? "Dashboard" : "Sign in";

  const logoSrc = config.logo_url ?? "/logo.png";

  return (
    <footer className="section-navy mt-auto">
      <div className="container-site py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              {logoSrc ? (
                <Image
                  src={logoSrc}
                  alt={`${config.site_name} logo`}
                  width={40}
                  height={40}
                  className="h-10 w-auto object-contain brightness-0 invert"
                />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-primary/80 flex items-center justify-center text-white font-bold text-sm">
                  ND
                </div>
              )}
              <div>
                <span className="font-bold text-white text-base block leading-tight">
                  {config.site_name}
                </span>
                <span className="text-xs text-white/60 block leading-tight">
                  {config.site_tagline}
                </span>
              </div>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed max-w-xs">
              {config.footer_description}
            </p>
            {/* Social links */}
            {socialEntries.length > 0 && (
              <div className="flex items-center gap-3 mt-5">
                {socialEntries.map(([platform, url]) => {
                  const Icon =
                    SOCIAL_ICONS[platform as keyof typeof SOCIAL_ICONS];
                  if (!Icon) return null;
                  return (
                    <a
                      key={platform}
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${config.site_name} on ${platform}`}
                      className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all"
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              Contact
            </h3>
            <ul className="space-y-3">
              {config.contact_email && (
                <li>
                  <a
                    href={`mailto:${config.contact_email}`}
                    className="flex items-start gap-2.5 text-sm text-white/70 hover:text-white transition-colors"
                  >
                    <Mail size={15} className="mt-0.5 shrink-0 text-white/40" />
                    {config.contact_email}
                  </a>
                </li>
              )}
              {config.contact_phone?.map((phone) => (
                <li key={phone}>
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="flex items-start gap-2.5 text-sm text-white/70 hover:text-white transition-colors"
                  >
                    <Phone
                      size={15}
                      className="mt-0.5 shrink-0 text-white/40"
                    />
                    {phone}
                  </a>
                </li>
              ))}
              {config.contact_address && (
                <li className="flex items-start gap-2.5 text-sm text-white/70">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-white/40" />
                  {config.contact_address}
                </li>
              )}
            </ul>
          </div>

          {/* Admin portal */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              Administration
            </h3>
            <Link
              href={adminHref}
              className="inline-block text-sm text-white/70 hover:text-white transition-colors"
            >
              {adminLabel} →
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>
            &copy; {year} {config.site_name}. All rights reserved.
          </p>
          <p>Nutrition and Dietetics Students&apos; Society of Uganda</p>
        </div>
      </div>
    </footer>
  );
}

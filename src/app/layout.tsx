import type { Metadata } from "next";
import "./globals.css";
import { getSiteConfig } from "@/lib/utils/site-config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  return {
    title: {
      default: `${config.site_name} — ${config.site_tagline}`,
      template: `%s | ${config.site_name}`,
    },
    description: config.site_description,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://nadssu.org",
    ),
    openGraph: {
      type: "website",
      siteName: config.site_name,
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getSiteConfig();

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header config={config} />
        <main className="flex-1">{children}</main>
        <Footer config={config} />
      </body>
    </html>
  );
}

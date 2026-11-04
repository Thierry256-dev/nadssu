"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteConfig } from "@/lib/types";

interface HeroContentItem {
  label: string;
  type: string;
  title: string;
  href: string;
  meta: string;
}

interface HeroSectionProps {
  config: SiteConfig;
  items?: HeroContentItem[];
}

export function HeroSection({ config, items = [] }: HeroSectionProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const marqueeItems =
    items.length > 0
      ? [...items, ...items]
      : [
          {
            label: "News & Updates",
            type: "News",
            title: "Latest NADSSU updates",
            href: "/news",
            meta: "News",
          },
          {
            label: "Events",
            type: "Event",
            title: "Upcoming events and workshops",
            href: "/events",
            meta: "Event",
          },
          {
            label: "Career Hub",
            type: "Career Hub",
            title: "Career opportunities",
            href: "/career-hub",
            meta: "Career",
          },
          {
            label: "Resources",
            type: "Resources",
            title: "Useful resources",
            href: "/resources",
            meta: "Resource",
          },
        ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/news?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const heroImageSrc = config.hero_image_url || "/images/hero-image.jpg";

  return (
    <section className="relative overflow-hidden bg-navy min-h-[580px] flex items-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={heroImageSrc}
          alt="NADSSU hero banner"
          fill
          className="object-cover opacity-80"
          priority
          sizes="100vw"
        />
      </div>

      {/* Green gradient overlay from bottom left */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 via-primary/45 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/40 to-blue-brand/10" />

      <div className="relative container-site py-20 lg:py-28 z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-3 py-1 bg-primary/20 text-white/90 rounded-full text-sm font-medium mb-6 border border-primary/30">
              Nutrition &amp; Dietetics Students&apos; Society of Uganda
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            {config.hero_heading}
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-white/75 leading-relaxed mb-8 max-w-2xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {config.hero_subheading}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              href={config.hero_cta_primary.href}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              {config.hero_cta_primary.label}
              <ArrowRight size={16} />
            </Link>
            <Link
              href={config.hero_cta_secondary.href}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg font-semibold border border-white/20 hover:bg-white/20 transition-all"
            >
              {config.hero_cta_secondary.label}
            </Link>
          </motion.div>

          {/* Search */}
          <motion.form
            onSubmit={handleSearch}
            className="flex gap-2 max-w-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search news, events, resources…"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary/60 text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
            >
              Search
            </button>
          </motion.form>
        </div>
      </div>

      {/* Quick nav strip */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="bg-white/10 backdrop-blur-sm border-t border-white/10 overflow-hidden">
          <div className="container-site">
            <div className="hero-marquee-track flex w-max min-w-full">
              {marqueeItems.map((item, index) => (
                <Link
                  key={`${item.href}-${index}`}
                  href={item.href}
                  className="group flex-shrink-0 w-[260px] border-r border-white/10 px-4 py-3 text-left last:border-r-0 hover:bg-white/10 transition-colors"
                >
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                    {item.type}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white group-hover:text-blue-light transition-colors line-clamp-1">
                    {item.title}
                  </div>
                  <div className="mt-1 text-[11px] text-white/55">
                    {item.meta}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

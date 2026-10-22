"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Building,
  Clock,
  ImageIcon,
  ExternalLink,
} from "lucide-react";
import { format, parseISO, isPast } from "date-fns";
import type { CareerOpportunity } from "@/lib/types";

const CATEGORIES = [
  "All",
  "Internship",
  "Job Advert",
  "Volunteering & Resources",
  "Research Grant",
];

const CATEGORY_COLOURS: Record<string, string> = {
  Internship: "bg-blue-100 text-blue-700",
  "Job Advert": "bg-green-100 text-green-700",
  "Volunteering & Resources": "bg-purple-100 text-purple-700",
  "Research Grant": "bg-orange-100 text-orange-700",
};

interface CareerHubContentProps {
  opportunities: CareerOpportunity[];
  initialCategory: string;
  initialSearch: string;
}

export function CareerHubContent({
  opportunities,
  initialCategory,
  initialSearch,
}: CareerHubContentProps) {
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const router = useRouter();

  const filtered = useMemo(() => {
    return opportunities.filter((o) => {
      const matchCat = category === "All" || o.category === category;
      const matchSearch =
        !search.trim() ||
        o.title.toLowerCase().includes(search.toLowerCase()) ||
        (o.description ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (o.organisation ?? "").toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [opportunities, category, search]);

  const handleCategory = (cat: string) => {
    setCategory(cat);
    router.push(`/career-hub?category=${encodeURIComponent(cat)}`, {
      scroll: false,
    });
  };

  return (
    <section className="py-10 lg:py-14 bg-white">
      <div className="container-site">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search opportunities…"
              className="w-full pl-9 pr-4 py-2.5 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-white"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter size={14} className="text-muted-foreground shrink-0" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  category === cat
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-muted-foreground border-border hover:border-primary/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-powder rounded-xl border border-border">
            <p className="text-muted-foreground text-sm">
              No opportunities found matching your filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {filtered.map((opp, i) => {
                const isClosed = opp.deadline
                  ? isPast(parseISO(opp.deadline))
                  : false;
                return (
                  <motion.article
                    key={opp.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className={`flex gap-4 p-5 bg-white border border-border rounded-xl hover:shadow-md transition-all ${
                      isClosed ? "opacity-60" : ""
                    }`}
                  >
                    {/* Logo */}
                    <div className="shrink-0 w-14 h-14 rounded-lg bg-powder border border-border flex items-center justify-center overflow-hidden">
                      {opp.org_logo_url ? (
                        <Image
                          src={opp.org_logo_url}
                          alt={opp.organisation ?? ""}
                          width={56}
                          height={56}
                          className="object-contain"
                        />
                      ) : (
                        <Building
                          size={22}
                          className="text-muted-foreground/50"
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-navy text-base leading-snug">
                          {opp.title}
                        </h3>
                        {isClosed && (
                          <span className="shrink-0 px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full font-medium">
                            Closed
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${CATEGORY_COLOURS[opp.category] ?? "bg-gray-100 text-gray-600"}`}
                        >
                          {opp.category}
                        </span>
                        {opp.organisation && (
                          <span className="text-xs text-muted-foreground">
                            {opp.organisation}
                          </span>
                        )}
                        {opp.location && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin size={11} /> {opp.location}
                          </span>
                        )}
                        {opp.work_mode && (
                          <span className="text-xs text-muted-foreground">
                            {opp.work_mode}
                          </span>
                        )}
                      </div>

                      {opp.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                          {opp.description.replace(/<[^>]*>/g, "")}
                        </p>
                      )}

                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-3">
                          {opp.deadline && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar size={11} />
                              Deadline:{" "}
                              {format(parseISO(opp.deadline), "MMM d, yyyy")}
                            </span>
                          )}
                          {opp.duration && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock size={11} /> {opp.duration}
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/career-hub/${opp.slug || opp.id}`}
                          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                        >
                          View Details <ExternalLink size={11} />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}

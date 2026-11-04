"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight, Target, Zap } from "lucide-react";
import type { SiteConfig } from "@/lib/types";

interface MandateServicesProps {
  config: SiteConfig;
}

export function MandateServices({ config }: MandateServicesProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  void config;

  return (
    <section className="py-14 lg:py-20 bg-white" ref={ref}>
      <div className="container-site">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Mandate */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.45 }}
            className="rounded-2xl border border-border bg-white p-8 hover:shadow-md transition-shadow group"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-colors">
              <Target size={22} />
            </div>
            <h2 className="text-xl font-bold text-navy mb-3">Our Mandate</h2>
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                NADSSU is mandated by its 2024 Constitution to serve as the
                collective voice of nutrition and dietetics students across
                Uganda uniting, representing, and advocating for policies and
                programs that enhance nutrition education, research, and
                practice while fostering academic excellence and professional
                development through workshops, seminars, and conferences,
                encouraging and supporting research in the field, engaging in
                community outreach to raise public awareness about healthy
                eating habits, and contributing to national well-being and
                livelihood through evidence-based nutrition and dietetics
                initiatives.
              </p>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2.5 transition-all mt-5"
            >
              Learn More <ArrowRight size={14} />
            </Link>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="rounded-2xl border border-border bg-powder p-8 hover:shadow-md transition-shadow group"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-colors">
              <Zap size={22} />
            </div>
            <h2 className="text-xl font-bold text-navy mb-3">Our Services</h2>
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                Aligned with the constitutional roles of the Executive Board and
                specific officers, NADSSU provides a comprehensive suite of
                services to its members-including the coordination of
                educational programs, seminars, workshops, and training
                sessions, alongside career guidance and the identification of
                scholarships, internships, and fellowships through the Education
                and Professional Development Officer; the organization of
                research seminars and conferences, identification of research
                grants, maintenance of records on student innovations, and
                promotion of student research publication in newsletters and
                academic platforms; the fostering of partnerships with
                institutions, agencies, and non-profit organizations while
                building networks among students, professionals, and
                organizations in the nutrition field; the engagement in
                community outreach activities that raise awareness about
                nutrition and healthy eating habits and contribute to national
                well-being and livelihood; and the coordination with
                institutional representatives (Parliament) to mobilize members
                and ensure that student views from different institutions are
                presented to the Executive.
              </p>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2.5 transition-all mt-5"
            >
              Learn More <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import type { SiteConfig } from "@/lib/types";

interface PatronPresidentProps {
  config: SiteConfig;
}

const partnerLogos = [
  "/images/sponsors/Aasna.png",
  "/images/sponsors/BackgroundEraser_20261104_133716109.png",
  "/images/sponsors/Bugema.png",
  "/images/sponsors/Earnest.png",
  "/images/sponsors/Gulu.png",
  "/images/sponsors/Iufnsa.png",
  "/images/sponsors/Kyundsa.png",
  "/images/sponsors/Mccnsa.png",
  "/images/sponsors/Muhunsa.png",
  "/images/sponsors/Tnsou.png",
  "/images/sponsors/Ucu.png",
  "/images/sponsors/Vunut.png",
];

function MessageCard({
  name,
  title,
  imageUrl,
  delay,
  message,
}: {
  name: string;
  title: string;
  imageUrl?: string | null;
  delay: number;
  message: string[];
}) {
  const [expanded, setExpanded] = useState(false);
  const visibleMessage = expanded ? message : message.slice(0, 3);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className="flex flex-col gap-6 rounded-2xl border border-border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-4">
        <div className="shrink-0 overflow-hidden rounded-full border-2 border-border bg-powder">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              width={96}
              height={96}
              className="h-[96px] w-[96px] object-cover"
            />
          ) : (
            <div className="flex h-[96px] w-[96px] items-center justify-center text-sm font-semibold text-muted-foreground">
              {name.charAt(0)}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wide text-primary">
            {title}
          </div>
          <h3 className="mt-1 text-xl font-bold text-navy font-[Georgia,serif]">
            {name}
          </h3>
        </div>
      </div>

      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground text-justify">
        {visibleMessage.map((paragraph, index) => (
          <p key={`${paragraph}-${index}`}>{paragraph}</p>
        ))}
      </div>

      {message.length > 3 && (
        <button
          type="button"
          onClick={() => setExpanded((previous) => !previous)}
          className="mt-2 inline-flex self-start rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
        >
          {expanded ? "View less" : "View more"}
        </button>
      )}
    </motion.article>
  );
}

export function PatronPresident({ config }: PatronPresidentProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const patronMessage = [
    "A Welcome Message from Our Patron",
    "Assistant Commissioner, Nutrition Division, Ministry of Health / Patron, NADSSU",
    "I am pleased to welcome you to the NADSSU website. The Nutrition and Dietetics Students' Society of Uganda (NADSSU) is a student-led, non-political, and non-profit-making organisation established under its 2024 Constitution to represent and advance the interests of nutrition and dietetics students across Uganda.",
    "The Society is guided by the philosophy of unity, inclusiveness, and respect, as enshrined in our Preamble, in order to build mutual relationships with all stakeholders. We are also guided by our vision—to create a dynamic and inclusive community where students of nutrition and dietetics are equipped with knowledge, innovative thinking, and practical skills to achieve their full potential and significantly contribute to global health and well-being—and by our mission to unite and support students through academic excellence, professional development, and advocacy for sustainable and healthy lifestyles.",
    "Guided by our vision, mission, and the thirteen aims and objectives, the Society is committed to promoting academic excellence, fostering professional development through workshops, seminars, and conferences, supporting research in nutrition and dietetics, and engaging in community outreach and public education that address the nutritional needs of our nation. In all our processes, we remain committed to working with professionals, academic institutions, and experts in the field of nutrition and dietetics, in line with our mandate. We encourage students, practitioners, and partners who share our commitment to improving Uganda's nutritional health to join us in recognising and advancing competencies for competitiveness and professional growth.",
    "I invite you to partner with NADSSU to drive academic excellence, professional development, research, and community outreach in nutrition and dietetics, as well as the promotion of our profession across Uganda.",
  ];

  const presidentMessage = [
    "A Welcome Message from Our President",
    "President, Nutrition and Dietetics Students' Society of Uganda (NADSSU), Human Nutrition and Dietetics, Year 4, Kyambogo University",
    "I am honoured to welcome you to the official website of the Nutrition and Dietetics Students' Society of Uganda (NADSSU). As President, and as the executive head of this Association, it is my privilege to lead a Society that is student-led, non-political, and non-profit-making—one established to represent and advance the interests of nutrition and dietetics students across Uganda.",
    "Our Society is anchored in the philosophy of unity, inclusiveness, and respect, as enshrined in our Preamble. We are guided by our vision—to create a dynamic and inclusive community where students of nutrition and dietetics are equipped with knowledge, innovative thinking, and practical skills to achieve their full potential and significantly contribute to global health and well-being—and by our mission to unite and support students through academic excellence, professional development, and advocacy for sustainable and healthy lifestyles.",
    "Guided by this vision, our mission, and the thirteen aims and objectives set out in Article II of our Constitution, we are committed to promoting academic excellence, fostering professional development through workshops, seminars, and conferences, supporting research in nutrition and dietetics, and engaging in community outreach and public education that address the nutritional needs of our nation. In all our processes, we remain committed to working with professionals, academic institutions, and experts in the field of nutrition and dietetics, in line with our mandate.",
    "As your President, I am particularly proud of the strides we are making—from hosting the 2nd Annual National Nutrition Quiz in partnership with Victoria University, to preparing our members for the African Nutrition Quiz Competition through our Research and Innovation Department, and honouring the women in health and nutrition who strengthen our profession. These initiatives reflect the very spirit of our Constitution: representation, professionalism, and service.",
    "I invite students, practitioners, academic institutions, and partners who share our commitment to improving Uganda's nutritional health to join us in recognising and advancing competencies for competitiveness and professional growth. Together, let us build a cohesive and empowered community that contributes significantly to the health and prosperity of our nation and beyond.",
    "Thank you for visiting, and I look forward to partnering with you as we drive academic excellence, professional development, research, and community outreach in nutrition and dietetics across Uganda.",
  ];

  return (
    <>
      <section className="section-powder py-14 lg:py-20" ref={ref}>
        <div className="container-site">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-navy mb-2 font-[Georgia,serif]">
              Our Patron &amp; President
            </h2>
            <p className="text-muted-foreground text-sm">
              Leadership guiding NADSSU&apos;s mission
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {inView && (
              <>
                <MessageCard
                  name={config.patron_name || "Dr. Samalie Namukose"}
                  title={"Patron"}
                  imageUrl={
                    config.patron_image_url || "/images/governance/patron.png"
                  }
                  delay={0.1}
                  message={patronMessage}
                />
                <MessageCard
                  name={config.president_name || "Byazarwa Christopher"}
                  title={"President"}
                  imageUrl={
                    config.president_image_url ||
                    "/images/governance/president.png"
                  }
                  delay={0.2}
                  message={presidentMessage}
                />
              </>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-20">
        <div className="container-site">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="mb-8 text-center"
          >
            <h2 className="text-2xl font-bold text-navy mb-2 font-[Georgia,serif]">
              Our Partners / Keyholders
            </h2>
            <p className="text-muted-foreground text-sm">
              Organizations and partners supporting our mission
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 items-center">
            {partnerLogos.map((logo, index) => (
              <motion.div
                key={logo}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="flex h-28 items-center justify-center rounded-2xl border border-border bg-white p-4 shadow-sm transition-transform duration-200 hover:scale-105"
              >
                <Image
                  src={logo}
                  alt="Partner logo"
                  width={120}
                  height={80}
                  className="max-h-16 w-auto object-contain transition-transform duration-200 hover:scale-110"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

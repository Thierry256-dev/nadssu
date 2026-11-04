"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import DOMPurify from "dompurify";
import type { PageSection } from "@/lib/types";

const SECTION_STYLES: Record<string, string> = {
  about_nadssu: "bg-white",
  profile: "bg-powder",
  who_we_are: "bg-white",
  motto: "bg-navy text-white",
  vision: "bg-white",
  mission: "bg-powder",
  aims_objectives: "bg-white",
};

function SectionBlock({
  section,
  index,
}: {
  section: PageSection;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const style = SECTION_STYLES[section.section_key] ?? "bg-white";
  const isDark = section.section_key === "motto";

  const sanitizedContent =
    typeof window !== "undefined" && section.content
      ? DOMPurify.sanitize(section.content)
      : (section.content ?? "");

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className={`py-12 lg:py-16 ${style}`}
    >
      <div className="container-site">
        <div className="max-w-3xl">
          {section.title && (
            <h2
              className={`text-2xl lg:text-3xl font-bold mb-5 ${isDark ? "text-white" : "text-navy"}`}
            >
              {section.title}
            </h2>
          )}
          <div
            className={`prose-nadssu ${isDark ? "text-white/80 [&_p]:text-white/80 [&_strong]:text-white [&_a]:text-blue-light" : ""}`}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>
      </div>
    </motion.section>
  );
}

const DEFAULT_SECTIONS: PageSection[] = [
  {
    id: "1",
    page: "about",
    section_key: "about_nadssu",
    title: "About NADSSU",
    content:
      "<p>The Nutrition and Dietetics Students' Society of Uganda (NADSSU) is a student-led, non-political, and non-profit-making organisation established to represent and advance the interests of nutrition and dietetics students across Uganda.</p>",
    sort_order: 1,
    is_visible: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    page: "about",
    section_key: "who_we_are",
    title: "Who We Are",
    content:
      "<p>NADSSU brings together students enrolled in higher institutions of learning in Uganda pursuing Nutrition and Dietetics. Regular membership is automatic upon enrolment in any institution of higher learning in Uganda pursuing Nutrition and Dietetics studies, with no formal application required. Associate membership extends to NADSSU alumni, staff, and other interested individuals, who may participate in events and activities but do not hold voting rights.</p><p>The Association is not based on religious, tribal, or state representation but reflects the diversity of the country (Article I(d)), and upholds principles of non-discrimination on grounds of age, race, colour, origin, gender, religion, ethnicity, disability, political preference, sexual orientation, or any protected characteristics.</p>",
    sort_order: 2,
    is_visible: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    page: "about",
    section_key: "motto",
    title: "Our Motto",
    content: '<p><strong>"Nutrition for a Healthier Uganda"</strong></p>',
    sort_order: 3,
    is_visible: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "4",
    page: "about",
    section_key: "vision",
    title: "Our Vision",
    content:
      "<p>To create a dynamic and inclusive community where students of nutrition and dietetics are equipped with knowledge, innovative thinking, and practical skills to achieve their full potential and significantly contribute to global health and well-being.</p>",
    sort_order: 4,
    is_visible: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "5",
    page: "about",
    section_key: "mission",
    title: "Our Mission",
    content:
      "<p>To unite and support students of nutrition and dietetics in Uganda by providing a platform for academic excellence, professional development, and advocacy for sustainable and healthy lifestyles, emphasising practical application in the field of nutrition and dietetics, thereby building a brighter future for all.</p>",
    sort_order: 5,
    is_visible: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "6",
    page: "about",
    section_key: "aims_objectives",
    title: "Aims and Objectives",
    content:
      "<ol><li><strong>Academic Excellence</strong> — Promote and support academic excellence among nutrition and dietetics students.</li><li><strong>Professional Development</strong> — Provide opportunities for professional growth through workshops, seminars, and conferences.</li><li><strong>Leadership Development</strong> — Provide opportunities for leadership development, empowering students to become future leaders in nutrition and dietetics.</li><li><strong>Policy Advocacy</strong> — Advocate for policies and programs that enhance nutrition and dietetics education, research, and practice in Uganda.</li><li><strong>Support for Research</strong> — Encourage and support research in nutrition and dietetics.</li><li><strong>Community Outreach</strong> — Engage in community outreach activities to raise awareness about the importance of nutrition and healthy eating habits.</li><li><strong>Unity and Representation</strong> — Unite and represent nutrition and dietetics students across Uganda.</li><li><strong>Promotion of the Profession</strong> — Promote the profession of nutrition and dietetics within Uganda.</li><li><strong>Teamwork and Camaraderie</strong> — Foster a spirit of teamwork and camaraderie among members.</li><li><strong>National Well-being</strong> — Improve the overall well-being and livelihood of the nation through nutrition and dietetics initiatives.</li><li><strong>Networking</strong> — Foster collaboration and networking among students, professionals, and organizations in nutrition and dietetics.</li><li><strong>Community Education</strong> — Educate the public on the importance of nutrition and healthy eating through community outreach and public health initiatives.</li><li><strong>Collaboration and Partnerships</strong> — Build partnerships with institutions, agencies, and non-profit organizations to maximise impact and resources for members and the wider community.</li></ol>",
    sort_order: 6,
    is_visible: true,
    created_at: "",
    updated_at: "",
  },
];

interface AboutContentProps {
  sections: PageSection[];
}

export function AboutContent({ sections }: AboutContentProps) {
  const displaySections = sections.length > 0 ? sections : DEFAULT_SECTIONS;
  return (
    <>
      {displaySections.map((section, i) => (
        <SectionBlock key={section.id} section={section} index={i} />
      ))}
    </>
  );
}

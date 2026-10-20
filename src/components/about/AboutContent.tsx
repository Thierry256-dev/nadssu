'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import DOMPurify from 'dompurify'
import type { PageSection } from '@/lib/types'

const SECTION_STYLES: Record<string, string> = {
  profile: 'bg-powder',
  who_we_are: 'bg-white',
  motto: 'bg-navy text-white',
  vision: 'bg-white',
  mission: 'bg-powder',
  aims_objectives: 'bg-white',
}

function SectionBlock({ section, index }: { section: PageSection; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const style = SECTION_STYLES[section.section_key] ?? 'bg-white'
  const isDark = section.section_key === 'motto'

  const sanitizedContent = typeof window !== 'undefined' && section.content
    ? DOMPurify.sanitize(section.content)
    : section.content ?? ''

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
            <h2 className={`text-2xl lg:text-3xl font-bold mb-5 ${isDark ? 'text-white' : 'text-navy'}`}>
              {section.title}
            </h2>
          )}
          <div
            className={`prose-nadssu ${isDark ? 'text-white/80 [&_p]:text-white/80 [&_strong]:text-white [&_a]:text-blue-light' : ''}`}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>
      </div>
    </motion.section>
  )
}

const DEFAULT_SECTIONS: PageSection[] = [
  {
    id: '1', page: 'about', section_key: 'profile', title: 'NADSSU Profile',
    content: '<p>The Nutrition and Dietetics Students\' Society of Uganda (NADSSU) is a student-led professional organisation established to represent and advance the interests of nutrition and dietetics students across Uganda.</p>',
    sort_order: 1, is_visible: true, created_at: '', updated_at: '',
  },
  {
    id: '2', page: 'about', section_key: 'who_we_are', title: 'Who We Are',
    content: '<p>NADSSU brings together students pursuing nutrition, dietetics, food science, and related disciplines across Ugandan institutions of higher learning.</p>',
    sort_order: 2, is_visible: true, created_at: '', updated_at: '',
  },
  {
    id: '3', page: 'about', section_key: 'motto', title: 'Our Motto',
    content: '<p><strong>"Nutrition for a Healthier Uganda"</strong></p><p>Our motto reflects our commitment to improving Uganda\'s nutritional health.</p>',
    sort_order: 3, is_visible: true, created_at: '', updated_at: '',
  },
  {
    id: '4', page: 'about', section_key: 'vision', title: 'Vision',
    content: '<p>To be the leading student organisation advancing nutrition and dietetics education, research, and practice for a healthier Uganda.</p>',
    sort_order: 4, is_visible: true, created_at: '', updated_at: '',
  },
  {
    id: '5', page: 'about', section_key: 'mission', title: 'Mission',
    content: '<p>To empower nutrition and dietetics students with the knowledge, skills, and professional networks necessary to contribute effectively to Uganda\'s health and development goals.</p>',
    sort_order: 5, is_visible: true, created_at: '', updated_at: '',
  },
  {
    id: '6', page: 'about', section_key: 'aims_objectives', title: 'Aims and Objectives',
    content: '<ul><li>To represent nutrition and dietetics students at institutional, national, and international levels.</li><li>To promote academic excellence and professional development.</li><li>To facilitate networking between students, professionals, and institutions.</li><li>To conduct and support research in nutrition and dietetics.</li></ul>',
    sort_order: 6, is_visible: true, created_at: '', updated_at: '',
  },
]

interface AboutContentProps {
  sections: PageSection[]
}

export function AboutContent({ sections }: AboutContentProps) {
  const displaySections = sections.length > 0 ? sections : DEFAULT_SECTIONS
  return (
    <>
      {displaySections.map((section, i) => (
        <SectionBlock key={section.id} section={section} index={i} />
      ))}
    </>
  )
}

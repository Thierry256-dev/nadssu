'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { UserCircle2, Mail } from 'lucide-react'
import type { GovernanceMember, GovernanceUnit } from '@/lib/types'

// Default org chart data shown before DB is populated
const DEFAULT_UNITS: GovernanceUnit[] = [
  { id: 'patron', title: 'Patron', unit_type: 'position', parent_id: undefined, sort_order: 0, is_visible: true, description: '' },
  { id: 'founder', title: 'Founder', unit_type: 'position', parent_id: 'patron', sort_order: 1, is_visible: true, description: '' },
  { id: 'president', title: 'President', unit_type: 'position', parent_id: 'founder', sort_order: 2, is_visible: true, description: '' },
  { id: 'project', title: 'Project Directorate', unit_type: 'department', parent_id: 'president', sort_order: 3, is_visible: true, description: '' },
  { id: 'finance', title: 'Finance Department', unit_type: 'department', parent_id: 'president', sort_order: 4, is_visible: true, description: '' },
  { id: 'research', title: 'Research, Innovation & Professional Development', unit_type: 'department', parent_id: 'president', sort_order: 5, is_visible: true, description: '' },
]

interface GovernanceContentProps {
  units: GovernanceUnit[]
  members: GovernanceMember[]
}

function OrgChartBox({ title, highlight }: { title: string; highlight?: boolean }) {
  return (
    <div
      className={`px-4 py-2.5 rounded-lg border text-center text-sm font-semibold min-w-[140px] ${
        highlight
          ? 'bg-primary text-white border-primary shadow-md'
          : 'bg-white text-navy border-border shadow-sm'
      }`}
    >
      {title}
    </div>
  )
}

function MemberCard({ member, index }: { member: GovernanceMember; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="bg-white border border-border rounded-xl p-5 text-center hover:shadow-md transition-shadow"
    >
      {member.photo_url ? (
        <Image
          src={member.photo_url}
          alt={member.name}
          width={80}
          height={80}
          className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-border"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-powder flex items-center justify-center mx-auto mb-3 border-2 border-border">
          <UserCircle2 size={36} className="text-muted-foreground/50" />
        </div>
      )}
      <div className="font-bold text-navy text-base mb-0.5">{member.name}</div>
      <div className="text-primary text-xs font-semibold mb-2">{member.position}</div>
      {member.governance_units && (
        <div className="text-xs text-muted-foreground mb-2">
          {(member.governance_units as { title: string }).title}
        </div>
      )}
      {member.bio && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{member.bio}</p>
      )}
      {member.email && (
        <a
          href={`mailto:${member.email}`}
          className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:underline"
        >
          <Mail size={11} /> {member.email}
        </a>
      )}
    </motion.div>
  )
}

export function GovernanceContent({ units, members }: GovernanceContentProps) {
  const chartRef = useRef(null)
  const chartInView = useInView(chartRef, { once: true, margin: '-60px' })

  const displayUnits = units.length > 0 ? units : DEFAULT_UNITS

  // Build a simple linear hierarchy from units for display
  const topLevel = displayUnits.filter((u) => !u.parent_id)
  const secondLevel = displayUnits.filter((u) => u.parent_id && displayUnits.find(p => p.id === u.parent_id && !p.parent_id))
  const thirdLevel = displayUnits.filter((u) => u.parent_id && secondLevel.find(p => p.id === u.parent_id))
  const departments = displayUnits.filter((u) => thirdLevel.some(t => t.id === u.parent_id) || u.unit_type === 'department')

  return (
    <div>
      {/* Org Chart */}
      <section className="section-powder py-14 lg:py-16" ref={chartRef}>
        <div className="container-site">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={chartInView ? { opacity: 1, y: 0 } : {}}
            className="text-2xl font-bold text-navy mb-8"
          >
            Organisation Structure
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={chartInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="overflow-x-auto"
          >
            <div className="min-w-[500px] flex flex-col items-center gap-0">
              {/* Row 1: Patron */}
              <div className="flex justify-center">
                <OrgChartBox title="Patron" />
              </div>
              <div className="w-0.5 h-6 bg-border" />

              {/* Row 2: Founder */}
              <div className="flex justify-center">
                <OrgChartBox title="Founder" />
              </div>
              <div className="w-0.5 h-6 bg-border" />

              {/* Row 3: President (highlighted) */}
              <div className="flex justify-center">
                <OrgChartBox title="President" highlight />
              </div>
              <div className="w-0.5 h-6 bg-border" />

              {/* Row 4: Horizontal spread of departments */}
              <div className="flex items-start justify-center gap-4 lg:gap-8 w-full">
                {[
                  'Project Directorate',
                  'Finance Department',
                  'Research, Innovation & Professional Development',
                ].map((dept, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-0.5 h-6 bg-border" />
                    <OrgChartBox title={dept} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Leadership & Department cards */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="container-site">
          <h2 className="text-2xl font-bold text-navy mb-8">Leadership &amp; Departments</h2>
          {members.length === 0 ? (
            <div className="text-center py-16 bg-powder rounded-xl border border-border">
              <p className="text-muted-foreground text-sm">Leadership profiles will be displayed here once published.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {members.map((member, i) => (
                <MemberCard key={member.id} member={member} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

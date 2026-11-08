'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { UserCircle2, Mail } from 'lucide-react'
import type { GovernanceMember, GovernanceUnit } from '@/lib/types'

interface GovernanceContentProps {
  units: GovernanceUnit[]
  members: GovernanceMember[]
}

function MemberCard({ member, index }: { member: GovernanceMember; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const imageBackground = index % 2 === 0 ? 'bg-yellow-600' : 'bg-green-800'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: (index % 5) * 0.06 }}
      className="rounded-xl border border-border bg-white p-5 text-center transition-shadow hover:shadow-md"
    >
      <div
        className={`mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-green-brand p-1 ${imageBackground}`}
      >
        {member.photo_url ? (
          <Image
            src={member.photo_url}
            alt={member.name}
            width={88}
            height={88}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <UserCircle2 size={40} className="text-white" />
        )}
      </div>

      <div className="mb-3 rounded-lg border-2 border-orange-brand px-3 py-2">
        <p className="font-bold text-base text-navy">{member.name}</p>
        <p className="mt-1 text-xs font-semibold text-primary">{member.position}</p>
      </div>

      {member.bio && (
        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
          {member.bio}
        </p>
      )}
      {member.email && (
        <a
          href={`mailto:${member.email}`}
          className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
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

  const unitGroups = units
    .map((unit) => ({
      id: unit.id,
      title: unit.title,
      members: members.filter((member) => member.unit_id === unit.id),
    }))
    .filter((group) => group.members.length > 0)
  const visibleUnitIds = new Set(units.map((unit) => unit.id))
  const unassignedMembers = members.filter(
    (member) => !member.unit_id || !visibleUnitIds.has(member.unit_id),
  )
  const groups = [
    ...unitGroups,
    ...(unassignedMembers.length > 0
      ? [{ id: 'other-members', title: 'Other Members', members: unassignedMembers }]
      : []),
  ]
  const memberIndexes = new Map<string, number>()
  groups
    .flatMap((group) => group.members)
    .forEach((member, index) => memberIndexes.set(member.id, index))

  return (
    <section className="section-powder py-14 lg:py-16" ref={chartRef}>
      <div className="container-site">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={chartInView ? { opacity: 1, y: 0 } : {}}
          className="mb-8 text-2xl font-bold text-navy"
        >
          Governance by Unit
        </motion.h2>

        {groups.length === 0 ? (
          <div className="rounded-xl border border-border bg-white py-16 text-center">
            <p className="text-sm text-muted-foreground">
              Governance profiles will be displayed here once published.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {groups.map((group, groupIndex) => (
              <motion.section
                key={group.id}
                initial={{ opacity: 0, y: 12 }}
                animate={chartInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.35, delay: groupIndex * 0.05 }}
              >
                <div className="mb-5 flex flex-col items-center">
                  {groupIndex > 0 && (
                    <div className="mb-3 h-6 w-0.5 bg-green-brand/50" />
                  )}
                  <h3 className="rounded-lg border border-green-brand bg-white px-5 py-2.5 text-center text-base font-semibold text-navy shadow-sm">
                    {group.title}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {group.members.map((member) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      index={memberIndexes.get(member.id) ?? 0}
                    />
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

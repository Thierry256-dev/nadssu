'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { ArrowRight, UserCircle2 } from 'lucide-react'
import type { SiteConfig } from '@/lib/types'

interface PatronPresidentProps {
  config: SiteConfig
}

function ProfileCard({
  name, title, bio, imageUrl, delay,
}: { name: string; title: string; bio: string; imageUrl?: string | null; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className="flex gap-4 p-6 bg-white rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={72}
            height={72}
            className="w-[72px] h-[72px] rounded-full object-cover border-2 border-border"
          />
        ) : (
          <div className="w-[72px] h-[72px] rounded-full bg-powder flex items-center justify-center border-2 border-border">
            <UserCircle2 size={36} className="text-muted-foreground/50" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-0.5">{title}</div>
        <h3 className="font-bold text-navy text-base mb-2 truncate">{name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {bio || `This position is currently pending official appointment.`}
        </p>
      </div>
    </motion.div>
  )
}

export function PatronPresident({ config }: PatronPresidentProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="section-powder py-14 lg:py-20" ref={ref}>
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-navy mb-2">Our Patron &amp; Current President</h2>
          <p className="text-muted-foreground text-sm">Leadership guiding NADSSU&apos;s mission</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {inView && (
            <>
              <ProfileCard
                name={config.patron_name}
                title={config.patron_title}
                bio={config.patron_bio}
                imageUrl={config.patron_image_url}
                delay={0.1}
              />
              <ProfileCard
                name={config.president_name}
                title={config.president_title}
                bio={config.president_bio}
                imageUrl={config.president_image_url}
                delay={0.2}
              />
            </>
          )}
        </div>
      </div>
    </section>
  )
}

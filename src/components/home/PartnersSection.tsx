'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import type { Partner } from '@/lib/types'

interface PartnersSectionProps {
  partners: Partner[]
}

export function PartnersSection({ partners }: PartnersSectionProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  if (partners.length === 0) return null

  return (
    <section className="py-14 lg:py-20 bg-white border-t border-border" ref={ref}>
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl font-bold text-navy mb-2">Our Partners</h2>
          <p className="text-muted-foreground text-sm">Institutions we collaborate with</p>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-10">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              {partner.website_url ? (
                <a
                  href={partner.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={partner.name}
                  className="flex items-center justify-center h-16 w-36 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all"
                >
                  {partner.logo_url ? (
                    <Image
                      src={partner.logo_url}
                      alt={partner.name}
                      width={140}
                      height={64}
                      className="max-h-14 w-auto object-contain"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-navy/60 text-center">{partner.name}</span>
                  )}
                </a>
              ) : (
                <div
                  className="flex items-center justify-center h-16 w-36 opacity-70"
                  title={partner.name}
                >
                  {partner.logo_url ? (
                    <Image
                      src={partner.logo_url}
                      alt={partner.name}
                      width={140}
                      height={64}
                      className="max-h-14 w-auto object-contain grayscale"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-navy/60 text-center">{partner.name}</span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

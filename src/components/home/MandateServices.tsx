'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { ArrowRight, Target, Zap } from 'lucide-react'
import type { SiteConfig } from '@/lib/types'

interface MandateServicesProps {
  config: SiteConfig
}

export function MandateServices({ config }: MandateServicesProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

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
            <h2 className="text-xl font-bold text-navy mb-3">{config.mandate_heading}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">
              {config.mandate_content || 'NADSSU is mandated to promote and advance the interests of nutrition and dietetics students across Uganda, fostering professional development and evidence-based nutrition advocacy.'}
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2.5 transition-all"
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
            <h2 className="text-xl font-bold text-navy mb-3">{config.services_heading}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">
              {config.services_content || 'Professional development workshops, networking opportunities, research support, career guidance, community outreach programmes, and institutional collaboration for nutrition and dietetics students.'}
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2.5 transition-all"
            >
              Learn More <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { Users, Lightbulb, Building2, HeartHandshake, Star } from 'lucide-react'
import type { HomeStat } from '@/lib/types'

const ICON_MAP: Record<string, React.ElementType> = {
  Users, Lightbulb, Building2, HeartHandshake, Star,
}

function AnimatedNumber({ target }: { target: string }) {
  const numMatch = target.match(/^(\d+)(.*)$/)
  if (!numMatch) return <span>{target}</span>

  const num = parseInt(numMatch[1])
  const suffix = numMatch[2] // e.g. '+', '%', ''

  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1500
    const steps = 50
    const increment = num / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= num) {
        setCount(num)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, num])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

interface StatsSectionProps {
  stats: HomeStat[]
}

export function StatsSection({ stats }: StatsSectionProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const displayStats = stats.length > 0
    ? stats
    : [
        { id: '1', label: 'Total Members', value: '0+', icon: 'Users', sort_order: 1, is_visible: true },
        { id: '2', label: 'Student Initiatives', value: '0+', icon: 'Lightbulb', sort_order: 2, is_visible: true },
        { id: '3', label: 'Partner Institutions', value: '0', icon: 'Building2', sort_order: 3, is_visible: true },
        { id: '4', label: 'Community Outreaches', value: '0+', icon: 'HeartHandshake', sort_order: 4, is_visible: true },
      ]

  return (
    <section className="section-powder py-12 lg:py-16" ref={ref}>
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold text-navy mb-2">Our Impact</h2>
          <p className="text-muted-foreground text-sm">Measuring our reach across Uganda</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {displayStats.map((stat, i) => {
            const Icon = ICON_MAP[stat.icon ?? ''] ?? Star
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white rounded-xl p-6 text-center shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
                  <Icon size={22} />
                </div>
                <div className="text-3xl font-bold text-navy mb-1">
                  <AnimatedNumber target={stat.value} />
                </div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import {
  Calendar as CalendarIcon, List, MapPin, Clock, ImageIcon,
  ExternalLink, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { format, parseISO, isFuture, isSameMonth, startOfMonth } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import type { Event } from '@/lib/types'

const CATEGORIES = ['All', 'Seminar & Workshop', 'Celebration', 'Community Outreach', 'Conference', 'General']

const STATUS_STYLES: Record<string, string> = {
  published: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-500',
  cancelled: 'bg-red-100 text-red-600',
}

interface EventsContentProps {
  events: Event[]
}

export function EventsContent({ events }: EventsContentProps) {
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [category, setCategory] = useState('All')
  const [calMonth, setCalMonth] = useState(new Date())

  const filtered = useMemo(() => {
    return events.filter((e) =>
      category === 'All' || e.category === category
    )
  }, [events, category])

  // For calendar view: mark dates that have events
  const eventDates = useMemo(() => {
    return filtered.map((e) => parseISO(e.start_date))
  }, [filtered])

  return (
    <section className="py-10 lg:py-14 bg-white">
      <div className="container-site">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          {/* Category filter */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  category === cat
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-muted-foreground border-border hover:border-primary/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* View toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden shrink-0">
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors ${
                view === 'list' ? 'bg-primary text-white' : 'bg-white text-muted-foreground hover:bg-powder'
              }`}
            >
              <List size={14} /> List View
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors ${
                view === 'calendar' ? 'bg-primary text-white' : 'bg-white text-muted-foreground hover:bg-powder'
              }`}
            >
              <CalendarIcon size={14} /> Calendar View
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {filtered.length === 0 ? (
                <div className="text-center py-20 bg-powder rounded-xl border border-border">
                  <p className="text-muted-foreground text-sm">No events found for this category.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filtered.map((event, i) => {
                    const start = parseISO(event.start_date)
                    const upcoming = isFuture(start)
                    return (
                      <motion.article
                        key={event.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                        className="flex gap-4 p-4 bg-white border border-border rounded-xl hover:shadow-md transition-all"
                      >
                        {/* Date block */}
                        <div className={`shrink-0 w-16 rounded-lg flex flex-col items-center justify-center py-3 ${upcoming ? 'bg-primary text-white' : 'bg-powder text-navy'}`}>
                          <div className="text-xs font-semibold opacity-80">{format(start, 'MMM')}</div>
                          <div className="text-2xl font-bold leading-tight">{format(start, 'd')}</div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-start gap-2 mb-1">
                            <h3 className="font-bold text-navy text-base leading-snug flex-1">{event.title}</h3>
                            <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[event.status] ?? ''}`}>
                              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2 text-xs text-muted-foreground">
                            <span className="font-medium text-primary">{event.category}</span>
                            <span className="flex items-center gap-1">
                              <Clock size={11} />
                              {format(start, 'h:mm a')}
                              {event.end_date && ` — ${format(parseISO(event.end_date), 'h:mm a')}`}
                            </span>
                            {event.venue && (
                              <span className="flex items-center gap-1">
                                <MapPin size={11} /> {event.venue}
                              </span>
                            )}
                            {event.is_online && (
                              <span className="text-blue-600">Online Event</span>
                            )}
                          </div>
                          {event.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                              {event.description.replace(/<[^>]*>/g, '')}
                            </p>
                          )}
                          <Link
                            href={`/events/${event.slug}`}
                            className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-primary hover:underline"
                          >
                            View Details →
                          </Link>
                        </div>
                      </motion.article>
                    )
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="calendar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col lg:flex-row gap-6"
            >
              <div className="bg-white border border-border rounded-xl p-4 w-full lg:w-auto">
                <Calendar
                  mode="single"
                  month={calMonth}
                  onMonthChange={setCalMonth}
                  modifiers={{ event: eventDates }}
                  modifiersClassNames={{ event: 'bg-primary/20 text-primary font-bold rounded-full' }}
                  className="rounded-xl"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-navy mb-4">
                  Events in {format(calMonth, 'MMMM yyyy')}
                </h3>
                {filtered.filter((e) => isSameMonth(parseISO(e.start_date), calMonth)).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No events this month.</p>
                ) : (
                  <div className="space-y-3">
                    {filtered
                      .filter((e) => isSameMonth(parseISO(e.start_date), calMonth))
                      .map((event) => (
                        <Link
                          key={event.id}
                          href={`/events/${event.slug}`}
                          className="flex gap-3 p-3 bg-powder rounded-lg hover:bg-secondary transition-colors"
                        >
                          <div className="text-primary font-bold text-sm w-8 shrink-0">
                            {format(parseISO(event.start_date), 'd')}
                          </div>
                          <div>
                            <div className="font-semibold text-navy text-sm">{event.title}</div>
                            <div className="text-xs text-muted-foreground">{event.category}</div>
                          </div>
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

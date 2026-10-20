import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PageBanner } from '@/components/layout/PageBanner'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { EventsContent } from '@/components/events/EventsContent'
import type { Event } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Events — NADSSU',
  description: 'Browse upcoming NADSSU events including seminars, workshops, celebrations, and community outreach activities.',
}

export const revalidate = 60

export default async function EventsPage() {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .in('status', ['published', 'completed', 'cancelled'])
    .order('start_date', { ascending: false })

  return (
    <>
      <PageBanner
        title="Events"
        subtitle="Workshops, seminars, and community activities."
      >
        <Breadcrumb items={[{ label: 'Events' }]} />
      </PageBanner>
      <EventsContent events={(events as Event[]) ?? []} />
    </>
  )
}

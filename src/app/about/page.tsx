import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PageBanner } from '@/components/layout/PageBanner'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { AboutContent } from '@/components/about/AboutContent'
import type { PageSection } from '@/lib/types'

export const metadata: Metadata = {
  title: 'About NADSSU',
  description: 'Learn about who we are, our motto, vision, mission, and the aims and objectives of the Nutrition and Dietetics Students\' Society of Uganda.',
}

export const revalidate = 120

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: sections } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page', 'about')
    .eq('is_visible', true)
    .order('sort_order')

  return (
    <>
      <PageBanner
        title="About NADSSU"
        subtitle="Who we are and our vision for a healthier tomorrow."
      >
        <Breadcrumb items={[{ label: 'About' }]} />
      </PageBanner>
      <AboutContent sections={(sections as PageSection[]) ?? []} />
    </>
  )
}

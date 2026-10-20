import { createClient } from '@/lib/supabase/server'
import type { SiteConfig } from '@/lib/types'

const DEFAULT_CONFIG: SiteConfig = {
  site_name: 'NADSSU',
  site_tagline: "Nutrition and Dietetics Students' Society of Uganda",
  site_description: 'A professional student-led organisation advancing nutrition and dietetics education, professional development, and community outreach in Uganda.',
  hero_heading: 'Advancing Nutrition & Dietetics Education in Uganda',
  hero_subheading: 'Connecting students, professionals, and institutions to build a healthier Uganda through evidence-based nutrition and dietetics practice.',
  hero_cta_primary: { label: 'Become a Member', href: '/members' },
  hero_cta_secondary: { label: 'Explore Our Work', href: '/about' },
  hero_image_url: null,
  announcement: null,
  logo_url: null,
  contact_email: 'info@nadssu.org',
  contact_phone: [],
  contact_address: 'Kampala, Uganda',
  social_links: {},
  footer_description: "NADSSU is Uganda's leading student organisation for nutrition and dietetics.",
  patron_name: 'Position Vacant',
  patron_title: 'Patron',
  patron_bio: '',
  patron_image_url: null,
  president_name: 'Position Vacant',
  president_title: 'President',
  president_bio: '',
  president_image_url: null,
  mandate_heading: 'Our Mandate',
  mandate_content: '',
  services_heading: 'Our Services',
  services_content: '',
}

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('site_settings').select('key, value')

    if (!data || data.length === 0) return DEFAULT_CONFIG

    const config: Record<string, unknown> = { ...DEFAULT_CONFIG }
    for (const row of data) {
      try {
        config[row.key] = typeof row.value === 'string' ? JSON.parse(row.value) : row.value
      } catch {
        config[row.key] = row.value
      }
    }

    return config as SiteConfig
  } catch {
    return DEFAULT_CONFIG
  }
}

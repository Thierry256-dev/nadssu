// Database types matching the Supabase schema

export type AdminRole = 'super_admin' | 'admin' | 'editor'

export interface SiteSetting {
  id: string
  key: string
  value: unknown
  created_at: string
  updated_at: string
}

export interface PageSection {
  id: string
  page: string
  section_key: string
  title?: string
  content?: string
  image_url?: string
  sort_order: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export interface HomeStat {
  id: string
  label: string
  value: string
  icon?: string
  sort_order: number
  is_visible: boolean
}

export interface Partner {
  id: string
  name: string
  description?: string
  logo_url?: string
  website_url?: string
  sort_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export type NewsStatus = 'draft' | 'published' | 'archived'

export interface NewsPost {
  id: string
  title: string
  slug: string
  summary?: string
  content?: string
  cover_image_url?: string
  category: string
  author?: string
  status: NewsStatus
  is_featured: boolean
  published_at?: string
  created_at: string
  updated_at: string
  created_by?: string
}

export interface MembershipCategory {
  id: string
  name: string
  description?: string
  icon?: string
  requirements?: string
  sort_order: number
  is_active: boolean
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'waitlisted'

export interface MembershipApplication {
  id: string
  full_name: string
  email: string
  phone?: string
  institution?: string
  membership_category_id?: string
  membership_number?: string
  additional_info?: string
  consent_given: boolean
  status: ApplicationStatus
  admin_notes?: string
  created_at: string
  updated_at: string
  reviewed_by?: string
  reviewed_at?: string
  // Joined
  membership_categories?: MembershipCategory
}

export type GovernanceUnitType = 'position' | 'department' | 'committee'

export interface GovernanceUnit {
  id: string
  title: string
  unit_type: GovernanceUnitType
  parent_id?: string
  description?: string
  sort_order: number
  is_visible: boolean
}

export interface GovernanceMember {
  id: string
  name: string
  position: string
  unit_id?: string
  bio?: string
  photo_url?: string
  email?: string
  social_links?: Record<string, string>
  sort_order: number
  is_published: boolean
  created_at: string
  updated_at: string
  // Joined
  governance_units?: GovernanceUnit
}

export interface Advisor {
  id: string
  name: string
  title: string
  background?: string
  bio?: string
  qualifications?: string
  photo_url?: string
  professional_links?: {
    linkedin?: string
    website?: string
  }
  sort_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export type OpportunityCategory = 'Internship' | 'Job Advert' | 'Volunteering & Resources' | 'Research Grant'
export type OpportunityStatus = 'draft' | 'published' | 'archived' | 'closed'

export interface CareerOpportunity {
  id: string
  title: string
  slug: string
  category: OpportunityCategory
  organisation?: string
  org_logo_url?: string
  featured_image_url?: string
  description?: string
  location?: string
  work_mode?: 'Remote' | 'On-site' | 'Hybrid'
  funding_details?: string
  duration?: string
  deadline?: string
  opens_at?: string
  application_link?: string
  contact_email?: string
  status: OpportunityStatus
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface Resource {
  id: string
  title: string
  description?: string
  category: string
  file_url: string
  file_name?: string
  file_type?: string
  file_size_bytes?: number
  is_published: boolean
  sort_order: number
  published_at?: string
  created_at: string
  updated_at: string
}

export type EventCategory = 'Seminar & Workshop' | 'Celebration' | 'Community Outreach' | 'Conference' | 'General'
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed'

export interface Event {
  id: string
  title: string
  slug: string
  category: EventCategory
  description?: string
  cover_image_url?: string
  start_date: string
  end_date?: string
  venue?: string
  is_online: boolean
  meeting_link?: string
  registration_link?: string
  organiser?: string
  status: EventStatus
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  is_read: boolean
  is_resolved: boolean
  admin_notes?: string
  created_at: string
  updated_at: string
}

// Parsed site settings shape
export interface SiteConfig {
  site_name: string
  site_tagline: string
  site_description: string
  hero_heading: string
  hero_subheading: string
  hero_cta_primary: { label: string; href: string }
  hero_cta_secondary: { label: string; href: string }
  hero_image_url: string | null
  announcement: string | null
  logo_url: string | null
  contact_email: string
  contact_phone: string[]
  contact_address: string
  social_links: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
    youtube?: string
  }
  footer_description: string
  patron_name: string
  patron_title: string
  patron_bio: string
  patron_image_url: string | null
  president_name: string
  president_title: string
  president_bio: string
  president_image_url: string | null
  mandate_heading: string
  mandate_content: string
  services_heading: string
  services_content: string
}

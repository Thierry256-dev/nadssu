-- ============================================================
-- NADSSU Website — Supabase Database Schema
-- Migration 001: Initial Schema
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- ============================================================
-- ADMIN ROLES
-- Maps auth.users to administrator roles
-- ============================================================
CREATE TABLE public.admin_roles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'editor')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- ============================================================
-- SITE SETTINGS
-- Key-value store for global configurable settings
-- ============================================================
CREATE TABLE public.site_settings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key         TEXT NOT NULL UNIQUE,
  value       JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default site settings
INSERT INTO public.site_settings (key, value) VALUES
  ('site_name',        '"NADSSU"'),
  ('site_tagline',     '"Nutrition and Dietetics Students'' Society of Uganda"'),
  ('site_description', '"A professional student-led organisation advancing nutrition and dietetics education, professional development, and community outreach in Uganda."'),
  ('hero_heading',     '"Advancing Nutrition & Dietetics Education in Uganda"'),
  ('hero_subheading',  '"Connecting students, professionals, and institutions to build a healthier Uganda through evidence-based nutrition and dietetics practice."'),
  ('hero_cta_primary', '{"label": "Become a Member", "href": "/members"}'),
  ('hero_cta_secondary', '{"label": "Explore Our Work", "href": "/about"}'),
  ('hero_image_url',   'null'),
  ('announcement',     'null'),
  ('logo_url',         'null'),
  ('favicon_url',      'null'),
  ('contact_email',    '"info@nadssu.org"'),
  ('contact_phone',    '"[\"Not yet available\"]"'),
  ('contact_address',  '"Kampala, Uganda"'),
  ('social_links',     '{"facebook": "", "twitter": "", "instagram": "", "linkedin": "", "youtube": ""}'),
  ('footer_description', '"NADSSU is Uganda''s leading student organisation for nutrition and dietetics, fostering professional excellence, research, and community wellbeing."'),
  ('patron_name',      '"Position Vacant"'),
  ('patron_title',     '"Patron"'),
  ('patron_bio',       '"The patron position awaits a distinguished professional to guide NADSSU''s mission."'),
  ('patron_image_url', 'null'),
  ('president_name',   '"Position Vacant"'),
  ('president_title',  '"President"'),
  ('president_bio',    '"The president leads NADSSU''s executive committee and represents the organisation."'),
  ('president_image_url', 'null'),
  ('mandate_heading',  '"Our Mandate"'),
  ('mandate_content',  '"NADSSU is mandated to promote and advance the interests of nutrition and dietetics students across Uganda, foster professional development, and advocate for evidence-based nutrition policy."'),
  ('services_heading', '"Our Services"'),
  ('services_content', '"We provide professional development workshops, networking opportunities, research support, career guidance, community outreach programmes, and institutional collaboration for nutrition and dietetics students."');

-- ============================================================
-- PAGE SECTIONS
-- Editable content sections for static pages (About, etc.)
-- ============================================================
CREATE TABLE public.page_sections (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page        TEXT NOT NULL,  -- e.g. 'about', 'home', 'members'
  section_key TEXT NOT NULL,  -- e.g. 'who_we_are', 'vision', 'mission'
  title       TEXT,
  content     TEXT,           -- Rich text HTML
  image_url   TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_visible  BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(page, section_key)
);

-- Insert default About page sections
INSERT INTO public.page_sections (page, section_key, title, content, sort_order) VALUES
  ('about', 'profile', 'NADSSU Profile',
   '<p>The Nutrition and Dietetics Students'' Society of Uganda (NADSSU) is a student-led professional organisation established to represent and advance the interests of nutrition and dietetics students across Uganda.</p><p>Founded by passionate students committed to improving health outcomes in Uganda, NADSSU has grown into a recognised platform for professional development, academic excellence, and community outreach.</p>',
   1),
  ('about', 'who_we_are', 'Who We Are',
   '<p>NADSSU brings together students pursuing nutrition, dietetics, food science, and related disciplines across Ugandan institutions of higher learning.</p><p>We serve as the collective voice of nutrition and dietetics students, working alongside academic institutions, professional bodies, government agencies, and international organisations to advance our shared mission of improving Uganda''s nutritional health.</p>',
   2),
  ('about', 'motto', 'Our Motto',
   '<p><strong>"Nutrition for a Healthier Uganda"</strong></p><p>Our motto reflects our commitment to harnessing the power of nutrition and dietetics knowledge to improve the health and wellbeing of all Ugandans.</p>',
   3),
  ('about', 'vision', 'Vision',
   '<p>To be the leading student organisation advancing nutrition and dietetics education, research, and practice for a healthier Uganda.</p>',
   4),
  ('about', 'mission', 'Mission',
   '<p>To empower nutrition and dietetics students with the knowledge, skills, and professional networks necessary to contribute effectively to Uganda''s health and development goals, through education, advocacy, research, and community service.</p>',
   5),
  ('about', 'aims_objectives', 'Aims and Objectives',
   '<ul><li>To represent and advocate for the interests of nutrition and dietetics students at institutional, national, and international levels.</li><li>To promote academic excellence and professional development among members.</li><li>To facilitate networking between students, professionals, and institutions.</li><li>To conduct and support research in nutrition and dietetics.</li><li>To engage in community outreach and public nutrition education.</li><li>To collaborate with government agencies, NGOs, and international bodies on nutrition policy and programmes.</li><li>To foster student initiatives that address nutritional challenges in Uganda.</li></ul>',
   6);

-- ============================================================
-- HOME STATISTICS
-- Configurable statistics displayed on the homepage
-- ============================================================
CREATE TABLE public.home_statistics (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label       TEXT NOT NULL,
  value       TEXT NOT NULL,
  icon        TEXT,           -- Lucide icon name
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_visible  BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.home_statistics (label, value, icon, sort_order) VALUES
  ('Total Members',           '0+',   'Users',       1),
  ('Student Initiatives',     '0+',   'Lightbulb',   2),
  ('Partner Institutions',    '0',    'Building2',   3),
  ('Community Outreaches',    '0+',   'HeartHandshake', 4);

-- ============================================================
-- PARTNERS
-- Partner organisations displayed in homepage partner grid
-- ============================================================
CREATE TABLE public.partners (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT,
  logo_url    TEXT,
  website_url TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- NEWS POSTS
-- Official updates / news articles
-- ============================================================
CREATE TABLE public.news_posts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  summary      TEXT,
  content      TEXT,           -- Rich text HTML (Tiptap output, sanitised on render)
  cover_image_url TEXT,
  category     TEXT NOT NULL DEFAULT 'General',
  author       TEXT,
  status       TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured  BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by   UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_news_posts_status ON public.news_posts(status);
CREATE INDEX idx_news_posts_published_at ON public.news_posts(published_at DESC);
CREATE INDEX idx_news_posts_category ON public.news_posts(category);
CREATE INDEX idx_news_posts_slug ON public.news_posts(slug);
CREATE INDEX idx_news_posts_search ON public.news_posts USING gin(to_tsvector('english', title || ' ' || COALESCE(summary, '') || ' ' || COALESCE(content, '')));

-- ============================================================
-- MEMBERSHIP CATEGORIES
-- Configurable membership types
-- ============================================================
CREATE TABLE public.membership_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT,
  icon        TEXT,           -- Lucide icon name
  requirements TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.membership_categories (name, description, icon, sort_order) VALUES
  ('Regular Member',           'Currently enrolled nutrition and dietetics students at any recognised Ugandan institution.',              'GraduationCap',   1),
  ('Associate Member',         'Nutrition and dietetics professionals, researchers, and academics who support NADSSU''s mission.',       'UserCheck',       2),
  ('Student Initiative',       'Registered student-led clubs, societies, or projects aligned with NADSSU''s objectives.',               'Lightbulb',       3),
  ('Institutional Association','Universities, research institutions, and organisations partnering with NADSSU.',                         'Building2',       4),
  ('Graduated Student',        'Alumni of nutrition and dietetics programmes who wish to maintain connection with NADSSU.',              'Award',           5);

-- ============================================================
-- MEMBERSHIP APPLICATIONS
-- Submitted membership applications
-- ============================================================
CREATE TABLE public.membership_applications (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name           TEXT NOT NULL,
  email               TEXT NOT NULL,
  phone               TEXT,
  institution         TEXT,
  membership_category_id UUID REFERENCES public.membership_categories(id) ON DELETE SET NULL,
  membership_number   TEXT,
  additional_info     TEXT,
  consent_given       BOOLEAN NOT NULL DEFAULT false,
  status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'waitlisted')),
  admin_notes         TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_by         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at         TIMESTAMPTZ
);

CREATE INDEX idx_applications_status ON public.membership_applications(status);
CREATE INDEX idx_applications_email ON public.membership_applications(email);

-- ============================================================
-- GOVERNANCE UNITS
-- Configurable org-chart nodes (departments / positions)
-- ============================================================
CREATE TABLE public.governance_units (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  unit_type   TEXT NOT NULL DEFAULT 'position' CHECK (unit_type IN ('position', 'department', 'committee')),
  parent_id   UUID REFERENCES public.governance_units(id) ON DELETE SET NULL,
  description TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_visible  BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- GOVERNANCE MEMBERS
-- People filling governance roles
-- ============================================================
CREATE TABLE public.governance_members (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  position        TEXT NOT NULL,
  unit_id         UUID REFERENCES public.governance_units(id) ON DELETE SET NULL,
  bio             TEXT,
  photo_url       TEXT,
  email           TEXT,
  social_links    JSONB DEFAULT '{}',
  sort_order      INTEGER NOT NULL DEFAULT 0,
  is_published    BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_governance_members_unit ON public.governance_members(unit_id);

-- ============================================================
-- ADVISORS
-- Advisor profiles
-- ============================================================
CREATE TABLE public.advisors (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  title           TEXT NOT NULL,
  background      TEXT,
  bio             TEXT,
  qualifications  TEXT,
  photo_url       TEXT,
  professional_links JSONB DEFAULT '{}',
  sort_order      INTEGER NOT NULL DEFAULT 0,
  is_published    BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- CAREER OPPORTUNITIES
-- Jobs, internships, grants, volunteering
-- ============================================================
CREATE TABLE public.career_opportunities (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  category        TEXT NOT NULL DEFAULT 'Internship' CHECK (category IN ('Internship', 'Job Advert', 'Volunteering & Resources', 'Research Grant')),
  organisation    TEXT,
  org_logo_url    TEXT,
  featured_image_url TEXT,
  description     TEXT,       -- Rich text HTML
  location        TEXT,
  work_mode       TEXT,       -- 'Remote', 'On-site', 'Hybrid'
  funding_details TEXT,
  duration        TEXT,
  deadline        DATE,
  opens_at        DATE,
  application_link TEXT,
  contact_email   TEXT,
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'closed')),
  is_featured     BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_opportunities_status ON public.career_opportunities(status);
CREATE INDEX idx_opportunities_category ON public.career_opportunities(category);
CREATE INDEX idx_opportunities_deadline ON public.career_opportunities(deadline);
CREATE INDEX idx_opportunities_slug ON public.career_opportunities(slug);

-- ============================================================
-- RESOURCES
-- Downloadable documents
-- ============================================================
CREATE TABLE public.resources (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  description     TEXT,
  category        TEXT NOT NULL DEFAULT 'General',
  file_url        TEXT NOT NULL,
  file_name       TEXT,
  file_type       TEXT,
  file_size_bytes BIGINT,
  is_published    BOOLEAN NOT NULL DEFAULT false,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_resources_category ON public.resources(category);
CREATE INDEX idx_resources_published ON public.resources(is_published);

-- ============================================================
-- EVENTS
-- Organisation events with calendar support
-- ============================================================
CREATE TABLE public.events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  category        TEXT NOT NULL DEFAULT 'General' CHECK (category IN ('Seminar & Workshop', 'Celebration', 'Community Outreach', 'Conference', 'General')),
  description     TEXT,       -- Rich text HTML
  cover_image_url TEXT,
  start_date      TIMESTAMPTZ NOT NULL,
  end_date        TIMESTAMPTZ,
  venue           TEXT,
  is_online       BOOLEAN NOT NULL DEFAULT false,
  meeting_link    TEXT,
  registration_link TEXT,
  organiser       TEXT,
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_events_category ON public.events(category);
CREATE INDEX idx_events_slug ON public.events(slug);

-- ============================================================
-- CONTACT MESSAGES
-- Enquiry form submissions
-- ============================================================
CREATE TABLE public.contact_messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  subject     TEXT,
  message     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT false,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  admin_notes TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_contact_messages_read ON public.contact_messages(is_read);

-- ============================================================
-- UPDATED_AT TRIGGERS
-- Automatically update updated_at timestamp on every update
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'admin_roles','site_settings','page_sections','home_statistics',
    'partners','news_posts','membership_categories','membership_applications',
    'governance_units','governance_members','advisors','career_opportunities',
    'resources','events','contact_messages'
  ]) LOOP
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I
       FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t);
  END LOOP;
END;
$$;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Helper function: check if the caller is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles
    WHERE user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: check if the caller is a super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles
    WHERE user_id = auth.uid() AND role = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ---- admin_roles ----
CREATE POLICY "Super admins manage admin_roles"
  ON public.admin_roles FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE POLICY "Admins read own role"
  ON public.admin_roles FOR SELECT
  USING (user_id = auth.uid());

-- ---- site_settings ----
CREATE POLICY "Public read site_settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins manage site_settings"
  ON public.site_settings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---- page_sections ----
CREATE POLICY "Public read page_sections"
  ON public.page_sections FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Admins manage page_sections"
  ON public.page_sections FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---- home_statistics ----
CREATE POLICY "Public read home_statistics"
  ON public.home_statistics FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Admins manage home_statistics"
  ON public.home_statistics FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---- partners ----
CREATE POLICY "Public read published partners"
  ON public.partners FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins manage partners"
  ON public.partners FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---- news_posts ----
CREATE POLICY "Public read published news"
  ON public.news_posts FOR SELECT
  USING (status = 'published' AND published_at <= now());

CREATE POLICY "Admins manage news_posts"
  ON public.news_posts FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---- membership_categories ----
CREATE POLICY "Public read active membership_categories"
  ON public.membership_categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins manage membership_categories"
  ON public.membership_categories FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---- membership_applications ----
-- Public users can INSERT but never SELECT (only their own via function)
CREATE POLICY "Public insert applications"
  ON public.membership_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins manage applications"
  ON public.membership_applications FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---- governance_units ----
CREATE POLICY "Public read visible governance_units"
  ON public.governance_units FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Admins manage governance_units"
  ON public.governance_units FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---- governance_members ----
CREATE POLICY "Public read published governance_members"
  ON public.governance_members FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins manage governance_members"
  ON public.governance_members FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---- advisors ----
CREATE POLICY "Public read published advisors"
  ON public.advisors FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins manage advisors"
  ON public.advisors FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---- career_opportunities ----
CREATE POLICY "Public read published opportunities"
  ON public.career_opportunities FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins manage opportunities"
  ON public.career_opportunities FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---- resources ----
CREATE POLICY "Public read published resources"
  ON public.resources FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins manage resources"
  ON public.resources FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---- events ----
CREATE POLICY "Public read published events"
  ON public.events FOR SELECT
  USING (status IN ('published', 'completed', 'cancelled'));

CREATE POLICY "Admins manage events"
  ON public.events FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---- contact_messages ----
CREATE POLICY "Public insert contact_messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins manage contact_messages"
  ON public.contact_messages FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- STORAGE BUCKETS
-- Run these in Supabase dashboard or via service role
-- ============================================================
-- NOTE: Storage bucket creation requires service role or Supabase dashboard.
-- Create the following buckets with the settings specified:
--
-- Bucket: 'images'
--   Public: true
--   Allowed MIME types: image/jpeg, image/png, image/webp, image/gif, image/svg+xml
--   Max file size: 5MB
--
-- Bucket: 'documents'
--   Public: true
--   Allowed MIME types: application/pdf, application/msword,
--     application/vnd.openxmlformats-officedocument.wordprocessingml.document
--   Max file size: 20MB
--
-- Storage RLS Policies (run after bucket creation):

-- images bucket
-- INSERT public.storage.objects policies:
--   "Admins can upload images" ON storage.objects FOR INSERT
--     USING (bucket_id = 'images' AND public.is_admin())
-- UPDATE: "Admins can update images" ... USING (bucket_id = 'images' AND public.is_admin())
-- DELETE: "Admins can delete images" ... USING (bucket_id = 'images' AND public.is_admin())
-- SELECT: "Anyone can view images" ... USING (bucket_id = 'images')

-- documents bucket  
-- INSERT: "Admins can upload documents" USING (bucket_id = 'documents' AND public.is_admin())
-- UPDATE: "Admins can update documents" USING (bucket_id = 'documents' AND public.is_admin())  
-- DELETE: "Admins can delete documents" USING (bucket_id = 'documents' AND public.is_admin())
-- SELECT: "Anyone can view documents" USING (bucket_id = 'documents')

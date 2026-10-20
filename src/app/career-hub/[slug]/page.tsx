import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageBanner } from '@/components/layout/PageBanner'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Calendar, MapPin, Building, Clock, ExternalLink, ArrowLeft, Mail } from 'lucide-react'
import { format, parseISO, isPast } from 'date-fns'
import type { CareerOpportunity } from '@/lib/types'
import DOMPurify from 'dompurify'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('career_opportunities')
    .select('title, description')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  if (!data) return { title: 'Opportunity Not Found' }
  return {
    title: data.title,
    description: (data.description ?? '').replace(/<[^>]*>/g, '').slice(0, 160),
  }
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: opp } = await supabase
    .from('career_opportunities')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!opp) notFound()

  const opportunity = opp as CareerOpportunity
  const isClosed = opportunity.deadline ? isPast(parseISO(opportunity.deadline)) : false

  return (
    <>
      <PageBanner title={opportunity.title} subtitle={opportunity.organisation ?? undefined}>
        <Breadcrumb
          items={[
            { label: 'Career Hub', href: '/career-hub' },
            { label: opportunity.title },
          ]}
        />
      </PageBanner>

      <section className="py-12 bg-white">
        <div className="container-site">
          <div className="max-w-3xl">
            <Link
              href="/career-hub"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Career Hub
            </Link>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                {opportunity.category}
              </span>
              {isClosed && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                  Closed
                </span>
              )}
              {opportunity.work_mode && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
                  {opportunity.work_mode}
                </span>
              )}
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-powder rounded-xl border border-border mb-8">
              {opportunity.location && (
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1"><MapPin size={11} /> Location</div>
                  <div className="text-sm font-semibold text-navy">{opportunity.location}</div>
                </div>
              )}
              {opportunity.duration && (
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1"><Clock size={11} /> Duration</div>
                  <div className="text-sm font-semibold text-navy">{opportunity.duration}</div>
                </div>
              )}
              {opportunity.deadline && (
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1"><Calendar size={11} /> Deadline</div>
                  <div className={`text-sm font-semibold ${isClosed ? 'text-destructive' : 'text-navy'}`}>
                    {format(parseISO(opportunity.deadline), 'MMM d, yyyy')}
                  </div>
                </div>
              )}
              {opportunity.funding_details && (
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">Funding</div>
                  <div className="text-sm font-semibold text-navy">{opportunity.funding_details}</div>
                </div>
              )}
            </div>

            {/* Description */}
            {opportunity.description && (
              <div
                className="prose-nadssu mb-8"
                dangerouslySetInnerHTML={{ __html: opportunity.description }}
              />
            )}

            {/* CTA */}
            <div className="flex flex-wrap gap-3">
              {opportunity.application_link && !isClosed && (
                <a
                  href={opportunity.application_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Apply Now <ExternalLink size={15} />
                </a>
              )}
              {opportunity.contact_email && (
                <a
                  href={`mailto:${opportunity.contact_email}`}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg font-semibold hover:bg-powder transition-colors text-navy"
                >
                  <Mail size={15} /> Contact
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

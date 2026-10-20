import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PageBanner } from '@/components/layout/PageBanner'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { MembersContent } from '@/components/members/MembersContent'
import type { MembershipCategory } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Membership — Join NADSSU',
  description: 'Join the Nutrition and Dietetics Students\' Society of Uganda. Learn about membership categories and submit your application.',
}

export const revalidate = 120

export default async function MembersPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('membership_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  return (
    <>
      <PageBanner
        title="Membership"
        subtitle="Join our community and be part of the change."
      >
        <Breadcrumb items={[{ label: 'Members' }]} />
      </PageBanner>
      <MembersContent categories={(categories as MembershipCategory[]) ?? []} />
    </>
  )
}

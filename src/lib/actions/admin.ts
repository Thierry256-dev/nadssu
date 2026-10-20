'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  newsPostSchema,
  eventSchema,
  careerOpportunitySchema,
  resourceSchema,
  advisorSchema,
  partnerSchema,
  governanceMemberSchema,
} from '@/lib/validations'
import type { ActionResult } from './public'

// ---- Auth guard helper ----
async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: role } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!role) throw new Error('Unauthorized')
  return { supabase, user, role: role.role }
}

// ============================================================
// NEWS
// ============================================================
export async function createNewsPost(values: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const { supabase, user } = await requireAdmin()
    const parsed = newsPostSchema.safeParse(values)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }

    const { data, error } = await supabase.from('news_posts').insert({
      ...parsed.data,
      created_by: user.id,
      published_at: parsed.data.status === 'published' ? (parsed.data.published_at ?? new Date().toISOString()) : null,
    }).select('id').single()

    if (error) return { success: false, error: error.message }
    revalidatePath('/news')
    revalidatePath('/admin/news')
    return { success: true, data: { id: data.id } }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'Server error' }
  }
}

export async function updateNewsPost(id: string, values: unknown): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const parsed = newsPostSchema.safeParse(values)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }

    const { error } = await supabase.from('news_posts').update({
      ...parsed.data,
      published_at: parsed.data.status === 'published' ? (parsed.data.published_at ?? new Date().toISOString()) : null,
    }).eq('id', id)

    if (error) return { success: false, error: error.message }
    revalidatePath('/news')
    revalidatePath('/admin/news')
    revalidatePath(`/news/${parsed.data.slug}`)
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'Server error' }
  }
}

export async function deleteNewsPost(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase.from('news_posts').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/news')
    revalidatePath('/admin/news')
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'Server error' }
  }
}

// ============================================================
// EVENTS
// ============================================================
export async function createEvent(values: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const { supabase, user } = await requireAdmin()
    const parsed = eventSchema.safeParse(values)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }

    const { data, error } = await supabase.from('events').insert({
      ...parsed.data,
      created_by: user.id,
    }).select('id').single()

    if (error) return { success: false, error: error.message }
    revalidatePath('/events')
    revalidatePath('/admin/events')
    return { success: true, data: { id: data.id } }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'Server error' }
  }
}

export async function updateEvent(id: string, values: unknown): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const parsed = eventSchema.safeParse(values)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
    const { error } = await supabase.from('events').update(parsed.data).eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/events')
    revalidatePath('/admin/events')
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'Server error' }
  }
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/events')
    revalidatePath('/admin/events')
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'Server error' }
  }
}

// ============================================================
// CAREER OPPORTUNITIES
// ============================================================
export async function createOpportunity(values: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const { supabase, user } = await requireAdmin()
    const parsed = careerOpportunitySchema.safeParse(values)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }

    const { data, error } = await supabase.from('career_opportunities').insert({
      ...parsed.data,
      created_by: user.id,
    }).select('id').single()

    if (error) return { success: false, error: error.message }
    revalidatePath('/career-hub')
    revalidatePath('/admin/career-hub')
    return { success: true, data: { id: data.id } }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'Server error' }
  }
}

export async function updateOpportunity(id: string, values: unknown): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const parsed = careerOpportunitySchema.safeParse(values)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
    const { error } = await supabase.from('career_opportunities').update(parsed.data).eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/career-hub')
    revalidatePath('/admin/career-hub')
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'Server error' }
  }
}

export async function deleteOpportunity(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase.from('career_opportunities').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/career-hub')
    revalidatePath('/admin/career-hub')
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'Server error' }
  }
}

// ============================================================
// RESOURCES
// ============================================================
export async function createResource(values: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const { supabase, user } = await requireAdmin()
    const parsed = resourceSchema.safeParse(values)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }

    const { data, error } = await supabase.from('resources').insert({
      ...parsed.data,
      created_by: user.id,
      published_at: parsed.data.is_published ? new Date().toISOString() : null,
    }).select('id').single()

    if (error) return { success: false, error: error.message }
    revalidatePath('/resources')
    revalidatePath('/admin/resources')
    return { success: true, data: { id: data.id } }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'Server error' }
  }
}

export async function updateResource(id: string, values: unknown): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const parsed = resourceSchema.safeParse(values)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
    const { error } = await supabase.from('resources').update(parsed.data).eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/resources')
    revalidatePath('/admin/resources')
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'Server error' }
  }
}

export async function deleteResource(id: string, fileUrl?: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()

    if (fileUrl) {
      // Extract file path from URL and delete from storage
      const url = new URL(fileUrl)
      const pathParts = url.pathname.split('/object/public/documents/')
      if (pathParts[1]) {
        await supabase.storage.from('documents').remove([pathParts[1]])
      }
    }

    const { error } = await supabase.from('resources').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/resources')
    revalidatePath('/admin/resources')
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'Server error' }
  }
}

// ============================================================
// ADVISORS
// ============================================================
export async function createAdvisor(values: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const { supabase } = await requireAdmin()
    const parsed = advisorSchema.safeParse(values)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
    const { data, error } = await supabase.from('advisors').insert(parsed.data).select('id').single()
    if (error) return { success: false, error: error.message }
    revalidatePath('/advisors')
    revalidatePath('/admin/advisors')
    return { success: true, data: { id: data.id } }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'Server error' }
  }
}

export async function updateAdvisor(id: string, values: unknown): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const parsed = advisorSchema.safeParse(values)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
    const { error } = await supabase.from('advisors').update(parsed.data).eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/advisors')
    revalidatePath('/admin/advisors')
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'Server error' }
  }
}

export async function deleteAdvisor(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase.from('advisors').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/advisors')
    revalidatePath('/admin/advisors')
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'Server error' }
  }
}

// ============================================================
// PARTNERS
// ============================================================
export async function createPartner(values: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const { supabase } = await requireAdmin()
    const parsed = partnerSchema.safeParse(values)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
    const { data, error } = await supabase.from('partners').insert(parsed.data).select('id').single()
    if (error) return { success: false, error: error.message }
    revalidatePath('/')
    revalidatePath('/admin/partners')
    return { success: true, data: { id: data.id } }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'Server error' }
  }
}

export async function updatePartner(id: string, values: unknown): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const parsed = partnerSchema.safeParse(values)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
    const { error } = await supabase.from('partners').update(parsed.data).eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/')
    revalidatePath('/admin/partners')
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'Server error' }
  }
}

export async function deletePartner(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase.from('partners').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/')
    revalidatePath('/admin/partners')
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'Server error' }
  }
}

// ============================================================
// GOVERNANCE MEMBERS
// ============================================================
export async function createGovernanceMember(values: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const { supabase } = await requireAdmin()
    const parsed = governanceMemberSchema.safeParse(values)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
    const { data, error } = await supabase.from('governance_members').insert(parsed.data).select('id').single()
    if (error) return { success: false, error: error.message }
    revalidatePath('/governance')
    revalidatePath('/admin/governance')
    return { success: true, data: { id: data.id } }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'Server error' }
  }
}

export async function updateGovernanceMember(id: string, values: unknown): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const parsed = governanceMemberSchema.safeParse(values)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
    const { error } = await supabase.from('governance_members').update(parsed.data).eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/governance')
    revalidatePath('/admin/governance')
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'Server error' }
  }
}

export async function deleteGovernanceMember(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase.from('governance_members').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/governance')
    revalidatePath('/admin/governance')
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'Server error' }
  }
}

// ============================================================
// SITE SETTINGS
// ============================================================
export async function updateSiteSetting(key: string, value: unknown): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key, value: JSON.stringify(value) }, { onConflict: 'key' })
    if (error) return { success: false, error: error.message }
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'Server error' }
  }
}

// ============================================================
// ADMIN AUTH
// ============================================================
export async function adminSignOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

export async function updateApplicationStatus(
  id: string,
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted',
  notes?: string
): Promise<ActionResult> {
  try {
    const { supabase, user } = await requireAdmin()
    const { error } = await supabase.from('membership_applications').update({
      status,
      admin_notes: notes,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    }).eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/admin/members')
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'Server error' }
  }
}

export async function markMessageRead(id: string, isRead: boolean): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase.from('contact_messages').update({ is_read: isRead }).eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/admin/messages')
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'Server error' }
  }
}

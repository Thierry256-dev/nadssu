'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { contactFormSchema, membershipApplicationSchema } from '@/lib/validations'
import type { ContactFormValues, MembershipApplicationValues } from '@/lib/validations'

export type ActionResult<T = void> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string }

// ---- Contact form submission ----
export async function submitContactForm(values: ContactFormValues): Promise<ActionResult> {
  const parsed = contactFormSchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('contact_messages').insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject ?? null,
    message: parsed.data.message,
  })

  if (error) {
    console.error('Contact form error:', error.message)
    return { success: false, error: 'Unable to send your message. Please try again.' }
  }

  return { success: true, message: 'Your message has been sent. We will be in touch shortly.' }
}

// ---- Membership application submission ----
export async function submitMembershipApplication(values: MembershipApplicationValues): Promise<ActionResult> {
  const parsed = membershipApplicationSchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('membership_applications').insert({
    full_name: parsed.data.full_name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    institution: parsed.data.institution ?? null,
    membership_category_id: parsed.data.membership_category_id,
    membership_number: parsed.data.membership_number ?? null,
    additional_info: parsed.data.additional_info ?? null,
    consent_given: parsed.data.consent_given,
  })

  if (error) {
    console.error('Application error:', error.message)
    return { success: false, error: 'Unable to submit your application. Please try again.' }
  }

  revalidatePath('/admin/members')
  return {
    success: true,
    message: 'Your application has been submitted successfully. We will review it and contact you.',
  }
}

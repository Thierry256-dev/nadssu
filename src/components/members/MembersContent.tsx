'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'motion/react'
import {
  GraduationCap, UserCheck, Lightbulb, Building2, Award, Star,
  CheckCircle2, AlertCircle, Loader2,
} from 'lucide-react'
import { membershipApplicationSchema } from '@/lib/validations'
import { submitMembershipApplication } from '@/lib/actions/public'
import type { MembershipApplicationValues } from '@/lib/validations'
import type { MembershipCategory } from '@/lib/types'

const ICON_MAP: Record<string, React.ElementType> = {
  GraduationCap, UserCheck, Lightbulb, Building2, Award, Star,
}

const DEFAULT_CATEGORIES: MembershipCategory[] = [
  { id: '1', name: 'Regular Member', description: 'Currently enrolled nutrition and dietetics students.', icon: 'GraduationCap', sort_order: 1, is_active: true },
  { id: '2', name: 'Associate Member', description: 'Nutrition professionals and academics.', icon: 'UserCheck', sort_order: 2, is_active: true },
  { id: '3', name: 'Student Initiative', description: 'Student-led clubs and projects.', icon: 'Lightbulb', sort_order: 3, is_active: true },
  { id: '4', name: 'Institutional Association', description: 'Universities and research institutions.', icon: 'Building2', sort_order: 4, is_active: true },
  { id: '5', name: 'Graduated Student', description: 'Alumni who wish to stay connected.', icon: 'Award', sort_order: 5, is_active: true },
]

interface MembersContentProps {
  categories: MembershipCategory[]
}

export function MembersContent({ categories }: MembersContentProps) {
  const displayCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<MembershipApplicationValues>({
    resolver: zodResolver(membershipApplicationSchema),
    defaultValues: {
      full_name: '', email: '', phone: '', institution: '',
      membership_category_id: '', membership_number: '', additional_info: '',
      consent_given: undefined as unknown as true,
    },
  })

  const onSubmit = (values: MembershipApplicationValues) => {
    setServerError(null)
    startTransition(async () => {
      const result = await submitMembershipApplication(values)
      if (result.success) {
        setSuccess(true)
        form.reset()
      } else {
        setServerError(result.error)
      }
    })
  }

  return (
    <div>
      {/* How to be a member */}
      <section className="py-14 bg-white">
        <div className="container-site">
          <h2 className="text-2xl font-bold text-navy mb-3">How to be a Member</h2>
          <p className="text-muted-foreground max-w-2xl mb-8 text-sm leading-relaxed">
            Join NADSSU and gain access to opportunities, resources, and a supportive network of fellow students and professionals. Complete the application form below and we will review your application.
          </p>

          <h3 className="text-lg font-bold text-navy mb-5">Membership Categories</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
            {displayCategories.map((cat, i) => {
              const Icon = ICON_MAP[cat.icon ?? ''] ?? Star
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex flex-col items-center text-center p-5 bg-powder rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => form.setValue('membership_category_id', cat.id)}
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                    <Icon size={22} />
                  </div>
                  <div className="text-xs font-bold text-navy mb-1">{cat.name}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{cat.description}</div>
                </motion.div>
              )
            })}
          </div>

          {/* Application form */}
          <div className="max-w-2xl">
            <h3 className="text-lg font-bold text-navy mb-6">Membership Application</h3>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-start gap-3 p-6 bg-green-50 border border-green-200 rounded-xl"
              >
                <CheckCircle2 className="text-green-600 mt-0.5 shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-green-800">Application submitted successfully!</p>
                  <p className="text-sm text-green-700 mt-1">
                    Thank you for applying. We will review your application and contact you at your provided email address.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-3 text-sm text-green-700 underline"
                  >
                    Submit another application
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-navy mb-1.5">
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="full_name"
                      type="text"
                      {...form.register('full_name')}
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2.5 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-white"
                    />
                    {form.formState.errors.full_name && (
                      <p className="text-xs text-destructive mt-1">{form.formState.errors.full_name.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-navy mb-1.5">
                      Email Address <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...form.register('email')}
                      placeholder="Enter your email address"
                      className="w-full px-3 py-2.5 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-white"
                    />
                    {form.formState.errors.email && (
                      <p className="text-xs text-destructive mt-1">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-navy mb-1.5">Phone Number</label>
                    <input
                      id="phone"
                      type="tel"
                      {...form.register('phone')}
                      placeholder="+256 700 000 000"
                      className="w-full px-3 py-2.5 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="institution" className="block text-sm font-medium text-navy mb-1.5">Institution / Organisation</label>
                    <input
                      id="institution"
                      type="text"
                      {...form.register('institution')}
                      placeholder="Kampala, Uganda"
                      className="w-full px-3 py-2.5 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="membership_category_id" className="block text-sm font-medium text-navy mb-1.5">
                    Membership Category <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="membership_category_id"
                    {...form.register('membership_category_id')}
                    className="w-full px-3 py-2.5 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-white"
                  >
                    <option value="">Select a category</option>
                    {displayCategories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {form.formState.errors.membership_category_id && (
                    <p className="text-xs text-destructive mt-1">{form.formState.errors.membership_category_id.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="membership_number" className="block text-sm font-medium text-navy mb-1.5">Account / Membership Number (if applicable)</label>
                  <input
                    id="membership_number"
                    type="text"
                    {...form.register('membership_number')}
                    placeholder="Enter account number"
                    className="w-full px-3 py-2.5 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="additional_info" className="block text-sm font-medium text-navy mb-1.5">Additional Information</label>
                  <textarea
                    id="additional_info"
                    {...form.register('additional_info')}
                    rows={3}
                    placeholder="Tell us more about yourself…"
                    className="w-full px-3 py-2.5 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-white resize-none"
                  />
                </div>

                <div>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      {...form.register('consent_given')}
                      className="mt-0.5 h-4 w-4 rounded border-input text-primary focus:ring-ring"
                    />
                    <span className="text-sm text-muted-foreground">
                      I agree to the privacy notice and terms. I understand my application will be reviewed before approval.
                    </span>
                  </label>
                  {form.formState.errors.consent_given && (
                    <p className="text-xs text-destructive mt-1">{form.formState.errors.consent_given.message}</p>
                  )}
                </div>

                {serverError && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                    <AlertCircle size={16} />
                    {serverError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPending && <Loader2 size={16} className="animate-spin" />}
                  {isPending ? 'Submitting…' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

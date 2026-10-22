import { z } from "zod";

// ---- Contact form ----
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().max(200).optional(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000),
  reply_phone: z.string().max(30).optional(),
});
export type ContactFormValues = z.infer<typeof contactFormSchema>;

// ---- Membership application ----
export const membershipApplicationSchema = z.object({
  full_name: z.string().min(2, "Full name is required").max(200),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().max(30).optional(),
  institution: z.string().max(300).optional(),
  membership_category_id: z
    .string()
    .uuid("Please select a membership category"),
  membership_number: z.string().max(100).optional(),
  additional_info: z.string().max(2000).optional(),
  consent_given: z.boolean().refine((value) => value === true, {
    message: "You must consent to the privacy notice to apply",
  }),
});
export type MembershipApplicationValues = z.infer<
  typeof membershipApplicationSchema
>;

// ---- News post (admin) ----
export const newsPostSchema = z.object({
  title: z.string().min(3, "Title is required").max(300),
  slug: z
    .string()
    .min(3)
    .max(300)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase letters, numbers, and hyphens only",
    ),
  summary: z.string().max(500).optional(),
  content: z.string().optional(),
  cover_image_url: z.string().url().optional().or(z.literal("")),
  category: z.string().max(100).default("General"),
  author: z.string().max(200).optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  is_featured: z.boolean().default(false),
  published_at: z.string().optional(),
});
export type NewsPostValues = z.infer<typeof newsPostSchema>;

// ---- Event (admin) ----
export const eventSchema = z.object({
  title: z.string().min(3).max(300),
  slug: z
    .string()
    .min(3)
    .max(300)
    .regex(/^[a-z0-9-]+$/),
  category: z.enum([
    "Seminar & Workshop",
    "Celebration",
    "Community Outreach",
    "Conference",
    "General",
  ]),
  description: z.string().optional(),
  cover_image_url: z.string().url().optional().or(z.literal("")),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  venue: z.string().max(300).optional(),
  is_online: z.boolean().default(false),
  meeting_link: z.string().url().optional().or(z.literal("")),
  registration_link: z.string().url().optional().or(z.literal("")),
  organiser: z.string().max(200).optional(),
  status: z
    .enum(["draft", "published", "cancelled", "completed"])
    .default("draft"),
});
export type EventValues = z.infer<typeof eventSchema>;

// ---- Career opportunity (admin) ----
export const careerOpportunitySchema = z.object({
  title: z.string().min(3).max(300),
  slug: z
    .string()
    .min(3)
    .max(300)
    .regex(/^[a-z0-9-]+$/),
  category: z.enum([
    "Internship",
    "Job Advert",
    "Volunteering & Resources",
    "Research Grant",
  ]),
  organisation: z.string().max(300).optional(),
  org_logo_url: z.string().url().optional().or(z.literal("")),
  featured_image_url: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
  location: z.string().max(200).optional(),
  work_mode: z.enum(["Remote", "On-site", "Hybrid"]).optional(),
  funding_details: z.string().max(500).optional(),
  duration: z.string().max(200).optional(),
  deadline: z.string().optional(),
  opens_at: z.string().optional(),
  application_link: z.string().url().optional().or(z.literal("")),
  contact_email: z.string().email().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived", "closed"]).default("draft"),
  is_featured: z.boolean().default(false),
});
export type CareerOpportunityValues = z.infer<typeof careerOpportunitySchema>;

// ---- Resource (admin) ----
export const resourceSchema = z.object({
  title: z.string().min(3).max(300),
  description: z.string().max(1000).optional(),
  category: z.string().max(100).default("General"),
  file_url: z.string().url("File URL is required"),
  file_name: z.string().max(300).optional(),
  file_type: z.string().max(100).optional(),
  file_size_bytes: z.number().optional(),
  is_published: z.boolean().default(false),
});
export type ResourceValues = z.infer<typeof resourceSchema>;

// ---- Advisor (admin) ----
export const advisorSchema = z.object({
  name: z.string().min(2).max(200),
  title: z.string().min(2).max(200),
  background: z.string().max(1000).optional(),
  bio: z.string().max(3000).optional(),
  qualifications: z.string().max(1000).optional(),
  photo_url: z.string().url().optional().or(z.literal("")),
  professional_links: z
    .object({
      linkedin: z.string().url().optional().or(z.literal("")),
      website: z.string().url().optional().or(z.literal("")),
    })
    .optional(),
  sort_order: z.number().default(0),
  is_published: z.boolean().default(false),
});
export type AdvisorValues = z.infer<typeof advisorSchema>;

// ---- Partner (admin) ----
export const partnerSchema = z.object({
  name: z.string().min(2).max(300),
  description: z.string().max(500).optional(),
  logo_url: z.string().url().optional().or(z.literal("")),
  website_url: z.string().url().optional().or(z.literal("")),
  sort_order: z.number().default(0),
  is_published: z.boolean().default(false),
});
export type PartnerValues = z.infer<typeof partnerSchema>;

// ---- Governance member (admin) ----
export const governanceMemberSchema = z.object({
  name: z.string().min(2).max(200),
  position: z.string().min(2).max(200),
  unit_id: z.string().uuid().optional(),
  bio: z.string().max(2000).optional(),
  photo_url: z.string().url().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  sort_order: z.number().default(0),
  is_published: z.boolean().default(false),
});
export type GovernanceMemberValues = z.infer<typeof governanceMemberSchema>;

// ---- Admin login ----
export const adminLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type AdminLoginValues = z.infer<typeof adminLoginSchema>;

// ---- File upload validation ----
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];
export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024; // 20MB

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "File must be JPEG, PNG, WebP, GIF, or SVG";
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return "Image must be smaller than 5 MB";
  }
  return null;
}

export function validateDocumentFile(file: File): string | null {
  if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
    return "File must be a PDF or Word document";
  }
  if (file.size > MAX_DOCUMENT_SIZE) {
    return "Document must be smaller than 20 MB";
  }
  return null;
}

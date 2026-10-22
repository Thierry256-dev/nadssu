"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Image as ImageIcon, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createOpportunity, updateOpportunity } from "@/lib/actions/admin";
import { createClient } from "@/lib/supabase/client";

interface CareerOpportunityFormProps {
  initialValues?: {
    id?: string;
    title?: string;
    slug?: string;
    category?:
      | "Internship"
      | "Job Advert"
      | "Volunteering & Resources"
      | "Research Grant";
    organisation?: string;
    org_logo_url?: string;
    featured_image_url?: string;
    description?: string;
    location?: string;
    work_mode?: "Remote" | "On-site" | "Hybrid";
    funding_details?: string;
    duration?: string;
    deadline?: string;
    opens_at?: string;
    application_link?: string;
    contact_email?: string;
    status?: "draft" | "published" | "archived" | "closed";
    is_featured?: boolean;
  };
}

const defaultValues = {
  title: "",
  slug: "",
  category: "Internship" as const,
  organisation: "",
  org_logo_url: "",
  featured_image_url: "",
  description: "",
  location: "",
  work_mode: "Remote" as const,
  funding_details: "",
  duration: "",
  deadline: "",
  opens_at: "",
  application_link: "",
  contact_email: "",
  status: "draft" as const,
  is_featured: false,
};

export function CareerOpportunityForm({
  initialValues,
}: CareerOpportunityFormProps) {
  const router = useRouter();
  const [values, setValues] = useState({
    ...defaultValues,
    ...initialValues,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  function updateField<K extends keyof typeof values>(
    key: K,
    value: (typeof values)[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleImageUpload(
    field: "org_logo_url" | "featured_image_url",
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please upload a valid image file (JPG, PNG, WebP, GIF, or SVG).",
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }

    try {
      setIsUploadingImage(true);
      setError("");

      const supabase = createClient();
      const folder =
        field === "org_logo_url" ? "career-hub/logos" : "career-hub/featured";
      const filePath = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);
      updateField(field, publicData.publicUrl);
    } catch (uploadError: unknown) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Image upload failed. Please try again.",
      );
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload = {
        ...values,
        organisation: values.organisation || undefined,
        org_logo_url: values.org_logo_url || undefined,
        featured_image_url: values.featured_image_url || undefined,
        description: values.description || undefined,
        location: values.location || undefined,
        work_mode: values.work_mode || undefined,
        funding_details: values.funding_details || undefined,
        duration: values.duration || undefined,
        deadline: values.deadline || undefined,
        opens_at: values.opens_at || undefined,
        application_link: values.application_link || undefined,
        contact_email: values.contact_email || undefined,
      };

      const result = initialValues?.id
        ? await updateOpportunity(initialValues.id, payload)
        : await createOpportunity(payload);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push("/admin/career-hub");
      router.refresh();
    } catch {
      setError("Something went wrong while saving the opportunity.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-navy">Title</label>
          <Input
            value={values.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Graduate Nutrition Intern"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Slug</label>
          <Input
            value={values.slug}
            onChange={(event) => updateField("slug", event.target.value)}
            placeholder="graduate-nutrition-intern"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Category</label>
          <select
            value={values.category}
            onChange={(event) =>
              updateField(
                "category",
                event.target.value as typeof values.category,
              )
            }
            className="h-10 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="Internship">Internship</option>
            <option value="Job Advert">Job Advert</option>
            <option value="Volunteering & Resources">
              Volunteering & Resources
            </option>
            <option value="Research Grant">Research Grant</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Organisation</label>
          <Input
            value={values.organisation}
            onChange={(event) =>
              updateField("organisation", event.target.value)
            }
            placeholder="NADSSU Partner Organisation"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Location</label>
          <Input
            value={values.location}
            onChange={(event) => updateField("location", event.target.value)}
            placeholder="Kampala, Uganda"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Work mode</label>
          <select
            value={values.work_mode}
            onChange={(event) =>
              updateField(
                "work_mode",
                event.target.value as typeof values.work_mode,
              )
            }
            className="h-10 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Status</label>
          <select
            value={values.status}
            onChange={(event) =>
              updateField("status", event.target.value as typeof values.status)
            }
            className="h-10 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">
            Application link
          </label>
          <Input
            type="url"
            value={values.application_link}
            onChange={(event) =>
              updateField("application_link", event.target.value)
            }
            placeholder="https://example.com/apply"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Contact email</label>
          <Input
            type="email"
            value={values.contact_email}
            onChange={(event) =>
              updateField("contact_email", event.target.value)
            }
            placeholder="jobs@example.org"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Deadline</label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="date"
              value={values.deadline ?? ""}
              onChange={(event) => updateField("deadline", event.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Opens at</label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="date"
              value={values.opens_at ?? ""}
              onChange={(event) => updateField("opens_at", event.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Duration</label>
          <Input
            value={values.duration}
            onChange={(event) => updateField("duration", event.target.value)}
            placeholder="3 months"
          />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-navy">
            Funding details
          </label>
          <Textarea
            value={values.funding_details}
            onChange={(event) =>
              updateField("funding_details", event.target.value)
            }
            rows={3}
            placeholder="Grant value, stipend, or funding conditions"
          />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-navy">Description</label>
          <Textarea
            value={values.description}
            onChange={(event) => updateField("description", event.target.value)}
            rows={10}
            placeholder="Detailed opportunity overview, duties, eligibility, and application requirements"
          />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-navy">
            Organisation logo
          </label>
          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
            <Input
              type="file"
              accept="image/*"
              onChange={(event) => handleImageUpload("org_logo_url", event)}
              disabled={isUploadingImage || isSubmitting}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {isUploadingImage
                ? "Uploading logo..."
                : "PNG, JPG, WebP, GIF, or SVG up to 5MB"}
            </p>
          </div>
          {values.org_logo_url ? (
            <div className="mt-3 overflow-hidden rounded-xl border border-border bg-muted/20 p-2">
              <img
                src={values.org_logo_url}
                alt="Organisation logo preview"
                className="h-20 w-20 object-contain"
              />
            </div>
          ) : null}
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-navy">
            Featured image
          </label>
          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
            <Input
              type="file"
              accept="image/*"
              onChange={(event) =>
                handleImageUpload("featured_image_url", event)
              }
              disabled={isUploadingImage || isSubmitting}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {isUploadingImage
                ? "Uploading image..."
                : "PNG, JPG, WebP, GIF, or SVG up to 5MB"}
            </p>
          </div>
          {values.featured_image_url ? (
            <div className="mt-3 overflow-hidden rounded-xl border border-border bg-muted/20">
              <img
                src={values.featured_image_url}
                alt="Featured preview"
                className="h-48 w-full object-cover"
              />
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-3 lg:col-span-2 rounded-xl border border-border bg-muted/30 px-4 py-3">
          <input
            id="is_featured"
            type="checkbox"
            checked={values.is_featured}
            onChange={(event) =>
              updateField("is_featured", event.target.checked)
            }
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <label
            htmlFor="is_featured"
            className="text-sm font-medium text-navy"
          >
            Feature this opportunity on the homepage or priority listings
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isUploadingImage}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {initialValues?.id ? "Update opportunity" : "Create opportunity"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Image as ImageIcon, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createEvent, updateEvent } from "@/lib/actions/admin";
import { createClient } from "@/lib/supabase/client";

const EVENT_CATEGORIES = [
  "Seminar & Workshop",
  "Celebration",
  "Community Outreach",
  "Conference",
  "General",
] as const;

const EVENT_STATUSES = [
  "draft",
  "published",
  "cancelled",
  "completed",
] as const;

interface EventFormProps {
  initialValues?: {
    id?: string;
    title?: string;
    slug?: string;
    category?: (typeof EVENT_CATEGORIES)[number];
    description?: string;
    cover_image_url?: string;
    start_date?: string;
    end_date?: string;
    venue?: string;
    is_online?: boolean;
    meeting_link?: string;
    registration_link?: string;
    organiser?: string;
    status?: (typeof EVENT_STATUSES)[number];
  };
}

const defaultValues = {
  title: "",
  slug: "",
  category: "General" as const,
  description: "",
  cover_image_url: "",
  start_date: "",
  end_date: "",
  venue: "",
  is_online: false,
  meeting_link: "",
  registration_link: "",
  organiser: "",
  status: "draft" as const,
};

function formatDateTimeLocal(value?: string) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const offsetMinutes = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offsetMinutes * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

function normalizeDateTime(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function EventForm({ initialValues }: EventFormProps) {
  const router = useRouter();
  const [values, setValues] = useState({
    ...defaultValues,
    ...initialValues,
    category: initialValues?.category ?? "General",
    status: initialValues?.status ?? "draft",
    is_online: initialValues?.is_online ?? false,
    start_date: formatDateTimeLocal(initialValues?.start_date),
    end_date: formatDateTimeLocal(initialValues?.end_date),
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

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
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
      const filePath = `events/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
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
      updateField("cover_image_url", publicData.publicUrl);
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
        cover_image_url: values.cover_image_url || undefined,
        description: values.description || undefined,
        end_date: normalizeDateTime(values.end_date),
        start_date: normalizeDateTime(values.start_date),
        venue: values.venue || undefined,
        meeting_link: values.meeting_link || undefined,
        registration_link: values.registration_link || undefined,
        organiser: values.organiser || undefined,
      };

      const result = initialValues?.id
        ? await updateEvent(initialValues.id, payload)
        : await createEvent(payload);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push("/admin/events");
      router.refresh();
    } catch {
      setError("Something went wrong while saving the event.");
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
            placeholder="NADSSU Annual Leadership Summit"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Slug</label>
          <Input
            value={values.slug}
            onChange={(event) => updateField("slug", event.target.value)}
            placeholder="annual-leadership-summit"
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
                event.target.value as (typeof EVENT_CATEGORIES)[number],
              )
            }
            className="h-10 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {EVENT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Status</label>
          <select
            value={values.status}
            onChange={(event) =>
              updateField(
                "status",
                event.target.value as (typeof EVENT_STATUSES)[number],
              )
            }
            className="h-10 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {EVENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Start date</label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="datetime-local"
              value={values.start_date}
              onChange={(event) =>
                updateField("start_date", event.target.value)
              }
              className="pl-9"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">End date</label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="datetime-local"
              value={values.end_date}
              onChange={(event) => updateField("end_date", event.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Venue</label>
          <Input
            value={values.venue}
            onChange={(event) => updateField("venue", event.target.value)}
            placeholder="NADSSU Secretariat Hall"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Organiser</label>
          <Input
            value={values.organiser}
            onChange={(event) => updateField("organiser", event.target.value)}
            placeholder="NADSSU Secretariat"
          />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
            <input
              id="is-online"
              type="checkbox"
              checked={values.is_online}
              onChange={(event) =>
                updateField("is_online", event.target.checked)
              }
              className="h-4 w-4 rounded border-border text-primary"
            />
            <label
              htmlFor="is-online"
              className="text-sm font-medium text-navy"
            >
              This is an online event
            </label>
          </div>
        </div>

        {values.is_online ? (
          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm font-medium text-navy">
              Meeting link
            </label>
            <Input
              value={values.meeting_link}
              onChange={(event) =>
                updateField("meeting_link", event.target.value)
              }
              type="url"
              placeholder="https://meet.google.com/..."
            />
          </div>
        ) : null}

        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-navy">
            Registration link
          </label>
          <Input
            value={values.registration_link}
            onChange={(event) =>
              updateField("registration_link", event.target.value)
            }
            type="url"
            placeholder="https://example.com/register"
          />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-navy">Cover image</label>
          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploadingImage || isSubmitting}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {isUploadingImage
                ? "Uploading image..."
                : "PNG, JPG, WebP, GIF, or SVG up to 5MB"}
            </p>
          </div>

          {values.cover_image_url ? (
            <div className="mt-3 overflow-hidden rounded-xl border border-border bg-muted/20">
              <img
                src={values.cover_image_url}
                alt="Event cover preview"
                className="h-52 w-full object-cover"
              />
            </div>
          ) : null}
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-navy">Description</label>
          <Textarea
            value={values.description}
            onChange={(event) => updateField("description", event.target.value)}
            rows={8}
            placeholder="Provide the event summary, objectives, agenda, and any additional details."
          />
        </div>

        <div className="flex items-center justify-end gap-3 lg:col-span-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/events")}
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
                {initialValues?.id ? "Update event" : "Create event"}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

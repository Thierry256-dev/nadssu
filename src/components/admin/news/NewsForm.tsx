"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Image as ImageIcon, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createNewsPost, updateNewsPost } from "@/lib/actions/admin";
import { createClient } from "@/lib/supabase/client";

interface NewsFormProps {
  initialValues?: {
    id?: string;
    title?: string;
    slug?: string;
    summary?: string;
    content?: string;
    author?: string;
    category?: string;
    cover_image_url?: string;
    status?: "draft" | "published" | "archived";
    is_featured?: boolean;
    published_at?: string;
  };
}

const defaultValues = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  author: "",
  category: "General",
  cover_image_url: "",
  status: "draft" as const,
  is_featured: false,
  published_at: "",
};

export function NewsForm({ initialValues }: NewsFormProps) {
  const router = useRouter();
  const [values, setValues] = useState({
    ...defaultValues,
    ...initialValues,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  function updateField<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
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
      setError("Please upload a valid image file (JPG, PNG, WebP, GIF, or SVG).");
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
      const filePath = `news/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicData } = supabase.storage.from("images").getPublicUrl(filePath);
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
        summary: values.summary || undefined,
        content: values.content || undefined,
        author: values.author || undefined,
        published_at: values.published_at || undefined,
      };

      const result = initialValues?.id
        ? await updateNewsPost(initialValues.id, payload)
        : await createNewsPost(payload);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push("/admin/news");
      router.refresh();
    } catch {
      setError("Something went wrong while saving the news update.");
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
            placeholder="NADSSU hosts annual nutrition forum"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Slug</label>
          <Input
            value={values.slug}
            onChange={(event) => updateField("slug", event.target.value)}
            placeholder="annual-nutrition-forum"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Category</label>
          <Input
            value={values.category}
            onChange={(event) => updateField("category", event.target.value)}
            placeholder="General"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Author</label>
          <Input
            value={values.author}
            onChange={(event) => updateField("author", event.target.value)}
            placeholder="NADSSU Secretariat"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Status</label>
          <select
            value={values.status}
            onChange={(event) => updateField("status", event.target.value as "draft" | "published" | "archived")}
            className="h-10 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Published date</label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="datetime-local"
              value={values.published_at ? values.published_at.slice(0, 16) : ""}
              onChange={(event) => updateField("published_at", event.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-navy">Summary</label>
          <Textarea
            value={values.summary}
            onChange={(event) => updateField("summary", event.target.value)}
            rows={4}
            placeholder="A short summary of the update"
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
              {isUploadingImage ? "Uploading image..." : "PNG, JPG, WebP, GIF, or SVG up to 5MB"}
            </p>
          </div>

          {values.cover_image_url ? (
            <div className="mt-3 overflow-hidden rounded-xl border border-border bg-muted/20">
              <img
                src={values.cover_image_url}
                alt="News cover preview"
                className="h-48 w-full object-cover"
              />
            </div>
          ) : null}
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-navy">Content</label>
          <Textarea
            value={values.content}
            onChange={(event) => updateField("content", event.target.value)}
            rows={12}
            placeholder="Paste article HTML or rich text content here"
          />
        </div>

        <div className="flex items-center gap-3 lg:col-span-2 rounded-xl border border-border bg-muted/30 px-4 py-3">
          <input
            id="featured"
            type="checkbox"
            checked={values.is_featured}
            onChange={(event) => updateField("is_featured", event.target.checked)}
            className="h-4 w-4 rounded border-border text-primary"
          />
          <label htmlFor="featured" className="text-sm font-medium text-navy">
            Mark as featured article
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/news")}>
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
              {initialValues?.id ? "Update" : "Publish"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

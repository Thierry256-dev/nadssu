"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createGovernanceMember,
  updateGovernanceMember,
} from "@/lib/actions/admin";
import { createClient } from "@/lib/supabase/client";
import { validateImageFile } from "@/lib/validations";

interface GovernanceUnitOption {
  id: string;
  title: string;
}

interface GovernanceMemberFormProps {
  units: GovernanceUnitOption[];
  initialValues?: {
    id?: string;
    name?: string;
    position?: string;
    unit_id?: string;
    bio?: string;
    photo_url?: string;
    email?: string;
    sort_order?: number;
    is_published?: boolean;
  };
}

const defaultValues = {
  name: "",
  position: "",
  unit_id: "",
  bio: "",
  photo_url: "",
  email: "",
  sort_order: 0,
  is_published: false,
};

export function GovernanceMemberForm({
  units,
  initialValues,
}: GovernanceMemberFormProps) {
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
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      event.target.value = "";
      return;
    }

    try {
      setIsUploadingImage(true);
      setError("");

      const supabase = createClient();
      const filePath = `governance/${crypto.randomUUID()}`;
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: "3600",
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("images").getPublicUrl(filePath);
      updateField("photo_url", data.publicUrl);
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
        unit_id: values.unit_id || undefined,
        bio: values.bio || undefined,
        photo_url: values.photo_url || undefined,
        email: values.email || undefined,
      };

      const result = initialValues?.id
        ? await updateGovernanceMember(initialValues.id, payload)
        : await createGovernanceMember(payload);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push("/admin/governance");
      router.refresh();
    } catch {
      setError("Something went wrong while saving the governance member.");
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
        <div className="space-y-2">
          <label htmlFor="member-name" className="text-sm font-medium text-navy">
            Full name
          </label>
          <Input
            id="member-name"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Member name"
            required
            maxLength={200}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="member-position"
            className="text-sm font-medium text-navy"
          >
            Position
          </label>
          <Input
            id="member-position"
            value={values.position}
            onChange={(event) => updateField("position", event.target.value)}
            placeholder="President"
            required
            maxLength={200}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="member-unit" className="text-sm font-medium text-navy">
            Governance unit
          </label>
          <select
            id="member-unit"
            value={values.unit_id}
            onChange={(event) => updateField("unit_id", event.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">No unit</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.title}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="member-email" className="text-sm font-medium text-navy">
            Email
          </label>
          <Input
            id="member-email"
            type="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="member@example.org"
            maxLength={254}
          />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label
            htmlFor="member-photo"
            className="text-sm font-medium text-navy"
          >
            Profile photo
          </label>
          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
            <Input
              id="member-photo"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              onChange={handleImageUpload}
              disabled={isUploadingImage || isSubmitting}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {isUploadingImage
                ? "Uploading image..."
                : "JPEG, PNG, WebP, GIF, or SVG up to 5 MB"}
            </p>
          </div>
          <Input
            aria-label="Profile photo URL"
            type="url"
            value={values.photo_url}
            onChange={(event) => updateField("photo_url", event.target.value)}
            placeholder="Or paste a profile photo URL"
          />
          {values.photo_url ? (
            <a
              href={values.photo_url}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-sm font-medium text-primary hover:underline"
            >
              View current profile photo
            </a>
          ) : null}
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label htmlFor="member-bio" className="text-sm font-medium text-navy">
            Biography
          </label>
          <Textarea
            id="member-bio"
            value={values.bio}
            onChange={(event) => updateField("bio", event.target.value)}
            rows={5}
            maxLength={2000}
            placeholder="Add a short biography"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="member-sort-order"
            className="text-sm font-medium text-navy"
          >
            Display order
          </label>
          <Input
            id="member-sort-order"
            type="number"
            step="1"
            value={values.sort_order}
            onChange={(event) =>
              updateField("sort_order", Number(event.target.value))
            }
          />
        </div>

        <div className="flex items-center gap-3 self-end rounded-xl border border-border bg-muted/30 px-4 py-3">
          <input
            id="member-published"
            type="checkbox"
            checked={values.is_published}
            onChange={(event) =>
              updateField("is_published", event.target.checked)
            }
            className="h-4 w-4 rounded border-border text-primary"
          />
          <label
            htmlFor="member-published"
            className="text-sm font-medium text-navy"
          >
            Publish this profile
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/governance")}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || isUploadingImage}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save member
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { Image as ImageIcon, Loader2, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { deleteSiteSetting, updateSiteSetting } from "@/lib/actions/admin";
import { DEFAULT_SITE_CONFIG } from "@/lib/utils/site-config-defaults";
import type { SiteConfig } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

const SOCIAL_KEYS = [
  { key: "facebook", label: "Facebook" },
  { key: "twitter", label: "X / Twitter" },
  { key: "instagram", label: "Instagram" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "youtube", label: "YouTube" },
] as const;

interface SiteSettingsFormProps {
  initialConfig: SiteConfig;
  currentRows: Array<{ key: string; value: unknown }>;
}

export function SiteSettingsForm({
  initialConfig,
  currentRows,
}: SiteSettingsFormProps) {
  const buildInitialValues = () => {
    const rowMap = Object.fromEntries(
      currentRows.map((row) => [row.key, row.value]),
    );

    return {
      ...DEFAULT_SITE_CONFIG,
      ...initialConfig,
      ...(rowMap.site_name !== undefined
        ? { site_name: String(rowMap.site_name) }
        : {}),
      ...(rowMap.site_tagline !== undefined
        ? { site_tagline: String(rowMap.site_tagline) }
        : {}),
      ...(rowMap.site_description !== undefined
        ? { site_description: String(rowMap.site_description) }
        : {}),
      ...(rowMap.hero_heading !== undefined
        ? { hero_heading: String(rowMap.hero_heading) }
        : {}),
      ...(rowMap.hero_subheading !== undefined
        ? { hero_subheading: String(rowMap.hero_subheading) }
        : {}),
      ...(rowMap.hero_cta_primary !== undefined &&
      typeof rowMap.hero_cta_primary === "object"
        ? {
            hero_cta_primary: {
              ...DEFAULT_SITE_CONFIG.hero_cta_primary,
              ...(rowMap.hero_cta_primary as Record<string, string>),
            },
          }
        : {}),
      ...(rowMap.hero_cta_secondary !== undefined &&
      typeof rowMap.hero_cta_secondary === "object"
        ? {
            hero_cta_secondary: {
              ...DEFAULT_SITE_CONFIG.hero_cta_secondary,
              ...(rowMap.hero_cta_secondary as Record<string, string>),
            },
          }
        : {}),
      ...(rowMap.hero_image_url !== undefined
        ? { hero_image_url: String(rowMap.hero_image_url || "") || null }
        : {}),
      ...(rowMap.announcement !== undefined
        ? { announcement: String(rowMap.announcement || "") || null }
        : {}),
      ...(rowMap.logo_url !== undefined
        ? { logo_url: String(rowMap.logo_url || "") || null }
        : {}),
      ...(rowMap.favicon_url !== undefined
        ? { favicon_url: String(rowMap.favicon_url || "") || null }
        : {}),
      ...(rowMap.contact_email !== undefined
        ? { contact_email: String(rowMap.contact_email) }
        : {}),
      ...(rowMap.contact_phone !== undefined
        ? {
            contact_phone: Array.isArray(rowMap.contact_phone)
              ? (rowMap.contact_phone as string[])
              : DEFAULT_SITE_CONFIG.contact_phone,
          }
        : {}),
      ...(rowMap.contact_address !== undefined
        ? { contact_address: String(rowMap.contact_address) }
        : {}),
      ...(rowMap.social_links !== undefined &&
      typeof rowMap.social_links === "object"
        ? {
            social_links: {
              ...DEFAULT_SITE_CONFIG.social_links,
              ...(rowMap.social_links as Record<string, string>),
            },
          }
        : {}),
      ...(rowMap.footer_description !== undefined
        ? { footer_description: String(rowMap.footer_description) }
        : {}),
      ...(rowMap.patron_name !== undefined
        ? { patron_name: String(rowMap.patron_name) }
        : {}),
      ...(rowMap.patron_title !== undefined
        ? { patron_title: String(rowMap.patron_title) }
        : {}),
      ...(rowMap.patron_bio !== undefined
        ? { patron_bio: String(rowMap.patron_bio) }
        : {}),
      ...(rowMap.patron_image_url !== undefined
        ? { patron_image_url: String(rowMap.patron_image_url || "") || null }
        : {}),
      ...(rowMap.president_name !== undefined
        ? { president_name: String(rowMap.president_name) }
        : {}),
      ...(rowMap.president_title !== undefined
        ? { president_title: String(rowMap.president_title) }
        : {}),
      ...(rowMap.president_bio !== undefined
        ? { president_bio: String(rowMap.president_bio) }
        : {}),
      ...(rowMap.president_image_url !== undefined
        ? {
            president_image_url:
              String(rowMap.president_image_url || "") || null,
          }
        : {}),
      ...(rowMap.mandate_heading !== undefined
        ? { mandate_heading: String(rowMap.mandate_heading) }
        : {}),
      ...(rowMap.mandate_content !== undefined
        ? { mandate_content: String(rowMap.mandate_content) }
        : {}),
      ...(rowMap.services_heading !== undefined
        ? { services_heading: String(rowMap.services_heading) }
        : {}),
      ...(rowMap.services_content !== undefined
        ? { services_content: String(rowMap.services_content) }
        : {}),
    } as SiteConfig;
  };

  const [values, setValues] = useState<SiteConfig>(() => buildInitialValues());
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});

  function updateField<K extends keyof SiteConfig>(
    key: K,
    value: SiteConfig[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleUpload(
    field:
      | "logo_url"
      | "favicon_url"
      | "hero_image_url"
      | "patron_image_url"
      | "president_image_url",
    file: File,
  ) {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      setMessage("Please upload a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image must be smaller than 5 MB.");
      return;
    }

    try {
      setIsUploading((current) => ({ ...current, [field]: true }));
      setMessage(null);

      const supabase = createClient();
      const targetFolder =
        field === "favicon_url" ? "branding/favicon" : "branding";
      const filePath = `${targetFolder}/${Date.now()}-${file.name.replace(
        /\s+/g,
        "-",
      )}`;
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
      setMessage("Image uploaded. Save the settings to apply it.");
    } catch (error: unknown) {
      setMessage(
        error instanceof Error ? error.message : "Image upload failed.",
      );
    } finally {
      setIsUploading((current) => ({ ...current, [field]: false }));
    }
  }

  async function handleSave() {
    setMessage(null);
    setIsSaving(true);

    try {
      const entries: Array<[keyof SiteConfig, SiteConfig[keyof SiteConfig]]> = [
        ["site_name", values.site_name],
        ["site_tagline", values.site_tagline],
        ["site_description", values.site_description],
        ["hero_heading", values.hero_heading],
        ["hero_subheading", values.hero_subheading],
        ["hero_cta_primary", values.hero_cta_primary],
        ["hero_cta_secondary", values.hero_cta_secondary],
        ["hero_image_url", values.hero_image_url],
        ["announcement", values.announcement],
        ["logo_url", values.logo_url],
        ["favicon_url", values.favicon_url],
        ["contact_email", values.contact_email],
        ["contact_phone", values.contact_phone],
        ["contact_address", values.contact_address],
        ["social_links", values.social_links],
        ["footer_description", values.footer_description],
        ["patron_name", values.patron_name],
        ["patron_title", values.patron_title],
        ["patron_bio", values.patron_bio],
        ["patron_image_url", values.patron_image_url],
        ["president_name", values.president_name],
        ["president_title", values.president_title],
        ["president_bio", values.president_bio],
        ["president_image_url", values.president_image_url],
        ["mandate_heading", values.mandate_heading],
        ["mandate_content", values.mandate_content],
        ["services_heading", values.services_heading],
        ["services_content", values.services_content],
      ];

      for (const [key, value] of entries) {
        const result = await updateSiteSetting(String(key), value ?? null);
        if (!result.success) {
          throw new Error(result.error ?? `Failed to save ${String(key)}`);
        }
      }

      setMessage("Settings saved successfully.");
    } catch (error: unknown) {
      setMessage(
        error instanceof Error ? error.message : "Settings could not be saved.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleResetDefaults() {
    const keys = Object.keys(DEFAULT_SITE_CONFIG);
    setMessage(null);

    try {
      for (const key of keys) {
        const result = await deleteSiteSetting(key);
        if (!result.success) {
          throw new Error(result.error ?? `Failed to reset ${key}`);
        }
      }
      setValues(DEFAULT_SITE_CONFIG);
      setMessage("Site settings were reset to default values.");
    } catch (error: unknown) {
      setMessage(
        error instanceof Error ? error.message : "Could not reset settings.",
      );
    }
  }

  return (
    <div className="space-y-6">
      {message ? (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          {message}
        </div>
      ) : null}

      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleResetDefaults}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset to default
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Site name</label>
          <Input
            value={values.site_name}
            onChange={(event) => updateField("site_name", event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Site tagline</label>
          <Input
            value={values.site_tagline}
            onChange={(event) =>
              updateField("site_tagline", event.target.value)
            }
          />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-navy">
            Site description
          </label>
          <Textarea
            value={values.site_description}
            onChange={(event) =>
              updateField("site_description", event.target.value)
            }
            rows={4}
          />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-navy">Branding</label>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-navy">
                <ImageIcon className="h-4 w-4" /> Logo
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  event.target.files?.[0] &&
                  handleUpload("logo_url", event.target.files[0])
                }
                disabled={isUploading.logo_url}
              />
              {values.logo_url ? (
                <img
                  src={values.logo_url}
                  alt="Logo preview"
                  className="mt-3 h-16 w-16 rounded-md object-contain bg-white"
                />
              ) : null}
            </div>

            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-navy">
                <ImageIcon className="h-4 w-4" /> Favicon
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  event.target.files?.[0] &&
                  handleUpload("favicon_url", event.target.files[0])
                }
                disabled={isUploading.favicon_url}
              />
              {values.favicon_url ? (
                <img
                  src={values.favicon_url}
                  alt="Favicon preview"
                  className="mt-3 h-12 w-12 rounded-md object-contain bg-white"
                />
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-navy">Announcement</label>
          <Input
            value={values.announcement ?? ""}
            onChange={(event) =>
              updateField("announcement", event.target.value || null)
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Hero heading</label>
          <Input
            value={values.hero_heading}
            onChange={(event) =>
              updateField("hero_heading", event.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">
            Hero subheading
          </label>
          <Input
            value={values.hero_subheading}
            onChange={(event) =>
              updateField("hero_subheading", event.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">
            Primary CTA label
          </label>
          <Input
            value={values.hero_cta_primary.label}
            onChange={(event) =>
              updateField("hero_cta_primary", {
                ...values.hero_cta_primary,
                label: event.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">
            Primary CTA link
          </label>
          <Input
            value={values.hero_cta_primary.href}
            onChange={(event) =>
              updateField("hero_cta_primary", {
                ...values.hero_cta_primary,
                href: event.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">
            Secondary CTA label
          </label>
          <Input
            value={values.hero_cta_secondary.label}
            onChange={(event) =>
              updateField("hero_cta_secondary", {
                ...values.hero_cta_secondary,
                label: event.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">
            Secondary CTA link
          </label>
          <Input
            value={values.hero_cta_secondary.href}
            onChange={(event) =>
              updateField("hero_cta_secondary", {
                ...values.hero_cta_secondary,
                href: event.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-navy">Hero image</label>
          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
            <Input
              type="file"
              accept="image/*"
              onChange={(event) =>
                event.target.files?.[0] &&
                handleUpload("hero_image_url", event.target.files[0])
              }
              disabled={isUploading.hero_image_url}
            />
            {values.hero_image_url ? (
              <img
                src={values.hero_image_url}
                alt="Hero preview"
                className="mt-3 h-32 w-full rounded-lg object-cover"
              />
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Contact email</label>
          <Input
            type="email"
            value={values.contact_email}
            onChange={(event) =>
              updateField("contact_email", event.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Contact phone</label>
          <Input
            value={values.contact_phone.join(", ")}
            onChange={(event) =>
              updateField(
                "contact_phone",
                event.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              )
            }
          />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-navy">
            Contact address
          </label>
          <Input
            value={values.contact_address}
            onChange={(event) =>
              updateField("contact_address", event.target.value)
            }
          />
        </div>

        {SOCIAL_KEYS.map(({ key, label }) => (
          <div key={key} className="space-y-2">
            <label className="text-sm font-medium text-navy">{label}</label>
            <Input
              value={values.social_links[key] ?? ""}
              onChange={(event) =>
                updateField("social_links", {
                  ...values.social_links,
                  [key]: event.target.value,
                })
              }
            />
          </div>
        ))}

        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-navy">
            Footer description
          </label>
          <Textarea
            value={values.footer_description}
            onChange={(event) =>
              updateField("footer_description", event.target.value)
            }
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Patron name</label>
          <Input
            value={values.patron_name}
            onChange={(event) => updateField("patron_name", event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Patron title</label>
          <Input
            value={values.patron_title}
            onChange={(event) =>
              updateField("patron_title", event.target.value)
            }
          />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-navy">Patron bio</label>
          <Textarea
            value={values.patron_bio}
            onChange={(event) => updateField("patron_bio", event.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-navy">Patron image</label>
          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
            <Input
              type="file"
              accept="image/*"
              onChange={(event) =>
                event.target.files?.[0] &&
                handleUpload("patron_image_url", event.target.files[0])
              }
              disabled={isUploading.patron_image_url}
            />
            {values.patron_image_url ? (
              <img
                src={values.patron_image_url}
                alt="Patron preview"
                className="mt-3 h-32 w-full rounded-lg object-cover"
              />
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">
            President name
          </label>
          <Input
            value={values.president_name}
            onChange={(event) =>
              updateField("president_name", event.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">
            President title
          </label>
          <Input
            value={values.president_title}
            onChange={(event) =>
              updateField("president_title", event.target.value)
            }
          />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-navy">President bio</label>
          <Textarea
            value={values.president_bio}
            onChange={(event) =>
              updateField("president_bio", event.target.value)
            }
            rows={3}
          />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-navy">
            President image
          </label>
          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
            <Input
              type="file"
              accept="image/*"
              onChange={(event) =>
                event.target.files?.[0] &&
                handleUpload("president_image_url", event.target.files[0])
              }
              disabled={isUploading.president_image_url}
            />
            {values.president_image_url ? (
              <img
                src={values.president_image_url}
                alt="President preview"
                className="mt-3 h-32 w-full rounded-lg object-cover"
              />
            ) : null}
          </div>
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-navy">
            Mandate heading
          </label>
          <Input
            value={values.mandate_heading}
            onChange={(event) =>
              updateField("mandate_heading", event.target.value)
            }
          />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-navy">
            Mandate content
          </label>
          <Textarea
            value={values.mandate_content}
            onChange={(event) =>
              updateField("mandate_content", event.target.value)
            }
            rows={4}
          />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-navy">
            Services heading
          </label>
          <Input
            value={values.services_heading}
            onChange={(event) =>
              updateField("services_heading", event.target.value)
            }
          />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-navy">
            Services content
          </label>
          <Textarea
            value={values.services_content}
            onChange={(event) =>
              updateField("services_content", event.target.value)
            }
            rows={4}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving || Object.values(isUploading).some(Boolean)}
          className="gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Save settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

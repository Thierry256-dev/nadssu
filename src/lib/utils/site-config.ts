import { createClient } from "@/lib/supabase/server";
import type { SiteConfig } from "@/lib/types";
import { DEFAULT_SITE_CONFIG } from "@/lib/utils/site-config-defaults";

function parseSettingValue(value: unknown): unknown {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}

export { DEFAULT_SITE_CONFIG };

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("key, value");

    if (!data || data.length === 0) {
      return DEFAULT_SITE_CONFIG;
    }

    const config: Record<string, unknown> = { ...DEFAULT_SITE_CONFIG };
    const defaultConfigRecord = DEFAULT_SITE_CONFIG as unknown as Record<
      string,
      unknown
    >;

    for (const row of data) {
      const parsedValue = parseSettingValue(row.value);
      const key = row.key as keyof SiteConfig;

      if (
        row.key === "social_links" &&
        typeof parsedValue === "object" &&
        parsedValue
      ) {
        config[row.key] = {
          ...DEFAULT_SITE_CONFIG.social_links,
          ...(parsedValue as Record<string, string>),
        };
        continue;
      }

      if (
        row.key === "contact_phone" &&
        Array.isArray(parsedValue) &&
        parsedValue.length > 0
      ) {
        config[row.key] = parsedValue as string[];
        continue;
      }

      if (row.key === "hero_cta_primary" || row.key === "hero_cta_secondary") {
        const defaultCta = defaultConfigRecord[row.key] as {
          label: string;
          href: string;
        };
        config[row.key] =
          typeof parsedValue === "object" && parsedValue
            ? { ...defaultCta, ...(parsedValue as Record<string, string>) }
            : defaultCta;
        continue;
      }

      config[row.key] = parsedValue ?? defaultConfigRecord[String(key)];
    }

    return config as unknown as SiteConfig;
  } catch {
    return DEFAULT_SITE_CONFIG;
  }
}

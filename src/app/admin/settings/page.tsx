import { createClient } from "@/lib/supabase/server";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default async function SettingsAdminPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("site_settings")
    .select("id,key,value,updated_at")
    .order("key", { ascending: true })
    .limit(50);

  return (
    <AdminModulePage
      title="Settings"
      description="Review the website’s configuration values and shared front-end settings."
      rows={rows ?? []}
      emptyMessage="No site settings are configured yet."
      ctaLabel="Manage settings"
      ctaHref="/admin/settings"
      columns={[
        {
          key: "key",
          label: "Key",
          render: (row) => (
            <span className="font-medium text-navy">
              {String(row.key ?? "—")}
            </span>
          ),
        },
        {
          key: "value",
          label: "Value",
          render: (row) => (
            <span className="max-w-md truncate text-muted-foreground">
              {row.value ? JSON.stringify(row.value) : "—"}
            </span>
          ),
        },
      ]}
    />
  );
}

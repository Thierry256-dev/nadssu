import { createClient } from "@/lib/supabase/server";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default async function UsersAdminPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("admin_roles")
    .select("id,user_id,role,created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <AdminModulePage
      title="Users"
      description="Manage administrator accounts, access levels, and role assignments."
      rows={rows ?? []}
      emptyMessage="No administrator accounts are available yet."
      ctaLabel="Add user"
      ctaHref="/admin/users/new"
      columns={[
        {
          key: "user_id",
          label: "User",
          render: (row) => (
            <span className="font-medium text-navy">
              {String(row.user_id ?? "—")}
            </span>
          ),
        },
        {
          key: "role",
          label: "Role",
          render: (row) => (
            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
              {String(row.role ?? "admin")}
            </span>
          ),
        },
        {
          key: "created_at",
          label: "Created",
          render: (row) => (
            <span className="text-muted-foreground">
              {row.created_at
                ? new Date(String(row.created_at)).toLocaleDateString()
                : "—"}
            </span>
          ),
        },
      ]}
    />
  );
}

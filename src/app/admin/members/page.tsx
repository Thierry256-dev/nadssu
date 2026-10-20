import { createClient } from "@/lib/supabase/server";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default async function MembersAdminPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("membership_applications")
    .select("id,full_name,email,status,created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <AdminModulePage
      title="Members"
      description="Review membership applications and follow up with prospective members."
      rows={rows ?? []}
      emptyMessage="No applications have been submitted yet."
      ctaLabel="Review applicants"
      ctaHref="/admin/members"
      columns={[
        {
          key: "full_name",
          label: "Applicant",
          render: (row) => (
            <div>
              <div className="font-medium text-navy">
                {String(row.full_name ?? "Unnamed")}
              </div>
              <div className="text-xs text-muted-foreground">
                {String(row.email ?? "")}
              </div>
            </div>
          ),
        },
        {
          key: "status",
          label: "Status",
          render: (row) => (
            <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700">
              {String(row.status ?? "pending")}
            </span>
          ),
        },
        {
          key: "created_at",
          label: "Submitted",
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

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Plus } from "lucide-react";

type AdminTableRow = Record<string, unknown>;

export interface AdminModuleColumn {
  key: string;
  label: string;
  className?: string;
  render?: (row: AdminTableRow) => ReactNode;
}

interface AdminModulePageProps {
  title: string;
  description: string;
  rows: AdminTableRow[];
  columns: AdminModuleColumn[];
  emptyMessage: string;
  ctaLabel: string;
  ctaHref: string;
}

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return String(value);
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

export function AdminModulePage({
  title,
  description,
  rows,
  columns,
  emptyMessage,
  ctaLabel,
  ctaHref,
}: AdminModulePageProps) {
  return (
    <main className="bg-[linear-gradient(180deg,#f7faf7_0%,#ffffff_100%)]">
      <div className="container-site py-8 lg:py-12">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Administration
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
            {ctaHref && (
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                {ctaLabel}
              </Link>
            )}
          </div>
        </div>

        {rows.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border text-left">
                <thead className="bg-muted/40">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        scope="col"
                        className={`px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground ${column.className ?? ""}`}
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((row) => (
                    <tr
                      key={String(row.id ?? Math.random())}
                      className="align-top hover:bg-muted/20"
                    >
                      {columns.map((column) => (
                        <td
                          key={`${String(row.id ?? "row")}-${column.key}`}
                          className={`px-4 py-3 text-sm text-foreground ${column.className ?? ""}`}
                        >
                          {column.render
                            ? column.render(row)
                            : formatCellValue(row[column.key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-navy">No records yet</p>
            <p className="mt-2 text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        )}
      </div>
    </main>
  );
}

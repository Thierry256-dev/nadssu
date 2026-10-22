"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteOpportunity } from "@/lib/actions/admin";

export function CareerOpportunityDeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    const confirmed = window.confirm("Delete this opportunity?");
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteOpportunity(id);
      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Trash2 className="h-4 w-4" />
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}

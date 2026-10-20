"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { adminSignOut } from "@/lib/actions/admin";

export function AdminSignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => adminSignOut())}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isPending}
    >
      <LogOut className="h-4 w-4" />
      {isPending ? "Signing out..." : "Sign out"}
    </button>
  );
}

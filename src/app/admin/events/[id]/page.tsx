import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EventForm } from "@/components/admin/events/EventForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Edit Event",
  description: "Update an existing site event.",
};

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select(
      "id,title,slug,category,description,cover_image_url,start_date,end_date,venue,is_online,meeting_link,registration_link,organiser,status",
    )
    .eq("id", id)
    .single();

  if (!data) {
    notFound();
  }

  return (
    <main className="bg-[linear-gradient(180deg,#f7faf7_0%,#ffffff_100%)]">
      <div className="container-site py-8 lg:py-12">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Events
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy">Edit event</h1>
          </div>
          <Link
            href="/admin/events"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </Link>
        </div>

        <div className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <EventForm
            initialValues={{
              id: data.id,
              title: data.title,
              slug: data.slug,
              category: data.category,
              description: data.description ?? "",
              cover_image_url: data.cover_image_url ?? "",
              start_date: data.start_date ?? "",
              end_date: data.end_date ?? "",
              venue: data.venue ?? "",
              is_online: data.is_online,
              meeting_link: data.meeting_link ?? "",
              registration_link: data.registration_link ?? "",
              organiser: data.organiser ?? "",
              status: data.status,
            }}
          />
        </div>
      </div>
    </main>
  );
}

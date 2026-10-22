import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  ExternalLink,
  MapPin,
  Video,
  Users,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageBanner } from "@/components/layout/PageBanner";
import { createClient } from "@/lib/supabase/server";
import type { Event } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("events")
    .select("title, description")
    .eq("slug", slug)
    .in("status", ["published", "completed", "cancelled"])
    .maybeSingle();

  if (!data) return { title: "Event Not Found" };

  return {
    title: data.title,
    description: (data.description ?? "").replace(/<[^>]*>/g, "").slice(0, 160),
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: eventRow } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .in("status", ["published", "completed", "cancelled"])
    .maybeSingle();

  if (!eventRow) notFound();

  const event = eventRow as Event;
  const startDate = parseISO(event.start_date);
  const endDate = event.end_date ? parseISO(event.end_date) : null;

  return (
    <>
      <PageBanner title={event.title} subtitle={event.category}>
        <Breadcrumb
          items={[{ label: "Events", href: "/events" }, { label: event.title }]}
        />
      </PageBanner>

      <section className="bg-white py-12">
        <div className="container-site">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft size={14} /> Back to events
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <article>
              {event.cover_image_url ? (
                <div className="mb-8 overflow-hidden rounded-3xl border border-border bg-muted/20">
                  <Image
                    src={event.cover_image_url}
                    alt={event.title}
                    width={1200}
                    height={600}
                    className="h-[300px] w-full object-cover"
                    priority
                  />
                </div>
              ) : null}

              <div className="mb-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {event.category}
                </span>
                <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
                  {event.status}
                </span>
                {event.is_online ? (
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    Online Event
                  </span>
                ) : null}
              </div>

              <h2 className="mb-6 text-2xl font-bold text-navy">
                About this event
              </h2>
              {event.description ? (
                <div
                  className="prose-nadssu max-w-none text-sm leading-7 text-foreground/80"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  More details about this event will be shared soon.
                </p>
              )}
            </article>

            <aside className="rounded-3xl border border-border bg-powder p-5 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-navy">
                Event details
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <div className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      Date
                    </div>
                    <div className="font-semibold text-navy">
                      {format(startDate, "EEEE, MMMM d, yyyy")}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <div className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      Time
                    </div>
                    <div className="font-semibold text-navy">
                      {format(startDate, "h:mm a")}
                      {endDate ? ` - ${format(endDate, "h:mm a")}` : ""}
                    </div>
                  </div>
                </div>

                {event.venue ? (
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                      <div className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        Venue
                      </div>
                      <div className="font-semibold text-navy">
                        {event.venue}
                      </div>
                    </div>
                  </div>
                ) : null}

                {event.is_online ? (
                  <div className="flex items-start gap-3">
                    <Video className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                      <div className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        Platform
                      </div>
                      <div className="font-semibold text-navy">
                        Virtual event
                      </div>
                    </div>
                  </div>
                ) : null}

                {event.organiser ? (
                  <div className="flex items-start gap-3">
                    <Users className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                      <div className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        Organiser
                      </div>
                      <div className="font-semibold text-navy">
                        {event.organiser}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-6 flex flex-col gap-3">
                {event.registration_link ? (
                  <a
                    href={event.registration_link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                  >
                    Register now <ExternalLink size={15} />
                  </a>
                ) : null}

                {event.meeting_link ? (
                  <a
                    href={event.meeting_link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-3 text-sm font-semibold text-navy transition-colors hover:bg-muted"
                  >
                    Join meeting <ExternalLink size={15} />
                  </a>
                ) : null}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

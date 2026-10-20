import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  Gauge,
  Globe,
  Landmark,
  Megaphone,
  MessageSquareText,
  Newspaper,
  ShieldCheck,
  Users,
  UserSquare2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminSignOutButton } from "@/components/admin/AdminSignOutButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "NADSSU admin dashboard overview.",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const [
    { data: newsCount },
    { data: eventsCount },
    { data: opportunitiesCount },
    { data: applicationsCount },
    { data: messagesCount },
  ] = await Promise.all([
    supabase
      .from("news_posts")
      .select("id", { count: "exact", head: true })
      .neq("status", "archived"),
    supabase.from("events").select("id", { count: "exact", head: true }),
    supabase
      .from("career_opportunities")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("membership_applications")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    {
      label: "News posts",
      value: String(newsCount ?? 0),
      icon: Newspaper,
      href: "/admin/news",
    },
    {
      label: "Events",
      value: String(eventsCount ?? 0),
      icon: CalendarDays,
      href: "/admin/events",
    },
    {
      label: "Opportunities",
      value: String(opportunitiesCount ?? 0),
      icon: BriefcaseBusiness,
      href: "/admin/career-hub",
    },
    {
      label: "Applications",
      value: String(applicationsCount ?? 0),
      icon: Users,
      href: "/admin/members",
    },
    {
      label: "Messages",
      value: String(messagesCount ?? 0),
      icon: MessageSquareText,
      href: "/admin/messages",
    },
  ];

  const modules = [
    {
      title: "News",
      description: "Manage published content and editorial updates.",
      href: "/admin/news",
      icon: Newspaper,
    },
    {
      title: "Pages",
      description: "Edit about, governance, and static content sections.",
      href: "/admin/pages",
      icon: FileText,
    },
    {
      title: "Members",
      description: "Review applications and track membership records.",
      href: "/admin/members",
      icon: Users,
    },
    {
      title: "Governance",
      description: "Maintain leadership profiles and structure.",
      href: "/admin/governance",
      icon: Landmark,
    },
    {
      title: "Advisors",
      description: "Update professional advisory profiles.",
      href: "/admin/advisors",
      icon: UserSquare2,
    },
    {
      title: "Career Hub",
      description: "Publish internships, jobs, and opportunities.",
      href: "/admin/career-hub",
      icon: BriefcaseBusiness,
    },
    {
      title: "Resources",
      description: "Upload scholarship, policy and programme files.",
      href: "/admin/resources",
      icon: FileText,
    },
    {
      title: "Events",
      description: "Plan workshops, seminars and community engagements.",
      href: "/admin/events",
      icon: CalendarDays,
    },
    {
      title: "Partners",
      description: "Manage institutional and stakeholder relationships.",
      href: "/admin/partners",
      icon: Globe,
    },
    {
      title: "Messages",
      description: "Handle contact and enquiry submissions.",
      href: "/admin/messages",
      icon: MessageSquareText,
    },
    {
      title: "Settings",
      description: "Update branding, social links and site content.",
      href: "/admin/settings",
      icon: ShieldCheck,
    },
    {
      title: "Users",
      description: "Manage administrator roles and access.",
      href: "/admin/users",
      icon: Gauge,
    },
  ];

  return (
    <main className="bg-[linear-gradient(180deg,#f7faf7_0%,#ffffff_100%)]">
      <div className="container-site py-8 lg:py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Admin dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy">Welcome back</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-border bg-white px-3 py-2 text-sm text-muted-foreground">
              {user.email}
            </div>
            <AdminSignOutButton />
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {stats.map(({ label, value, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="group rounded-2xl border border-border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
              <div className="mt-5 text-3xl font-bold text-navy">{value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{label}</div>
            </Link>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Overview
              </p>
              <h2 className="mt-1 text-2xl font-bold text-navy">
                Management modules
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-3 py-1.5 text-xs font-semibold text-secondary-foreground">
              <Bell className="h-3.5 w-3.5" />
              Live
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modules.map(({ title, description, href, icon: Icon }) => (
              <Link
                key={title}
                href={href}
                className="group rounded-2xl border border-border bg-slate-50 p-4 transition-all hover:border-primary/30 hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-navy">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

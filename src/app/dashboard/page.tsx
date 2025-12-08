"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { useMemo } from "react"
import {
  ArrowRight,
  Clock,
  Crown,
  Mail,
  ShieldCheck,
  User2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const subscriptionConfig = {
  ACTIVE: {
    label: "Active subscription",
    accent: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
    description: "Your travel perks are unlocked.",
  },
  TRIAL: {
    label: "Free trial",
    accent: "text-amber-500 bg-amber-500/10 border-amber-500/30",
    description: "Explore features before upgrading.",
  },
  EXPIRED: {
    label: "Expired plan",
    accent: "text-rose-500 bg-rose-500/10 border-rose-500/30",
    description: "Renew to regain premium benefits.",
  },
  NONE: {
    label: "No subscription",
    accent: "text-slate-500 bg-slate-500/10 border-slate-500/30",
    description: "Upgrade to unlock curated itineraries.",
  },
} as const

export default function DashboardOverviewPage() {
  const { data: session, status } = useSession()
  const user = session?.user

  const subscriptionStatus = (user?.subscriptionStatus ?? "NONE") as keyof typeof subscriptionConfig
  const subscriptionTheme = subscriptionConfig[subscriptionStatus] ?? subscriptionConfig.NONE

  const readableExpiry = useMemo(() => {
    if (!user?.subscriptionExpiresAt) return "No upcoming renewal"
    const parsed = new Date(user.subscriptionExpiresAt)
    if (Number.isNaN(parsed.getTime())) return "No upcoming renewal"
    return parsed.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }, [user?.subscriptionExpiresAt])

  const overviewStats = [
    {
      label: "Role",
      value: user?.role ?? "Guest",
      hint: user?.role === "ADMIN" ? "Full workspace access" : "Traveler workspace",
    },
    {
      label: "Subscription",
      value: subscriptionTheme.label,
      hint: subscriptionTheme.description,
    },
    {
      label: "Approval",
      value: user?.isApproved ? "Approved" : "Pending review",
      hint: user?.isApproved ? "You're cleared to book trips" : "We'll notify you soon",
    },
  ]

  if (status === "loading") {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden border border-primary/10 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="pointer-events-none absolute -right-32 top-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <CardHeader className="relative space-y-2">
          <Badge variant="outline" className={`border ${subscriptionTheme.accent}`}>
            <Crown className="h-3.5 w-3.5" />
            {subscriptionTheme.label}
          </Badge>
          <CardTitle className="text-3xl font-semibold">
            Hey {user?.name ?? "Traveler"}, your dashboard is ready.
          </CardTitle>
          <CardDescription>
            Review your access status, plan details and next actions in one snapshot.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {overviewStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm"
              >
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.hint}</p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="relative flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Session secured with JWT access.
          </div>
          <div className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            {readableExpiry}
          </div>
        </CardFooter>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/80">
          <CardHeader className="flex flex-col gap-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <User2 className="h-5 w-5 text-primary" />
              Account identity
            </CardTitle>
            <CardDescription>Key details pulled from the latest login response.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Name</p>
              <p className="text-base font-semibold text-foreground">{user?.name ?? "Traveler Pro"}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
              <div className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {user?.email ?? "test@example.com"}
              </div>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">User ID</p>
              <p className="text-sm font-mono text-foreground">{user?.id ?? "—"}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Subscription ends</p>
              <p className="text-base font-semibold text-foreground">{readableExpiry}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Crown className="h-5 w-5 text-primary" />
              Upgrade suggestions
            </CardTitle>
            <CardDescription>
              Unlock curated travel ideas, custom reminders and concierge chat support.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4">
              <p className="text-sm font-semibold text-primary">Traveler Pro</p>
              <p className="text-sm text-muted-foreground">
                Personalized routes for every upcoming trip.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-sm font-semibold text-foreground">Need approvals faster?</p>
              <p className="text-sm text-muted-foreground">
                Verified members get priority support and advanced planning tools.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard/subscription">
                Explore plans
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Next steps</CardTitle>
          <CardDescription>Pick an action to keep your traveler profile up to date.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "View blog stories",
              description: "Get inspired by recent travel logs.",
              href: "/blog",
            },
            {
              title: "Manage itinerary drafts",
              description: "Review the content waiting in your library.",
              href: "/dashboard/blogs",
            },
            {
              title: "Start a new story",
              description: "Share your next adventure with the community.",
              href: "/dashboard/blogs/new",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex flex-col justify-between rounded-2xl border border-border/60 bg-muted/10 p-4"
            >
              <div>
                <p className="text-base font-semibold text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <Button asChild variant="link" className="px-0 text-primary">
                <Link href={item.href}>
                  Go now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

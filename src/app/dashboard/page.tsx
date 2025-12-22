"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { useMemo, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Clock,
  Crown,
  Mail,
  ShieldCheck,
  User2,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  CalendarCheck,
  Plane,
  Globe,
  Activity,
  ExternalLink,
  Plus,
  Eye,
  Sparkles,
  Ticket,
} from "lucide-react"
import toast from "react-hot-toast"

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

type TravelPlan = {
  id: string
  title: string
  destinationCountry: string
  destinationCity: string
  startDate: string
  endDate: string
  budgetMin: number
  budgetMax: number
  travelType: string
  status: string
  maxParticipants: number
  participantsCount: number
  hostName?: string
  hostId?: string
}

type Stats = {
  hostedPlans: number
  joinedPlans: number
  totalParticipants: number
  upcomingTrips: number
}

type AdminStats = {
  totalUsers: number
  totalTravelPlans: number
  activeCoupons: number
  totalParticipants: number
}

type AdminUser = {
  id: string
  name: string
  email: string
  role: string
  createdAt?: string
}

type AdminTravelPlan = {
  id: string
  title: string
  destinationCity: string
  destinationCountry: string
  status: string
  participantsCount: number
  hostName?: string
  createdAt?: string
}

async function fetchMyTravelPlans(): Promise<TravelPlan[]> {
  try {
    const res = await fetch("/api/travel-plans/my?page=1&limit=10", {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!res.ok) return []
    const data = await res.json()
    if (!data.success) return []
    
    const nestedData = data?.data
    return Array.isArray(nestedData?.data) ? nestedData.data : []
  } catch (error) {
    console.error("Failed to fetch travel plans:", error)
    return []
  }
}

async function fetchTravelHistory(): Promise<TravelPlan[]> {
  try {
    const res = await fetch("/api/travel-plans/me/travel-history?page=1&limit=10", {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!res.ok) return []
    const data = await res.json()
    if (!data.success) return []
    
    return Array.isArray(data?.data?.data) ? data.data.data : []
  } catch (error) {
    console.error("Failed to fetch travel history:", error)
    return []
  }
}

// Admin API functions
async function fetchAdminUsers(limit: number = 5): Promise<AdminUser[]> {
  try {
    const res = await fetch(`/api/users?page=1&limit=${limit}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!res.ok) return []
    const data = await res.json()
    if (!data.success) return []
    
    const nestedData = data?.data
    return Array.isArray(nestedData?.data) ? nestedData.data : []
  } catch (error) {
    console.error("Failed to fetch admin users:", error)
    return []
  }
}

async function fetchAdminTravelPlans(limit: number = 5): Promise<AdminTravelPlan[]> {
  try {
    const res = await fetch(`/api/travel-plans/admin?page=1&limit=${limit}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!res.ok) return []
    const data = await res.json()
    if (!data.success) return []
    
    return Array.isArray(data?.data?.data) ? data.data.data : []
  } catch (error) {
    console.error("Failed to fetch admin travel plans:", error)
    return []
  }
}

async function fetchAdminCoupons(limit: number = 5): Promise<number> {
  try {
    const res = await fetch(`/api/coupons?page=1&limit=${limit}&isActive=true`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!res.ok) return 0
    const data = await res.json()
    if (!data.success) return 0
    
    const nestedData = data?.data
    const meta = nestedData?.meta || data?.meta || {}
    return meta.total || 0
  } catch (error) {
    console.error("Failed to fetch admin coupons:", error)
    return 0
  }
}

function formatDate(iso?: string) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.valueOf())) return "—"
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function getDaysUntil(date: string): number {
  const today = new Date()
  const target = new Date(date)
  const diff = target.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function getStatusBadge(status: string) {
  switch (status) {
    case "OPEN":
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">
          Open
        </Badge>
      )
    case "ENDED":
      return (
        <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-500/20 text-xs">
          Ended
        </Badge>
      )
    case "CANCELLED":
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 text-xs">
          Cancelled
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="text-xs">
          {status}
        </Badge>
      )
  }
}

export default function DashboardOverviewPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const user = session?.user
  const isAdmin = user?.role === "ADMIN"

  // User state
  const [stats, setStats] = useState<Stats>({
    hostedPlans: 0,
    joinedPlans: 0,
    totalParticipants: 0,
    upcomingTrips: 0,
  })
  const [hostedPlans, setHostedPlans] = useState<TravelPlan[]>([])
  const [joinedPlans, setJoinedPlans] = useState<TravelPlan[]>([])
  
  // Admin state
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 0,
    totalTravelPlans: 0,
    activeCoupons: 0,
    totalParticipants: 0,
  })
  const [recentUsers, setRecentUsers] = useState<AdminUser[]>([])
  const [recentTravelPlans, setRecentTravelPlans] = useState<AdminTravelPlan[]>([])
  
  const [loading, setLoading] = useState(true)

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

  const loadUserDashboardData = useCallback(async () => {
    if (status !== "authenticated" || isAdmin) return
    
    setLoading(true)
    try {
      const [hosted, joined] = await Promise.all([
        fetchMyTravelPlans(),
        fetchTravelHistory(),
      ])

      setHostedPlans(hosted)
      
      // Filter only OPEN status for joined plans
      const activeJoined = joined.filter((plan) => plan.status === "OPEN")
      setJoinedPlans(activeJoined.slice(0, 5))

      // Calculate stats
      const now = new Date()
      const upcoming = [...hosted, ...activeJoined].filter((plan) => {
        const startDate = new Date(plan.startDate)
        return startDate >= now && plan.status === "OPEN"
      })

      setStats({
        hostedPlans: hosted.length,
        joinedPlans: activeJoined.length,
        totalParticipants: hosted.reduce((sum, plan) => sum + plan.participantsCount, 0),
        upcomingTrips: upcoming.length,
      })
    } catch {
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }, [status, isAdmin])

  const loadAdminDashboardData = useCallback(async () => {
    if (status !== "authenticated" || !isAdmin) return
    
    setLoading(true)
    try {
      const [users, travelPlans, activeCoupons] = await Promise.all([
        fetchAdminUsers(10),
        fetchAdminTravelPlans(10),
        fetchAdminCoupons(1),
      ])

      setRecentUsers(users.slice(0, 5))
      setRecentTravelPlans(travelPlans.slice(0, 5))

      // Get total counts from meta if available
      const usersRes = await fetch("/api/users?page=1&limit=1", {
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
      })
      const usersData = await usersRes.json()
      const usersTotal = usersData?.data?.meta?.total || users.length

      const plansRes = await fetch("/api/travel-plans/admin?page=1&limit=1", {
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
      })
      const plansData = await plansRes.json()
      const plansTotal = plansData?.data?.meta?.total || travelPlans.length

      const totalParticipants = travelPlans.reduce((sum, plan) => sum + plan.participantsCount, 0)

      setAdminStats({
        totalUsers: usersTotal,
        totalTravelPlans: plansTotal,
        activeCoupons: activeCoupons,
        totalParticipants: totalParticipants,
      })
    } catch {
      toast.error("Failed to load admin dashboard data")
    } finally {
      setLoading(false)
    }
  }, [status, isAdmin])

  useEffect(() => {
    if (status === "authenticated") {
      if (isAdmin) {
        loadAdminDashboardData()
      } else {
        loadUserDashboardData()
      }
    }
  }, [status, isAdmin, loadAdminDashboardData, loadUserDashboardData])

  const upcomingPlans = useMemo(() => {
    const all = [...hostedPlans, ...joinedPlans]
    const now = new Date()
    return all
      .filter((plan) => {
        const startDate = new Date(plan.startDate)
        return startDate >= now && plan.status === "OPEN"
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 3)
  }, [hostedPlans, joinedPlans])

  const statCards = useMemo(() => [
    {
      label: "Hosted Plans",
      value: stats.hostedPlans,
      icon: CalendarCheck,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      href: "/dashboard/events/manage",
    },
    {
      label: "Joined Plans",
      value: stats.joinedPlans,
      icon: Users,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      href: "/dashboard/joined",
    },
    {
      label: "Total Participants",
      value: stats.totalParticipants,
      icon: TrendingUp,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
      href: "/dashboard/events/manage",
    },
    {
      label: "Upcoming Trips",
      value: stats.upcomingTrips,
      icon: Plane,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      href: "/dashboard/joined",
    },
  ], [stats])

  const adminStatCards = useMemo(() => [
    {
      label: "Total Users",
      value: adminStats.totalUsers,
      icon: Users,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      href: "/dashboard/users",
    },
    {
      label: "Travel Plans",
      value: adminStats.totalTravelPlans,
      icon: Globe,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      href: "/dashboard/travel-plans",
    },
    {
      label: "Active Coupons",
      value: adminStats.activeCoupons,
      icon: Ticket,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
      href: "/dashboard/coupon",
    },
    {
      label: "Total Participants",
      value: adminStats.totalParticipants,
      icon: TrendingUp,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      href: "/dashboard/travel-plans",
    },
  ], [adminStats])

  if (status === "loading" || loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    )
  }

  // Render Admin Dashboard
  if (isAdmin) {
    return (
      <div className="space-y-6">
        {/* Admin Welcome Header */}
        <Card className="relative overflow-hidden border border-primary/10 bg-gradient-to-br from-background via-background to-primary/5">
          <div className="pointer-events-none absolute -right-32 top-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />
          <CardHeader className="relative space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="space-y-2">
                <Badge variant="outline" className="border text-purple-500 bg-purple-500/10 border-purple-500/30">
                  <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                  Administrator
                </Badge>
                <CardTitle className="text-3xl font-semibold">
                  Welcome back, {user?.name ?? "Admin"}! 👋
                </CardTitle>
                <CardDescription className="text-base">
                  System overview and management dashboard
                </CardDescription>
              </div>
              <Button asChild size="lg" className="gap-2">
                <Link href="/dashboard/users">
                  <Users className="h-4 w-4" />
                  Manage Users
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardFooter className="relative flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Admin Session
            </div>
            <div className="inline-flex items-center gap-2">
              <User2 className="h-4 w-4 text-primary" />
              {user?.role}
            </div>
          </CardFooter>
        </Card>

        {/* Admin Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {adminStatCards.map((stat) => {
            const Icon = stat.icon
            return (
              <Link key={stat.label} href={stat.href}>
                <Card className="hover:border-primary/50 transition-all cursor-pointer h-full group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl border ${stat.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Admin Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Recent Travel Plans */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Globe className="h-5 w-5 text-primary" />
                  Recent Travel Plans
                </CardTitle>
                <CardDescription>Latest travel plans in the system</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/travel-plans">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentTravelPlans.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Globe className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">No travel plans</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      No travel plans found in the system
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTravelPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="rounded-lg border border-border/50 bg-muted/10 p-3 hover:bg-muted/20 transition-colors cursor-pointer group"
                      onClick={() => router.push(`/travelplan/${plan.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                            {plan.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {plan.destinationCity}, {plan.destinationCountry}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {plan.participantsCount} participants
                            </span>
                          </div>
                        </div>
                        {getStatusBadge(plan.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions & Account Info */}
          <div className="space-y-6">
            {/* Account Status */}
            <Card className="border-border/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User2 className="h-5 w-5 text-primary" />
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Email
                  </p>
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {user?.email ?? "—"}
                  </div>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Role
                  </p>
                  <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Administrator
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard/profile">
                    <User2 className="h-4 w-4 mr-2" />
                    Update Profile
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Quick Actions */}
            <Card className="border-primary/40 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Manage the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start" size="lg">
                  <Link href="/dashboard/users">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start" size="lg">
                  <Link href="/dashboard/travel-plans">
                    <Globe className="h-4 w-4 mr-2" />
                    Manage Travel Plans
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start" size="lg">
                  <Link href="/dashboard/coupon">
                    <Ticket className="h-4 w-4 mr-2" />
                    Manage Coupons
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Users */}
        {recentUsers.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Users className="h-5 w-5 text-primary" />
                  Recent Users
                </CardTitle>
                <CardDescription>Latest registered users</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/users">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUsers.map((adminUser) => (
                  <div
                    key={adminUser.id}
                    className="rounded-lg border border-border/50 bg-muted/10 p-3 hover:bg-muted/20 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/users/${adminUser.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                          {adminUser.name}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {adminUser.email}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {adminUser.role}
                          </Badge>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Render User Dashboard
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="relative overflow-hidden border border-primary/10 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="pointer-events-none absolute -right-32 top-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />
        <CardHeader className="relative space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="space-y-2">
              <Badge variant="outline" className={`border ${subscriptionTheme.accent}`}>
                <Crown className="h-3.5 w-3.5 mr-1.5" />
                {subscriptionTheme.label}
              </Badge>
              <CardTitle className="text-3xl font-semibold">
                Welcome back, {user?.name ?? "Traveler"}! 👋
              </CardTitle>
              <CardDescription className="text-base">
                Here&apos;s your travel activity overview and what&apos;s coming up next.
              </CardDescription>
            </div>
            <Button asChild size="lg" className="gap-2">
              <Link href="/dashboard/events/host">
                <Plus className="h-4 w-4" />
                Host Event
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardFooter className="relative flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Session secured
          </div>
          <div className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            {readableExpiry}
          </div>
          {user?.role && (
            <div className="inline-flex items-center gap-2">
              <User2 className="h-4 w-4 text-primary" />
              {user.role}
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:border-primary/50 transition-all cursor-pointer h-full group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl border ${stat.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Upcoming Travel Plans */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Trips
              </CardTitle>
              <CardDescription>Your next adventures are waiting</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/joined">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {upcomingPlans.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Plane className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">No upcoming trips</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Join or host a travel plan to see it here
                  </p>
                </div>
                <Button asChild variant="outline" className="mt-4">
                  <Link href="/travelplan">
                    <Globe className="h-4 w-4 mr-2" />
                    Explore Travel Plans
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingPlans.map((plan) => {
                  const daysUntil = getDaysUntil(plan.startDate)
                  const isHosted = plan.hostId === user?.id
                  return (
                    <div
                      key={plan.id}
                      className="rounded-xl border border-border/50 bg-muted/20 p-4 hover:bg-muted/30 transition-colors cursor-pointer group"
                      onClick={() => router.push(`/travelplan/${plan.id}`)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                              {plan.title}
                            </h3>
                            {isHosted && (
                              <Badge variant="outline" className="text-xs">
                                Hosting
                              </Badge>
                            )}
                            {getStatusBadge(plan.status)}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" />
                              <span>
                                {plan.destinationCity}, {plan.destinationCountry}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(plan.startDate)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users className="h-4 w-4" />
                              <span>
                                {plan.participantsCount}/{plan.maxParticipants}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          {daysUntil > 0 && (
                            <div className="text-xs font-medium text-primary">
                              {daysUntil} {daysUntil === 1 ? "day" : "days"} away
                            </div>
                          )}
                          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & Account Info */}
        <div className="space-y-6">
          {/* Account Status */}
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <User2 className="h-5 w-5 text-primary" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Email
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {user?.email ?? "—"}
                </div>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Approval Status
                </p>
                <div className="flex items-center gap-2">
                  {user?.isApproved ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Approved
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending Review
                    </Badge>
                  )}
                </div>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Subscription
                </p>
                <p className="text-sm font-medium text-foreground">
                  {subscriptionTheme.label}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {subscriptionTheme.description}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/profile/view">
                  <User2 className="h-4 w-4 mr-2" />
                  View Profile
                </Link>
              </Button>
              {subscriptionStatus === "NONE" && (
                <Button asChild className="w-full">
                  <Link href="/dashboard/subscription">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade Plan
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Quick Actions */}
          <Card className="border-primary/40 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>Get things done faster</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start" size="lg">
                <Link href="/dashboard/events/host">
                  <Plus className="h-4 w-4 mr-2" />
                  Host New Event
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start" size="lg">
                <Link href="/travelplan">
                  <Globe className="h-4 w-4 mr-2" />
                  Explore Travel Plans
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start" size="lg">
                <Link href="/dashboard/travel-history">
                  <Activity className="h-4 w-4 mr-2" />
                  View Travel History
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start" size="lg">
                <Link href="/dashboard/blogs">
                  <Eye className="h-4 w-4 mr-2" />
                  My Blog Posts
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      {(hostedPlans.length > 0 || joinedPlans.length > 0) && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Hosted Plans Preview */}
          {hostedPlans.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <CalendarCheck className="h-5 w-5 text-primary" />
                    Your Hosted Plans
                  </CardTitle>
                  <CardDescription>Manage your travel events</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/events/manage">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hostedPlans.slice(0, 3).map((plan) => (
                    <div
                      key={plan.id}
                      className="rounded-lg border border-border/50 bg-muted/10 p-3 hover:bg-muted/20 transition-colors cursor-pointer group"
                      onClick={() => router.push(`/dashboard/events/${plan.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                            {plan.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {plan.destinationCity}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {plan.participantsCount}/{plan.maxParticipants}
                            </span>
                          </div>
                        </div>
                        {getStatusBadge(plan.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Joined Plans Preview */}
          {joinedPlans.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Users className="h-5 w-5 text-primary" />
                    Active Joined Plans
                  </CardTitle>
                  <CardDescription>Plans you&apos;re participating in</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/joined">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {joinedPlans.slice(0, 3).map((plan) => (
                    <div
                      key={plan.id}
                      className="rounded-lg border border-border/50 bg-muted/10 p-3 hover:bg-muted/20 transition-colors cursor-pointer group"
                      onClick={() => router.push(`/travelplan/${plan.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                            {plan.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {plan.destinationCity}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(plan.startDate)}
                            </span>
                          </div>
                        </div>
                        {getStatusBadge(plan.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

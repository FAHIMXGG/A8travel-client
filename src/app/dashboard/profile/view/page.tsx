"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { 
  UserCircle, 
  Mail, 
  ShieldCheck, 
  Crown, 
  Clock, 
  CheckCircle2, 
  XCircle,
  MapPin,
  Briefcase,
  Globe,
  Images,
  Star
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import toast from "react-hot-toast"
import { isUnoptimizedCdn } from "@/lib/is-unoptimized-cdn"

const subscriptionConfig = {
  ACTIVE: {
    label: "Active",
    accent: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
    icon: CheckCircle2,
  },
  TRIAL: {
    label: "Trial",
    accent: "text-amber-500 bg-amber-500/10 border-amber-500/30",
    icon: Clock,
  },
  EXPIRED: {
    label: "Expired",
    accent: "text-rose-500 bg-rose-500/10 border-rose-500/30",
    icon: XCircle,
  },
  NONE: {
    label: "None",
    accent: "text-slate-500 bg-slate-500/10 border-slate-500/30",
    icon: XCircle,
  },
} as const

type ProfileData = {
  id: string
  name: string
  email: string
  role: string
  image: string | null
  bio: string | null
  travelInterests: string[]
  visitedCountries: string[]
  currentLocation: string | null
  gallery: string[]
  ratingAverage: number
  ratingCount: number
  subscriptionStatus: string
  subscriptionExpiresAt: string | null
  isBlocked: boolean
}

export default function ViewProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const user = session?.user

  useEffect(() => {
    const fetchProfile = async () => {
      if (status === "authenticated" && user?.id) {
        try {
          setIsLoading(true)
          const res = await fetch(`/api/users/${user.id}`)
          const data = await res.json()
          
          if (res.ok && data?.success && data?.data) {
            setProfileData(data.data)
          } else {
            toast.error(data?.message || "Failed to load profile")
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error)
          toast.error("Failed to load profile data")
        } finally {
          setIsLoading(false)
        }
      } else if (status === "unauthenticated") {
        router.push("/login")
      }
    }

    fetchProfile()
  }, [status, user?.id, router])

  if (status === "loading" || isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  if (!user || !profileData) {
    return null
  }

  const subscriptionStatus = (profileData.subscriptionStatus ?? "NONE") as keyof typeof subscriptionConfig
  const subscriptionTheme = subscriptionConfig[subscriptionStatus] ?? subscriptionConfig.NONE
  const SubscriptionIcon = subscriptionTheme.icon

  const readableExpiry = profileData.subscriptionExpiresAt
    ? new Date(profileData.subscriptionExpiresAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No expiry date"

  const initials = profileData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="relative overflow-hidden border border-primary/10 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="pointer-events-none absolute -right-32 top-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <CardHeader className="relative space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-primary/20">
                <AvatarImage src={profileData.image || undefined} alt={profileData.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-white text-2xl font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl sm:text-3xl font-semibold">{profileData.name}</CardTitle>
                <CardDescription className="text-base mt-1">Your complete profile information</CardDescription>
                {profileData.currentLocation && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {profileData.currentLocation}
                  </div>
                )}
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/profile">Edit Profile</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Account Status */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border/60 bg-background/70 p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4" />
                Account Role
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {profileData.role ?? "USER"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {profileData.role === "ADMIN" ? "Full access" : "Traveler account"}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-background/70 p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Crown className="h-4 w-4" />
                Subscription Status
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`border ${subscriptionTheme.accent}`}>
                  <SubscriptionIcon className="h-3 w-3 mr-1" />
                  {subscriptionTheme.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-primary" />
              Personal Information
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  Email Address
                </div>
                <p className="text-base font-medium text-foreground">{profileData.email ?? "Not provided"}</p>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Subscription Expires
                </div>
                <p className="text-base font-medium text-foreground">{readableExpiry}</p>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  User ID
                </div>
                <p className="text-sm font-mono text-foreground break-all">{profileData.id}</p>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                  <Star className="h-3.5 w-3.5" />
                  Rating
                </div>
                <p className="text-base font-medium text-foreground">
                  {profileData.ratingAverage > 0 ? (
                    <span className="flex items-center gap-2">
                      <span>{profileData.ratingAverage.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">({profileData.ratingCount} reviews)</span>
                    </span>
                  ) : (
                    "No ratings yet"
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio Section */}
      {profileData.bio && (
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              About Me
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {profileData.bio}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Travel Interests */}
      {profileData.travelInterests && profileData.travelInterests.length > 0 && (
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Travel Interests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profileData.travelInterests.map((interest, index) => (
                <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visited Countries */}
      {profileData.visitedCountries && profileData.visitedCountries.length > 0 && (
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Visited Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profileData.visitedCountries.map((country, index) => (
                <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                  {country}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Photo Gallery */}
      {profileData.gallery && profileData.gallery.length > 0 && (
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Images className="h-5 w-5 text-primary" />
              Photo Gallery
            </CardTitle>
            <CardDescription>
              {profileData.gallery.length} {profileData.gallery.length === 1 ? "photo" : "photos"} in your gallery
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {profileData.gallery.map((imageUrl, index) => (
                <div
                  key={index}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-border/60 bg-muted/20 hover:border-primary/50 transition-colors"
                >
                  <Image
                    src={imageUrl}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    unoptimized={isUnoptimizedCdn(imageUrl)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

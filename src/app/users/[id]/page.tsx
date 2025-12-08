"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  UserCircle,
  Mail,
  MapPin,
  Images,
  Star,
  ArrowLeft,
  Heart,
  Plane,
  Crown,
  Phone,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type UserProfile = {
  id: string
  name: string
  email: string
  role: string
  image: string | null
  bio: string | null
  phone: string | null
  travelInterests: string[]
  visitedCountries: string[]
  currentLocation: string | null
  gallery: string[]
  ratingAverage: number
  ratingCount: number
  subscriptionStatus: string
  subscriptionExpiresAt: string | null
  isBlocked: boolean
  createdAt: string
}

const subscriptionConfig = {
  ACTIVE: {
    label: "Active",
    accent: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
    icon: "✓",
  },
  TRIAL: {
    label: "Trial",
    accent: "text-amber-500 bg-amber-500/10 border-amber-500/30",
    icon: "⏱",
  },
  EXPIRED: {
    label: "Expired",
    accent: "text-rose-500 bg-rose-500/10 border-rose-500/30",
    icon: "✗",
  },
  NONE: {
    label: "None",
    accent: "text-slate-500 bg-slate-500/10 border-slate-500/30",
    icon: "—",
  },
} as const

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userId = params?.id as string

  useEffect(() => {
    if (userId) {
      loadProfile()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/users/${userId}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data?.message || "Failed to load user profile")
        return
      }

      const profileData = data?.data || data
      setProfile(profileData)
    } catch (err: any) {
      setError(err.message || "Failed to load user profile")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">User Not Found</h2>
          <p className="text-muted-foreground">{error || "The user profile you're looking for doesn't exist."}</p>
        </div>
        <Button onClick={() => router.push("/travelplan")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Travel Plans
        </Button>
      </div>
    )
  }

  const subscriptionStatus = (profile.subscriptionStatus ?? "NONE") as keyof typeof subscriptionConfig
  const subscriptionTheme = subscriptionConfig[subscriptionStatus] ?? subscriptionConfig.NONE
  const isSubscriptionActive = profile.subscriptionStatus === "ACTIVE"

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button onClick={() => router.back()} variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Profile Header Card */}
      <Card className="relative overflow-hidden border border-border/50 bg-card/30 backdrop-blur-md">
        <CardHeader className="relative space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-lg">
              <AvatarImage src={profile.image || undefined} alt={profile.name} />
              <AvatarFallback className="text-2xl sm:text-3xl bg-gradient-to-br from-primary/20 to-amber-500/20">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1
                  className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
                    isSubscriptionActive
                      ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent"
                      : ""
                  }`}
                >
                  {profile.name}
                </h1>
                {isSubscriptionActive && (
                  <Badge className={`${subscriptionTheme.accent} border font-semibold`}>
                    <Crown className="h-3 w-3 mr-1" />
                    {subscriptionTheme.label}
                  </Badge>
                )}
                {profile.role === "ADMIN" && (
                  <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
                    ADMIN
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                {profile.currentLocation && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.currentLocation}</span>
                  </div>
                )}
                {profile.ratingAverage > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span>
                      {profile.ratingAverage.toFixed(1)} ({profile.ratingCount} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Bio */}
          {profile.bio && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-primary" />
                About
              </h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Email */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Email
              </h3>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>

            {/* Phone */}
            {profile.phone && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Phone
                </h3>
                <p className="text-sm text-muted-foreground">{profile.phone}</p>
              </div>
            )}

            {/* Travel Interests */}
            {profile.travelInterests && profile.travelInterests.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Travel Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.travelInterests.map((interest, idx) => (
                    <Badge key={idx} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Visited Countries */}
            {profile.visitedCountries && profile.visitedCountries.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Plane className="h-5 w-5 text-primary" />
                  Visited Countries
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.visitedCountries.map((country, idx) => (
                    <Badge key={idx} variant="outline">
                      {country}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Gallery */}
          {profile.gallery && profile.gallery.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Images className="h-5 w-5 text-primary" />
                Gallery ({profile.gallery.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {profile.gallery.map((image, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg overflow-hidden border border-border/50 group cursor-pointer"
                  >
                    <Image
                      src={image}
                      alt={`${profile.name} - Gallery ${idx + 1}`}
                      fill
                      sizes="(min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="pt-4 border-t border-border/50 space-y-2 text-xs text-muted-foreground">
            <div>Member since: {new Date(profile.createdAt).toLocaleDateString()}</div>
            {profile.isBlocked && (
              <Badge variant="destructive" className="text-xs">
                Account Blocked
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


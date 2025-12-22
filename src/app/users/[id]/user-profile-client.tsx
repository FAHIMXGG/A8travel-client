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
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { isUnoptimizedCdn } from "@/lib/is-unoptimized-cdn"

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

export default function UserProfileClient() {
  const params = useParams()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  const userId = params?.id as string

  useEffect(() => {
    if (userId) {
      loadProfile()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  useEffect(() => {
    if (profile?.gallery && profile.gallery.length > 0) {
      setCurrentImageIndex(0)
    }
  }, [profile?.gallery])

  const handlePreviousImage = () => {
    if (!profile?.gallery || profile.gallery.length === 0) return
    const gallery = profile.gallery
    setCurrentImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    if (!profile?.gallery || profile.gallery.length === 0) return
    const gallery = profile.gallery
    setCurrentImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))
  }

  const handleOpenGallery = (index: number) => {
    setCurrentImageIndex(index)
    setIsGalleryOpen(true)
  }

  useEffect(() => {
    if (!isGalleryOpen) return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        handlePreviousImage()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        handleNextImage()
      } else if (e.key === "Escape") {
        setIsGalleryOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGalleryOpen, profile?.gallery])

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
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Images className="h-5 w-5 text-primary" />
                Gallery ({profile.gallery.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {profile.gallery.map((image, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleOpenGallery(idx)}
                    className="relative aspect-square rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 transition-all hover:scale-[1.02] cursor-pointer group"
                  >
                    <Image
                      src={image}
                      alt={`${profile.name} - Gallery ${idx + 1}`}
                      fill
                      sizes="(min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      unoptimized={isUnoptimizedCdn(image)}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Modal */}
          <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
            {isGalleryOpen && (
              <div 
                className="fixed inset-0 z-[49] backdrop-blur-xl bg-black/70"
                onClick={() => setIsGalleryOpen(false)}
                aria-hidden="true"
              />
            )}
            <DialogContent className="!max-w-[80vw] w-[80vw] h-[80vh] max-h-[80vh] p-0 gap-0 bg-background border shadow-2xl z-[52]">
              <VisuallyHidden>
                <DialogTitle>Image Gallery - {profile.name}</DialogTitle>
              </VisuallyHidden>
              <div className="relative w-full h-full flex items-center justify-center p-4">
                {/* Main Image Container - fixed size for all images */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {profile.gallery && profile.gallery[currentImageIndex] && (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image
                        src={profile.gallery[currentImageIndex]}
                        alt={`${profile.name} - Gallery ${currentImageIndex + 1}`}
                        fill
                        sizes="(max-width: 80vw) 80vw, 80vw"
                        className="object-contain"
                        priority={currentImageIndex === 0}
                        unoptimized={isUnoptimizedCdn(profile.gallery[currentImageIndex])}
                      />
                    </div>
                  )}
                </div>

                {/* Navigation Buttons - fixed to container edges */}
                {profile.gallery && profile.gallery.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePreviousImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm hover:bg-background shadow-lg h-12 w-12"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm hover:bg-background shadow-lg h-12 w-12"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}

                {/* Image Counter */}
                {profile.gallery && profile.gallery.length > 1 && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    {currentImageIndex + 1} / {profile.gallery.length}
                  </div>
                )}

                {/* Image Indicators */}
                {profile.gallery && profile.gallery.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                    {profile.gallery.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                          idx === currentImageIndex
                            ? "w-8 bg-primary"
                            : "w-2 bg-muted-foreground/60 hover:bg-muted-foreground/80"
                        }`}
                        aria-label={`Go to image ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Thumbnail Navigation */}
                {profile.gallery && profile.gallery.length > 1 && (
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-2 overflow-x-auto pb-2 scrollbar-hide max-w-[90%] bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                    {profile.gallery.map((image, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                          idx === currentImageIndex
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border/50 hover:border-primary/50"
                        }`}
                        aria-label={`View image ${idx + 1}`}
                      >
                        <Image
                          src={image}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          sizes="64px"
                          className="object-cover"
                          loading="lazy"
                          unoptimized={isUnoptimizedCdn(image)}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

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


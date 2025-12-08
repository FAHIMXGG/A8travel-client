"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Globe,
  Tag,
  Link as LinkIcon,
  Phone,
  FileText,
  ArrowLeft,
  Edit,
  CalendarCheck,
  ImageIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

type TravelPlan = {
  id: string
  _id?: string
  hostId?: string
  title: string
  destinationCountry: string
  destinationCity: string
  startDate: string
  endDate: string
  budgetMin: number
  budgetMax: number
  travelType: string
  description: string
  groupChatLink?: string
  contact: string
  images?: string[]
  tags?: string[]
  status: "OPEN" | "CLOSED" | "CANCELED" | "FULL"
  maxParticipants: number
  participantsCount: number
  isPublic: boolean
  createdAt?: string
  updatedAt?: string
}

function formatDate(iso?: string) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.valueOf())) return "—"
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function formatDateShort(iso?: string) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.valueOf())) return "—"
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const TRAVEL_TYPES: Record<string, string> = {
  FRIENDS: "Friends",
  FAMILY: "Family",
  SOLO: "Solo",
  COUPLES: "Couples",
  BUSINESS: "Business",
}

const STATUS_COLORS: Record<string, string> = {
  OPEN: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  CLOSED: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
  CANCELED: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  FULL: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
}

export default function ViewTravelPlanPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [plan, setPlan] = useState<TravelPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const planId = params?.id as string

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    if (status === "authenticated" && planId) {
      loadPlan()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, planId])

  const loadPlan = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/travel-plans/${planId}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data?.message || "Failed to load travel plan")
        return
      }

      // Handle nested response structure
      const planData = data?.data || data
      setPlan(planData)
    } catch (err: any) {
      setError(err.message || "Failed to load travel plan")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    )
  }

  if (error || !plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Travel Plan Not Found</h2>
          <p className="text-muted-foreground">{error || "The travel plan you're looking for doesn't exist."}</p>
        </div>
        <Button onClick={() => router.push("/dashboard/events/manage")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Manage Travel
        </Button>
      </div>
    )
  }

  const isHost = session?.user?.id === plan.hostId

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button onClick={() => router.back()} variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {isHost && (
          <Button onClick={() => router.push(`/dashboard/events/${planId}/edit`)} variant="default" size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Plan
          </Button>
        )}
      </div>

      {/* Main Content */}
      <Card className="relative overflow-hidden border border-primary/10 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="pointer-events-none absolute -right-32 top-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <CardHeader className="relative space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <CalendarCheck className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <CardTitle className="text-2xl font-semibold">{plan.title}</CardTitle>
                <Badge className={STATUS_COLORS[plan.status] || ""}>{plan.status}</Badge>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {plan.destinationCity}, {plan.destinationCountry}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-6">
          {/* Images */}
          {plan.images && plan.images.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Images
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {plan.images.map((image, idx) => (
                  <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-border/50">
                    <Image
                      src={image}
                      alt={`${plan.title} - Image ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Description
            </h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{plan.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Travel Dates */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Travel Dates
              </h3>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="text-muted-foreground">Start: </span>
                  <span className="font-medium">{formatDate(plan.startDate)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">End: </span>
                  <span className="font-medium">{formatDate(plan.endDate)}</span>
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Budget (per person)
              </h3>
              <div className="text-sm">
                <span className="font-medium">
                  ${plan.budgetMin} - ${plan.budgetMax}
                </span>
              </div>
            </div>

            {/* Travel Type & Participants */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Travel Details
              </h3>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="text-muted-foreground">Type: </span>
                  <span className="font-medium">{TRAVEL_TYPES[plan.travelType] || plan.travelType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Participants: </span>
                  <span className="font-medium">
                    {plan.participantsCount} / {plan.maxParticipants}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Contact
              </h3>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="text-muted-foreground">Phone: </span>
                  <span className="font-medium">{plan.contact}</span>
                </div>
                {plan.groupChatLink && (
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={plan.groupChatLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      Group Chat Link
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          {plan.tags && plan.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {plan.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="pt-4 border-t border-border/50 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>{plan.isPublic ? "Public" : "Private"} event</span>
            </div>
            {plan.createdAt && (
              <div>
                Created: {formatDateShort(plan.createdAt)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
  Loader2,
  ArrowLeft,
  ImageIcon,
  User,
  Star,
  CheckCircle2,
  Trash2,
  Edit2,
  Send,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import toast from "react-hot-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type TravelPlan = {
  id: string
  _id?: string
  hostId?: string
  title: string
  destinationCountry: string
  destinationCity: string
  startDate: string
  endDate: string
  budgetMin: number | null
  budgetMax: number | null
  travelType: string
  description: string
  groupChatLink?: string | null
  contact?: string | null
  images?: string[]
  tags?: string[]
  status: "OPEN" | "CLOSED" | "CANCELED" | "FULL" | "ENDED"
  maxParticipants: number | null
  participantsCount: number
  isPublic: boolean
  createdAt?: string
  updatedAt?: string
  hostName?: string
  hostImage?: string | null
  hostRatingAverage?: number
  hostRatingCount?: number
  participants?: Array<{ id: string; name: string }>
  reviews?: Array<{
    id: string
    reviewerId: string
    name: string
    rating: number
    comment: string
    createdAt: string
  }>
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
  ENDED: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
}

function StarRating({
  rating,
  onRatingChange,
  readonly = false,
}: {
  rating: number
  onRatingChange?: (rating: number) => void
  readonly?: boolean
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange?.(star)}
          disabled={readonly}
          className={readonly ? "cursor-default" : "cursor-pointer"}
        >
          <Star
            className={`h-5 w-5 ${
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-300 dark:fill-gray-700 dark:text-gray-600"
            }`}
          />
        </button>
      ))}
    </div>
  )
}

export default function TravelPlanDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [plan, setPlan] = useState<TravelPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [joining, setJoining] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")
  const [submittingReview, setSubmittingReview] = useState(false)
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null)
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)

  const planId = params?.id as string
  const userId = session?.user?.id

  const isJoined = plan?.participants?.some((p) => p.id === userId) || false
  const isHost = userId === plan?.hostId
  const hasEnded = plan?.status === "ENDED" || (plan?.endDate && new Date(plan.endDate) < new Date())
  const canReview = isJoined && hasEnded
  const userReview = plan?.reviews?.find((r) => r.reviewerId === userId)

  useEffect(() => {
    if (planId) {
      loadPlan()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId])

  const loadPlan = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/travel-plans/${planId}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data?.message || "Failed to load travel plan")
        return
      }

      const planData = data?.data || data
      setPlan(planData)
    } catch (err: any) {
      setError(err.message || "Failed to load travel plan")
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/travelplan/${planId}`)
      return
    }

    if (!userId) return

    setJoining(true)
    try {
      const res = await fetch(`/api/travel-plans/${planId}/join`, {
        method: "POST",
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || "Failed to join travel plan")
      }

      toast.success("Successfully joined the travel plan!")
      loadPlan()
    } catch (err: any) {
      toast.error(err.message || "Failed to join travel plan")
    } finally {
      setJoining(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) {
      toast.error("Please enter a comment")
      return
    }

    setSubmittingReview(true)
    try {
      const res = await fetch(`/api/travel-plans/${planId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || "Failed to submit review")
      }

      toast.success(editingReviewId ? "Review updated successfully!" : "Review submitted successfully!")
      setEditingReviewId(null)
      setReviewComment("")
      setReviewRating(5)
      setShowReviewDialog(false)
      loadPlan()
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review")
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleEditReview = (review: NonNullable<TravelPlan["reviews"]>[number]) => {
    if (!review) return
    setEditingReviewId(review.id)
    setReviewRating(review.rating)
    setReviewComment(review.comment)
    setShowReviewDialog(true)
  }

  useEffect(() => {
    if (editingReviewId && userReview && editingReviewId === userReview.id) {
      setReviewRating(userReview.rating)
      setReviewComment(userReview.comment)
    } else if (!editingReviewId && !showReviewDialog) {
      setReviewRating(5)
      setReviewComment("")
    }
  }, [editingReviewId, userReview, showReviewDialog])

  const handleDeleteReview = async () => {
    if (!reviewToDelete) return

    setDeletingReviewId(reviewToDelete)
    try {
      const res = await fetch(`/api/travel-plans/${planId}/reviews/${reviewToDelete}`, {
        method: "DELETE",
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || "Failed to delete review")
      }

      toast.success("Review deleted successfully!")
      setShowDeleteDialog(false)
      setReviewToDelete(null)
      loadPlan()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete review")
    } finally {
      setDeletingReviewId(null)
    }
  }

  if (loading) {
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
        <Button onClick={() => router.push("/travelplan")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Travel Plans
        </Button>
      </div>
    )
  }

  const budgetRange =
    plan.budgetMin && plan.budgetMax
      ? `$${plan.budgetMin} - $${plan.budgetMax}`
      : plan.budgetMin
        ? `From $${plan.budgetMin}`
        : plan.budgetMax
          ? `Up to $${plan.budgetMax}`
          : "Budget not specified"

  return (
    <div className="space-y-6">
      {/* Header with Join Button */}
      <div className="flex items-center justify-between">
        <Button onClick={() => router.push("/travelplan")} variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {!isHost && (
          <div>
            {isJoined ? (
              <Button disabled variant="outline" className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Joined
              </Button>
            ) : (
              <Button
                onClick={handleJoin}
                disabled={joining || plan.status !== "OPEN" || (plan.maxParticipants !== null && plan.participantsCount >= plan.maxParticipants)}
                className="gap-2"
              >
                {joining ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4" />
                    Join Plan
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <Card className="relative overflow-hidden border border-border/50 bg-card/30 backdrop-blur-md">
        <CardHeader className="relative space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <CardTitle className="text-2xl sm:text-3xl font-semibold">{plan.title}</CardTitle>
                <Badge className={`text-xs border ${STATUS_COLORS[plan.status] || STATUS_COLORS.CLOSED}`}>
                  {plan.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                      sizes="(min-width: 768px) 33vw, 50vw"
                      className="object-cover"
                      loading="lazy"
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
                <span className="font-medium">{budgetRange}</span>
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
                    {plan.participantsCount}
                    {plan.maxParticipants ? ` / ${plan.maxParticipants}` : ""}
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
                {plan.contact && (
                  <div>
                    <span className="text-muted-foreground">Phone: </span>
                    <span className="font-medium">{plan.contact}</span>
                  </div>
                )}
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

          {/* Host Info */}
          {plan.hostName && plan.hostId && (
            <div className="space-y-2 pt-4 border-t border-border/30">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Host
              </h3>
              <Link href={`/users/${plan.hostId}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                {plan.hostImage ? (
                  <Image
                    src={plan.hostImage}
                    alt={plan.hostName}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                )}
                <div>
                  <div className="font-medium hover:text-primary transition-colors">{plan.hostName}</div>
                  {plan.hostRatingAverage !== undefined && plan.hostRatingAverage > 0 && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{plan.hostRatingAverage.toFixed(1)}</span>
                      {plan.hostRatingCount && (
                        <span className="ml-1">({plan.hostRatingCount} reviews)</span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            </div>
          )}

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

          {/* Participants */}
          {plan.participants && plan.participants.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-border/30">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Participants ({plan.participants.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {plan.participants.map((participant) => (
                  <Link key={participant.id} href={`/users/${participant.id}`}>
                    <Badge variant="outline" className="hover:bg-primary/10 hover:border-primary/30 cursor-pointer transition-colors">
                      {participant.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="space-y-4 pt-4 border-t border-border/30">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Reviews ({plan.reviews?.length || 0})
              </h3>
              {canReview && (
                <Dialog
                  open={showReviewDialog}
                  onOpenChange={(open) => {
                    setShowReviewDialog(open)
                    if (!open) {
                      setEditingReviewId(null)
                      setReviewComment("")
                      setReviewRating(5)
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      {userReview ? (
                        <>
                          <Edit2 className="h-4 w-4" />
                          Edit My Review
                        </>
                      ) : (
                        <>
                          <Star className="h-4 w-4" />
                          Write Review
                        </>
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingReviewId ? "Edit Review" : "Write a Review"}</DialogTitle>
                      <DialogDescription>
                        Share your experience with this travel plan
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Rating</label>
                        <StarRating rating={reviewRating} onRatingChange={setReviewRating} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Comment</label>
                        <Textarea
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share your experience..."
                          rows={4}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingReviewId(null)
                            setReviewComment("")
                            setReviewRating(5)
                            setShowReviewDialog(false)
                          }}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSubmitReview} disabled={submittingReview}>
                          {submittingReview ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              {editingReviewId ? "Update Review" : "Submit Review"}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {plan.reviews && plan.reviews.length > 0 ? (
              <div className="space-y-4">
                {plan.reviews.map((review) => {
                  const isOwnReview = review.reviewerId === userId
                  return (
                    <Card key={review.id} className="border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/users/${review.reviewerId}`}
                                className="font-medium hover:text-primary transition-colors"
                              >
                                {review.name}
                              </Link>
                              {isOwnReview && (
                                <Badge variant="secondary" className="text-xs">
                                  Your review
                                </Badge>
                              )}
                            </div>
                            <StarRating rating={review.rating} readonly />
                            <p className="text-sm text-muted-foreground">{review.comment}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDateShort(review.createdAt)}
                            </p>
                          </div>
                          {isOwnReview && (
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditReview(review)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setReviewToDelete(review.id)
                                  setShowDeleteDialog(true)
                                }}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No reviews yet.</p>
            )}
          </div>

          {/* Additional Info */}
          <div className="pt-4 border-t border-border/50 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>{plan.isPublic ? "Public" : "Private"} event</span>
            </div>
            {plan.createdAt && <div>Created: {formatDateShort(plan.createdAt)}</div>}
          </div>
        </CardContent>
      </Card>

      {/* Delete Review Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReview}
              disabled={deletingReviewId !== null}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingReviewId ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


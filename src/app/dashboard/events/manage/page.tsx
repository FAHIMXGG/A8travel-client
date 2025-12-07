"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Users,
  Calendar,
  AlertCircle,
} from "lucide-react"
import toast from "react-hot-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  title: string
  destinationCountry: string
  destinationCity: string
  startDate: string
  endDate: string
  budgetMin: number
  budgetMax: number
  travelType: string
  description: string
  status: "OPEN" | "CLOSED" | "CANCELED" | "FULL"
  maxParticipants: number
  participantsCount: number
  isPublic: boolean
  createdAt?: string
  updatedAt?: string
}

type Meta = {
  page: number
  limit: number
  total: number
  pages: number
  totalPages?: number
}

type TravelPlansResponse = {
  success: boolean
  message: string
  data: TravelPlan[]
  meta?: Meta
}

async function fetchTravelPlans(params: {
  page?: number
  limit?: number
}): Promise<TravelPlansResponse> {
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.set("page", params.page.toString())
  if (params.limit) queryParams.set("limit", params.limit.toString())

  const res = await fetch(`/api/travel-plans/my?${queryParams.toString()}`)
  const data = await res.json()

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "Failed to fetch travel plans",
      data: [],
      meta: { page: 1, limit: 10, total: 0, pages: 0 },
    }
  }

  // Handle nested response structure
  const nestedData = data?.data
  const plansArray = Array.isArray(nestedData?.data) ? nestedData.data : []
  const metaData = nestedData?.meta || {}

  return {
    success: data?.success ?? true,
    message: data?.message || "",
    data: plansArray,
    meta: {
      page: metaData.page ?? params.page ?? 1,
      limit: metaData.limit ?? params.limit ?? 10,
      total: metaData.total ?? 0,
      pages: metaData.totalPages ?? metaData.pages ?? 0,
    },
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

function Pagination({
  page,
  pages,
  total,
  onPageChange,
}: {
  page: number
  pages: number
  total: number
  onPageChange: (p: number) => void
}) {
  if (pages <= 1) return null

  const windowSize = 5
  let start = Math.max(1, page - Math.floor(windowSize / 2))
  const end = Math.min(pages, start + windowSize - 1)
  if (end - start + 1 < windowSize) start = Math.max(1, end - windowSize + 1)

  const nums = []
  for (let i = start; i <= end; i++) nums.push(i)

  return (
    <div className="mt-6 space-y-3">
      <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
        Showing{" "}
        <span className="font-medium text-foreground">
          {total.toLocaleString()}
        </span>{" "}
        travel plans • Page{" "}
        <span className="font-medium text-foreground">{page}</span> of{" "}
        <span className="font-medium text-foreground">{pages}</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => onPageChange(1)}
          className="h-8 w-8 sm:w-auto sm:px-3 bg-transparent"
        >
          <ChevronsLeft className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:ml-1">First</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="h-8 w-8 sm:w-auto sm:px-3 bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:ml-1">Prev</span>
        </Button>

        <div className="flex items-center gap-1">
          {start > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="h-8 w-8 flex items-center justify-center rounded-md text-xs sm:text-sm hover:bg-accent transition-colors"
              >
                1
              </button>
              {start > 2 && (
                <span className="px-1 text-muted-foreground">…</span>
              )}
            </>
          )}

          {nums.map((n) => (
            <button
              key={n}
              onClick={() => onPageChange(n)}
              className={[
                "h-8 w-8 flex items-center justify-center rounded-md text-xs sm:text-sm transition-colors",
                n === page
                  ? "bg-primary text-primary-foreground font-medium"
                  : "hover:bg-accent",
              ].join(" ")}
            >
              {n}
            </button>
          ))}

          {end < pages && (
            <>
              {end < pages - 1 && (
                <span className="px-1 text-muted-foreground">…</span>
              )}
              <button
                onClick={() => onPageChange(pages)}
                className="h-8 w-8 flex items-center justify-center rounded-md text-xs sm:text-sm hover:bg-accent transition-colors"
              >
                {pages}
              </button>
            </>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={page === pages}
          onClick={() => onPageChange(page + 1)}
          className="h-8 w-8 sm:w-auto sm:px-3 bg-transparent"
        >
          <span className="sr-only sm:not-sr-only sm:mr-1">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page === pages}
          onClick={() => onPageChange(pages)}
          className="h-8 w-8 sm:w-auto sm:px-3 bg-transparent"
        >
          <span className="sr-only sm:not-sr-only sm:mr-1">Last</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function ManageTravelPlansPageContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [plans, setPlans] = useState<TravelPlan[]>([])
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10, total: 0, pages: 0 })
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [planToDelete, setPlanToDelete] = useState<TravelPlan | null>(null)

  const page = Number(searchParams.get("page")) || 1
  const limit = 10

  const loadPlans = useCallback(async () => {
    setLoading(true)
    try {
      const result = await fetchTravelPlans({ page, limit })
      setPlans(result.data)
      setMeta(result.meta || { page, limit, total: 0, pages: 0 })
    } catch (error: any) {
      toast.error(error.message || "Failed to load travel plans")
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    if (status === "authenticated" && session?.user?.role !== "USER") {
      router.push("/dashboard")
      return
    }
    if (status === "authenticated") {
      loadPlans()
    }
  }, [status, session, router, loadPlans])

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`/dashboard/events/manage?${params.toString()}`)
  }

  const handleStatusChange = async (planId: string, newStatus: string) => {
    setUpdatingStatus(planId)
    try {
      const res = await fetch(`/api/travel-plans/${planId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.message || "Failed to update status")
      }

      toast.success("Status updated successfully")
      loadPlans()
    } catch (error: any) {
      toast.error(error.message || "Failed to update status")
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleDeleteClick = (plan: TravelPlan) => {
    setPlanToDelete(plan)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return

    const planId = planToDelete.id || planToDelete._id
    if (!planId) return

    setDeletingPlanId(planId)
    try {
      const res = await fetch(`/api/travel-plans/${planId}`, {
        method: "DELETE",
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.message || "Failed to delete travel plan")
      }

      toast.success("Travel plan deleted successfully")
      setShowDeleteDialog(false)
      setPlanToDelete(null)
      loadPlans()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete travel plan")
    } finally {
      setDeletingPlanId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
      case "CLOSED":
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20"
      case "CANCELED":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
      case "FULL":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (status === "unauthenticated" || session?.user?.role !== "USER") {
    return null
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background via-background to-muted/20" />

      <div className="fixed top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />
      <div
        className="fixed bottom-20 left-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10 animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="space-y-4 sm:space-y-6 p-3 sm:p-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-primary/20 to-amber-500/20 backdrop-blur-sm flex items-center justify-center border border-primary/10">
              <CalendarCheck className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Manage Travel Plans
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                View and manage your hosted travel events
              </p>
            </div>
          </div>
        </div>

        {/* Travel Plans Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 sm:p-12 text-center">
            <CalendarCheck className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-muted-foreground">
              No travel plans found. Create your first travel plan to get started!
            </p>
            <Button
              onClick={() => router.push("/dashboard/events/host")}
              className="mt-4 gap-2"
            >
              <CalendarCheck className="h-4 w-4" />
              Host an Event
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-hidden rounded-xl border border-border/50 bg-card/30 backdrop-blur-md">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 backdrop-blur-sm border-b border-border/50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Travel Plan</th>
                    <th className="text-left p-4 font-semibold">Destination</th>
                    <th className="text-left p-4 font-semibold">Dates</th>
                    <th className="text-left p-4 font-semibold">Participants</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-right p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => {
                    const planId = plan.id || plan._id || ""
                    const isUpdating = updatingStatus === planId
                    return (
                      <tr
                        key={planId}
                        className="border-t border-border/30 hover:bg-muted/20 transition-colors"
                      >
                        <td className="p-4">
                          <div className="font-medium">{plan.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {plan.travelType}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-xs">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {plan.destinationCity}, {plan.destinationCountry}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-xs">
                            <Users className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium">
                              {plan.participantsCount} / {plan.maxParticipants}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Select
                            value={plan.status}
                            onValueChange={(value) => handleStatusChange(planId, value)}
                            disabled={isUpdating}
                          >
                            <SelectTrigger className={`h-8 w-32 text-xs border ${getStatusColor(plan.status)}`}>
                              {isUpdating ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <SelectValue />
                              )}
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="OPEN">OPEN</SelectItem>
                              <SelectItem value="CLOSED">CLOSED</SelectItem>
                              <SelectItem value="CANCELED">CANCELED</SelectItem>
                              <SelectItem value="FULL">FULL</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/dashboard/events/${planId}`)}
                              className="h-8 gap-1.5"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/dashboard/events/${planId}/edit`)}
                              className="h-8 gap-1.5"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(plan)}
                              disabled={deletingPlanId === planId}
                              className="h-8 gap-1.5 text-destructive hover:text-destructive"
                            >
                              {deletingPlanId === planId ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3 sm:space-y-4">
              {plans.map((plan) => {
                const planId = plan.id || plan._id || ""
                const isUpdating = updatingStatus === planId
                return (
                  <div
                    key={planId}
                    className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-md p-4 sm:p-5 space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-base sm:text-lg">{plan.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{plan.travelType}</p>
                        </div>
                        <Select
                          value={plan.status}
                          onValueChange={(value) => handleStatusChange(planId, value)}
                          disabled={isUpdating}
                        >
                          <SelectTrigger className={`h-8 w-28 text-xs border ${getStatusColor(plan.status)}`}>
                            {isUpdating ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <SelectValue />
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="OPEN">OPEN</SelectItem>
                            <SelectItem value="CLOSED">CLOSED</SelectItem>
                            <SelectItem value="CANCELED">CANCELED</SelectItem>
                            <SelectItem value="FULL">FULL</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5 text-xs sm:text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {plan.destinationCity}, {plan.destinationCountry}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          {plan.participantsCount} / {plan.maxParticipants} participants
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-border/30">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push(`/dashboard/events/${planId}`)}
                        className="flex-1 gap-1.5 h-8 sm:h-9"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/events/${planId}/edit`)}
                        className="flex-1 gap-1.5 h-8 sm:h-9 bg-transparent"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(plan)}
                        disabled={deletingPlanId === planId}
                        className="flex-1 gap-1.5 h-8 sm:h-9 bg-transparent text-destructive hover:text-destructive"
                      >
                        {deletingPlanId === planId ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            <Pagination
              page={meta.page}
              pages={meta.pages}
              total={meta.total}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Delete Travel Plan
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{planToDelete?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deletingPlanId !== null}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingPlanId ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </span>
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

export default function ManageTravelPlansPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    }>
      <ManageTravelPlansPageContent />
    </Suspense>
  )
}


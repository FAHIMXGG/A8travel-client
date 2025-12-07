"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Calendar,
  MapPin,
  Users,
  Search,
  Filter,
  X,
  Loader2,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Globe,
  User,
  DollarSign,
  Tag,
  Phone,
  Link as LinkIcon,
  FileText,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

type TravelPlan = {
  id: string
  _id?: string
  hostId: string
  title: string
  destinationCountry: string
  destinationCity: string
  startDate: string
  endDate: string
  budgetMin?: number | null
  budgetMax?: number | null
  travelType: string
  description: string
  groupChatLink?: string | null
  contact?: string | null
  images: string[]
  tags: string[]
  isPublic: boolean
  status: "OPEN" | "CLOSED" | "CANCELED" | "FULL" | "ENDED"
  maxParticipants?: number | null
  participantsCount: number
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

type Participant = {
  id: string
  name: string
  email?: string
  phone?: string
}

type Meta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

type TravelPlansResponse = {
  success: boolean
  message: string
  data: {
    meta: Meta
    data: TravelPlan[]
  }
}

const STATUS_COLORS: Record<string, string> = {
  OPEN: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  CLOSED: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
  CANCELED: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  FULL: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  ENDED: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
}

const TRAVEL_TYPES: Record<string, string> = {
  FRIENDS: "Friends",
  FAMILY: "Family",
  SOLO: "Solo",
  BUSINESS: "Business",
}

async function fetchTravelPlans(params: {
  page?: number
  limit?: number
  hostId?: string
  destination?: string
  status?: string
}): Promise<TravelPlansResponse> {
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.set("page", params.page.toString())
  if (params.limit) queryParams.set("limit", params.limit.toString())
  if (params.hostId) queryParams.set("hostId", params.hostId)
  if (params.destination) queryParams.set("destination", params.destination)
  if (params.status) queryParams.set("status", params.status)

  const res = await fetch(`/api/travel-plans/admin?${queryParams.toString()}`)
  const data = await res.json()

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "Failed to fetch travel plans",
      data: {
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
        data: [],
      },
    }
  }

  return data
}

function formatDate(iso?: string) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.valueOf())) return "—"
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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
        <span className="font-medium text-foreground">{total.toLocaleString()}</span> travel plans • Page{" "}
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
              {start > 2 && <span className="px-1 text-muted-foreground">…</span>}
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
              {end < pages - 1 && <span className="px-1 text-muted-foreground">…</span>}
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

function AdminTravelPlansPageContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [plans, setPlans] = useState<TravelPlan[]>([])
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [hostIdFilter, setHostIdFilter] = useState(searchParams.get("hostId") || "")
  const [destinationFilter, setDestinationFilter] = useState(searchParams.get("destination") || "")
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all")
  const [editingPlan, setEditingPlan] = useState<TravelPlan | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showParticipantsDialog, setShowParticipantsDialog] = useState(false)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loadingParticipants, setLoadingParticipants] = useState(false)
  const [currentPlanForParticipants, setCurrentPlanForParticipants] = useState<TravelPlan | null>(null)
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [planToDelete, setPlanToDelete] = useState<string | null>(null)
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null)
  const [updatingPlanId, setUpdatingPlanId] = useState<string | null>(null)

  const page = Number(searchParams.get("page")) || 1
  const limit = 10

  const loadPlans = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = { page, limit }
      if (hostIdFilter) params.hostId = hostIdFilter
      if (destinationFilter) params.destination = destinationFilter
      if (statusFilter !== "all") params.status = statusFilter

      const result = await fetchTravelPlans(params)
      setPlans(result.data.data || [])
      setMeta(result.data.meta || { page, limit, total: 0, totalPages: 0 })
    } catch (error: any) {
      toast.error(error.message || "Failed to load travel plans")
    } finally {
      setLoading(false)
    }
  }, [page, hostIdFilter, destinationFilter, statusFilter])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/dashboard")
      return
    }
    if (status === "authenticated") {
      loadPlans()
    }
  }, [status, session, router, loadPlans])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (hostIdFilter) params.set("hostId", hostIdFilter)
    if (destinationFilter) params.set("destination", destinationFilter)
    if (statusFilter !== "all") params.set("status", statusFilter)
    params.set("page", "1")
    router.push(`/dashboard/travel-plans?${params.toString()}`)
  }

  const handleClearFilters = () => {
    setHostIdFilter("")
    setDestinationFilter("")
    setStatusFilter("all")
    router.push("/dashboard/travel-plans?page=1")
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`/dashboard/travel-plans?${params.toString()}`)
  }

  const handleViewParticipants = async (planId: string) => {
    setShowParticipantsDialog(true)
    
    // First, check if participants are already in the plan data
    const plan = plans.find((p) => {
      const pId = p.id || p._id || ""
      return pId === planId
    })
    
    setCurrentPlanForParticipants(plan || null)
    
    if (plan?.participants && Array.isArray(plan.participants) && plan.participants.length > 0) {
      // Convert plan participants to Participant format
      const participantsFromPlan: Participant[] = plan.participants.map((p) => ({
        id: p.id,
        name: p.name,
      }))
      setParticipants(participantsFromPlan)
      setLoadingParticipants(false)
      return
    }

    // If not in plan data, fetch from API
    setLoadingParticipants(true)
    try {
      const res = await fetch(`/api/travel-plans/${planId}/participants`)
      const data = await res.json()

      console.log("Participants API response:", data) // Debug log

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load participants")
      }

      // Handle different response structures
      let participantsArray: Participant[] = []
      if (Array.isArray(data?.data)) {
        participantsArray = data.data
      } else if (Array.isArray(data?.data?.data)) {
        participantsArray = data.data.data
      } else if (Array.isArray(data)) {
        participantsArray = data
      } else if (data?.success && data?.data) {
        // Try to extract from nested structure
        const nestedData = data.data
        if (Array.isArray(nestedData)) {
          participantsArray = nestedData
        } else if (Array.isArray(nestedData?.participants)) {
          participantsArray = nestedData.participants
        } else if (Array.isArray(nestedData?.data)) {
          participantsArray = nestedData.data
        }
      }

      console.log("Extracted participants:", participantsArray) // Debug log
      setParticipants(participantsArray)
    } catch (error: any) {
      console.error("Error loading participants:", error)
      console.error("Response data:", error)
      // If API fails but we have participants in plan, use those
      if (plan?.participants && Array.isArray(plan.participants) && plan.participants.length > 0) {
        const participantsFromPlan: Participant[] = plan.participants.map((p) => ({
          id: p.id,
          name: p.name,
        }))
        setParticipants(participantsFromPlan)
      } else {
        toast.error(error.message || "Failed to load participants")
        setParticipants([])
      }
    } finally {
      setLoadingParticipants(false)
    }
  }

  const handleEdit = (plan: TravelPlan) => {
    setEditingPlan(plan)
    setShowEditDialog(true)
  }

  const handleSaveEdit = async () => {
    if (!editingPlan) return

    setUpdatingPlanId(editingPlan.id || editingPlan._id || "")
    try {
      const planId = editingPlan.id || editingPlan._id || ""
      const res = await fetch(`/api/travel-plans/${planId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingPlan.title,
          description: editingPlan.description,
          destinationCountry: editingPlan.destinationCountry,
          destinationCity: editingPlan.destinationCity,
          startDate: editingPlan.startDate,
          endDate: editingPlan.endDate,
          budgetMin: editingPlan.budgetMin,
          budgetMax: editingPlan.budgetMax,
          travelType: editingPlan.travelType,
          maxParticipants: editingPlan.maxParticipants,
          isPublic: editingPlan.isPublic,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.message || "Failed to update travel plan")
      }

      toast.success("Travel plan updated successfully")
      setShowEditDialog(false)
      setEditingPlan(null)
      loadPlans()
    } catch (error: any) {
      toast.error(error.message || "Failed to update travel plan")
    } finally {
      setUpdatingPlanId(null)
    }
  }

  const handleStatusChange = async (planId: string, newStatus: string) => {
    setUpdatingStatusId(planId)
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
      setUpdatingStatusId(null)
    }
  }

  const handleDelete = async () => {
    if (!planToDelete) return

    setDeletingPlanId(planToDelete)
    try {
      const res = await fetch(`/api/travel-plans/${planToDelete}`, {
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

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (status === "unauthenticated" || session?.user?.role !== "ADMIN") {
    return null
  }

  const hasActiveFilters = hostIdFilter || destinationFilter || statusFilter !== "all"

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
              <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Travel Plans Management
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Manage all travel plans
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-md p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Filters & Search</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Host ID</label>
              <Input
                placeholder="Host ID..."
                value={hostIdFilter}
                onChange={(e) => setHostIdFilter(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="h-10 bg-background/50 font-mono text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Destination</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search destination..."
                  value={destinationFilter}
                  onChange={(e) => setDestinationFilter(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-9 h-10 bg-background/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                  <SelectItem value="CANCELED">Canceled</SelectItem>
                  <SelectItem value="FULL">Full</SelectItem>
                  <SelectItem value="ENDED">Ended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={handleSearch} className="flex-1 h-10 gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
              {hasActiveFilters && (
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  size="sm"
                  className="h-10 gap-2 bg-transparent"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
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
            <Globe className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-muted-foreground">
              No travel plans found. {hasActiveFilters && "Try adjusting your filters."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-hidden rounded-xl border border-border/50 bg-card/30 backdrop-blur-md">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 backdrop-blur-sm border-b border-border/50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Title</th>
                    <th className="text-left p-4 font-semibold">Host</th>
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
                    const isUpdatingStatus = updatingStatusId === planId
                    const isUpdating = updatingPlanId === planId

                    return (
                      <tr
                        key={planId}
                        className="border-t border-border/30 hover:bg-muted/20 transition-colors"
                      >
                        <td className="p-4">
                          <Link
                            href={`/travelplan/${planId}`}
                            className="font-medium max-w-[200px] truncate hover:text-primary transition-colors"
                          >
                            {plan.title}
                          </Link>
                          <div className="text-xs text-muted-foreground mt-1">
                            {TRAVEL_TYPES[plan.travelType] || plan.travelType}
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <Link
                              href={`/users/${plan.hostId}`}
                              className="font-medium text-xs hover:text-primary transition-colors"
                            >
                              {plan.hostName || "Unknown"}
                            </Link>
                            <div className="text-xs text-muted-foreground font-mono">
                              {plan.hostId.slice(0, 8)}...
                            </div>
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
                            <div>
                              <div>{formatDate(plan.startDate)}</div>
                              <div className="text-xs">to {formatDate(plan.endDate)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-xs">
                            <Users className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium">
                              {plan.participantsCount} / {plan.maxParticipants || "∞"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Select
                            value={plan.status}
                            onValueChange={(value) => handleStatusChange(planId, value)}
                            disabled={isUpdatingStatus}
                          >
                            <SelectTrigger className="h-8 w-32 text-xs">
                              {isUpdatingStatus ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <SelectValue />
                              )}
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="OPEN">Open</SelectItem>
                              <SelectItem value="CLOSED">Closed</SelectItem>
                              <SelectItem value="CANCELED">Canceled</SelectItem>
                              <SelectItem value="FULL">Full</SelectItem>
                              <SelectItem value="ENDED">Ended</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewParticipants(planId)}
                              className="h-8 gap-1.5"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(plan)}
                              disabled={isUpdating}
                              className="h-8 gap-1.5"
                            >
                              {isUpdating ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <>
                                  <Edit2 className="h-3.5 w-3.5" />
                                  Edit
                                </>
                              )}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setPlanToDelete(planId)
                                setShowDeleteDialog(true)
                              }}
                              className="h-8 gap-1.5"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
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
                const isUpdatingStatus = updatingStatusId === planId
                const isUpdating = updatingPlanId === planId

                return (
                  <div
                    key={planId}
                    className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-md p-4 sm:p-5 space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Link
                            href={`/travelplan/${planId}`}
                            className="font-semibold text-base sm:text-lg hover:text-primary transition-colors"
                          >
                            {plan.title}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-1">
                            {TRAVEL_TYPES[plan.travelType] || plan.travelType}
                          </p>
                        </div>
                        <Badge
                          className={`${STATUS_COLORS[plan.status] || STATUS_COLORS.OPEN} border text-xs`}
                        >
                          {plan.status}
                        </Badge>
                      </div>

                      <div className="space-y-1.5 text-xs sm:text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-3.5 w-3.5" />
                          <Link
                            href={`/users/${plan.hostId}`}
                            className="hover:text-primary transition-colors"
                          >
                            {plan.hostName || "Unknown"} ({plan.hostId.slice(0, 8)}...)
                          </Link>
                        </div>
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
                          {plan.participantsCount} / {plan.maxParticipants || "∞"} participants
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/30 space-y-2">
                      <Select
                        value={plan.status}
                        onValueChange={(value) => handleStatusChange(planId, value)}
                        disabled={isUpdatingStatus}
                      >
                        <SelectTrigger className="h-9 w-full text-xs">
                          {isUpdatingStatus ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <SelectValue />
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="OPEN">Open</SelectItem>
                          <SelectItem value="CLOSED">Closed</SelectItem>
                          <SelectItem value="CANCELED">Canceled</SelectItem>
                          <SelectItem value="FULL">Full</SelectItem>
                          <SelectItem value="ENDED">Ended</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewParticipants(planId)}
                          className="w-full gap-1.5"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(plan)}
                          disabled={isUpdating}
                          className="w-full gap-1.5"
                        >
                          {isUpdating ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <>
                              <Edit2 className="h-3.5 w-3.5" />
                              Edit
                            </>
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setPlanToDelete(planId)
                            setShowDeleteDialog(true)
                          }}
                          className="w-full gap-1.5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <Pagination
              page={meta.page}
              pages={meta.totalPages}
              total={meta.total}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Travel Plan</DialogTitle>
            <DialogDescription>Update travel plan details</DialogDescription>
          </DialogHeader>
          {editingPlan && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={editingPlan.title}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editingPlan.description}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, description: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Destination City</label>
                  <Input
                    value={editingPlan.destinationCity}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, destinationCity: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Destination Country</label>
                  <Input
                    value={editingPlan.destinationCountry}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, destinationCountry: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="datetime-local"
                    value={
                      editingPlan.startDate
                        ? new Date(editingPlan.startDate).toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        startDate: new Date(e.target.value).toISOString(),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    type="datetime-local"
                    value={
                      editingPlan.endDate
                        ? new Date(editingPlan.endDate).toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        endDate: new Date(e.target.value).toISOString(),
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Min Budget</label>
                  <Input
                    type="number"
                    value={editingPlan.budgetMin || ""}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        budgetMin: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Budget</label>
                  <Input
                    type="number"
                    value={editingPlan.budgetMax || ""}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        budgetMax: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Travel Type</label>
                  <Select
                    value={editingPlan.travelType}
                    onValueChange={(value) =>
                      setEditingPlan({ ...editingPlan, travelType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FRIENDS">Friends</SelectItem>
                      <SelectItem value="FAMILY">Family</SelectItem>
                      <SelectItem value="SOLO">Solo</SelectItem>
                      <SelectItem value="BUSINESS">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Participants</label>
                  <Input
                    type="number"
                    value={editingPlan.maxParticipants || ""}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        maxParticipants: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingPlan.isPublic}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, isPublic: e.target.checked })
                    }
                    className="rounded"
                  />
                  Public
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} disabled={updatingPlanId !== null}>
                  {updatingPlanId ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Participants Dialog */}
      <Dialog 
        open={showParticipantsDialog} 
        onOpenChange={(open) => {
          setShowParticipantsDialog(open)
          if (!open) {
            setParticipants([])
            setCurrentPlanForParticipants(null)
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Participants
              {currentPlanForParticipants && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({currentPlanForParticipants.participantsCount || 0} total)
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              {currentPlanForParticipants?.title || "View all participants of this travel plan"}
            </DialogDescription>
          </DialogHeader>
          {loadingParticipants ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : !Array.isArray(participants) || participants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No participants found</p>
              {currentPlanForParticipants && currentPlanForParticipants.participantsCount > 0 && (
                <p className="text-xs mt-2">
                  The plan shows {currentPlanForParticipants.participantsCount} participant(s), but details could not be loaded.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {Array.isArray(participants) && participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50"
                >
                  <div>
                    <Link
                      href={`/users/${participant.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {participant.name}
                    </Link>
                    {participant.email && (
                      <div className="text-xs text-muted-foreground">{participant.email}</div>
                    )}
                    {participant.phone && (
                      <div className="text-xs text-muted-foreground">{participant.phone}</div>
                    )}
                  </div>
                  <Link
                    href={`/users/${participant.id}`}
                    className="text-xs text-muted-foreground font-mono hover:text-primary transition-colors"
                  >
                    {participant.id}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Travel Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this travel plan? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deletingPlanId !== null}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingPlanId ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
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

export default function AdminTravelPlansPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading travel plans...</p>
          </div>
        </div>
      </div>
    }>
      <AdminTravelPlansPageContent />
    </Suspense>
  )
}


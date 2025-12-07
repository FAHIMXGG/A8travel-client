"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import toast from "react-hot-toast"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Participant = {
  id: string
  name: string
}

type Review = {
  id: string
  reviewerId: string
  name: string
  rating: number
  comment: string
  createdAt: string
}

type TravelPlan = {
  id: string
  hostId: string
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
  contact?: string
  images: string[]
  tags: string[]
  isPublic: boolean
  status: string
  maxParticipants: number
  participantsCount: number
  createdAt: string
  updatedAt: string
  participants: Participant[]
  hostName: string
  hostImage?: string | null
  hostRatingAverage: number
  hostRatingCount: number
  reviews: Review[]
}

type Meta = {
  total: number
  page: number
  limit: number
  totalPages: number
}

type TravelHistoryResponse = {
  success: boolean
  message: string
  data: {
    meta: Meta
    data: TravelPlan[]
  }
}

async function fetchTravelHistory(params: {
  page?: number
  limit?: number
}): Promise<TravelHistoryResponse> {
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.set("page", params.page.toString())
  if (params.limit) queryParams.set("limit", params.limit.toString())

  const res = await fetch(`/api/travel-plans/me/travel-history?${queryParams.toString()}`)
  const data = await res.json()

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "Failed to fetch travel history",
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
  })
}

function getStatusBadge(status: string) {
  switch (status) {
    case "OPEN":
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
          <Clock className="h-3 w-3 mr-1" />
          Open
        </Badge>
      )
    case "ENDED":
      return (
        <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-500/20">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Ended
        </Badge>
      )
    case "CANCELLED":
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
          <XCircle className="h-3 w-3 mr-1" />
          Cancelled
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="bg-muted text-muted-foreground">
          {status}
        </Badge>
      )
  }
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
        active travel plans • Page{" "}
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

export default function JoinedPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([])
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)

  const page = Number(searchParams.get("page")) || 1
  const limit = 10

  const loadTravelHistory = useCallback(async () => {
    setLoading(true)
    try {
      const result = await fetchTravelHistory({ page, limit })
      // Filter only OPEN status plans
      const openPlans = result.data.data.filter((plan) => plan.status === "OPEN")
      
      // Calculate pagination for filtered results
      const totalOpen = openPlans.length
      const totalPages = Math.ceil(totalOpen / limit)
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedPlans = openPlans.slice(startIndex, endIndex)

      setTravelPlans(paginatedPlans)
      setMeta({
        page,
        limit,
        total: totalOpen,
        totalPages: totalPages || 1,
      })
    } catch (error: any) {
      toast.error(error.message || "Failed to load joined plans")
    } finally {
      setLoading(false)
    }
  }, [page, limit])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    if (status === "authenticated") {
      loadTravelHistory()
    }
  }, [status, router, loadTravelHistory])

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`/dashboard/joined?${params.toString()}`)
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (status === "unauthenticated") {
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
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Joined Plans
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                View your active joined travel plans
              </p>
            </div>
          </div>
        </div>

        {/* Travel Plans Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : travelPlans.length === 0 ? (
          <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 sm:p-12 text-center">
            <Users className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-muted-foreground">
              No active joined plans found. Join a travel plan to see it here.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-hidden rounded-xl border border-border/50 bg-card/30 backdrop-blur-md">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 backdrop-blur-sm border-b border-border/50">
                    <TableHead className="p-4 font-semibold">Title</TableHead>
                    <TableHead className="p-4 font-semibold">Destination</TableHead>
                    <TableHead className="p-4 font-semibold">Dates</TableHead>
                    <TableHead className="p-4 font-semibold">Budget</TableHead>
                    <TableHead className="p-4 font-semibold">Type</TableHead>
                    <TableHead className="p-4 font-semibold">Participants</TableHead>
                    <TableHead className="p-4 font-semibold">Host</TableHead>
                    <TableHead className="p-4 font-semibold">Status</TableHead>
                    <TableHead className="p-4 font-semibold text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {travelPlans.map((plan) => (
                    <TableRow
                      key={plan.id}
                      className="border-t border-border/30 hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => router.push(`/travelplan/${plan.id}`)}
                    >
                      <TableCell className="p-4">
                        <div className="font-medium max-w-[200px] truncate">{plan.title}</div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {plan.description}
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{plan.destinationCity}</div>
                            <div className="text-xs text-muted-foreground">{plan.destinationCountry}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div className="text-xs">
                            <div>{formatDate(plan.startDate)}</div>
                            <div className="text-muted-foreground">to {formatDate(plan.endDate)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>
                            ${plan.budgetMin} - ${plan.budgetMax}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        <Badge variant="outline" className="text-xs">
                          {plan.travelType}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {plan.participantsCount} / {plan.maxParticipants}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="text-sm">
                          <div className="font-medium">{plan.hostName}</div>
                          {plan.hostRatingAverage > 0 && (
                            <div className="text-xs text-muted-foreground">
                              ⭐ {plan.hostRatingAverage.toFixed(1)} ({plan.hostRatingCount})
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        {getStatusBadge(plan.status)}
                      </TableCell>
                      <TableCell className="p-4 text-right">
                        <Link
                          href={`/travelplan/${plan.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          View
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {travelPlans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => router.push(`/travelplan/${plan.id}`)}
                  className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-md p-4 space-y-3 cursor-pointer hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base mb-1">{plan.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{plan.destinationCity}, {plan.destinationCountry}</span>
                      </div>
                    </div>
                    {getStatusBadge(plan.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">{formatDate(plan.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">${plan.budgetMin}-${plan.budgetMax}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">{plan.participantsCount}/{plan.maxParticipants}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Host:</span>
                      <span className="text-xs font-medium">{plan.hostName}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/30">
                    <Link
                      href={`/travelplan/${plan.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      View Details
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <Pagination page={meta.page} pages={meta.totalPages} total={meta.total} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  )
}


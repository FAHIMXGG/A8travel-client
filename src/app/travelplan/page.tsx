"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Tag,
  Search,
  Filter,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Globe,
  User,
  Star,
  ImageIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import toast from "react-hot-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

async function fetchTravelPlans(params: {
  page?: number
  limit?: number
  destination?: string
  tags?: string
  query?: string
  useMatch?: boolean
  useSearch?: boolean
}): Promise<TravelPlansResponse> {
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.set("page", params.page.toString())
  if (params.limit) queryParams.set("limit", params.limit.toString())
  if (params.destination) queryParams.set("destination", params.destination)
  if (params.tags) queryParams.set("tags", params.tags)
  if (params.query) queryParams.set("query", params.query)

  let endpoint = "/api/travel-plans"
  if (params.useSearch) {
    endpoint = "/api/travel-plans/search"
  } else if (params.useMatch) {
    endpoint = "/api/travel-plans/match"
  }

  const res = await fetch(`${endpoint}?${queryParams.toString()}`)
  const data = await res.json()

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "Failed to fetch travel plans",
      data: {
        meta: { page: 1, limit: 12, total: 0, totalPages: 0 },
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
  COUPLES: "Couples",
  BUSINESS: "Business",
}

export default function TravelPlansPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [plans, setPlans] = useState<TravelPlan[]>([])
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 12, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "")
  const [destination, setDestination] = useState(searchParams.get("destination") || "")
  const [tags, setTags] = useState(searchParams.get("tags") || "")
  const [useMatch, setUseMatch] = useState(searchParams.get("match") === "true")
  const [useSearch, setUseSearch] = useState(!!searchParams.get("query"))

  const page = Number(searchParams.get("page")) || 1
  const limit = 12

  const loadPlans = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = { page, limit }
      if (searchQuery) {
        params.query = searchQuery
        params.useSearch = true
      } else if (useMatch && (destination || tags)) {
        params.useMatch = true
        if (destination) params.destination = destination
        if (tags) params.tags = tags
      } else {
        if (destination) params.destination = destination
        if (tags) params.tags = tags
      }

      const result = await fetchTravelPlans(params)
      setPlans(result.data.data || [])
      setMeta(result.data.meta || { page, limit, total: 0, totalPages: 0 })
    } catch (error: any) {
      toast.error(error.message || "Failed to load travel plans")
    } finally {
      setLoading(false)
    }
  }, [page, searchQuery, destination, tags, useMatch])

  useEffect(() => {
    loadPlans()
  }, [loadPlans])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery) {
      params.set("query", searchQuery)
    } else {
      if (destination) params.set("destination", destination)
      if (tags) params.set("tags", tags)
      if (useMatch) params.set("match", "true")
    }
    params.set("page", "1")
    router.push(`/travelplan?${params.toString()}`)
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setDestination("")
    setTags("")
    setUseMatch(false)
    setUseSearch(false)
    router.push("/travelplan?page=1")
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`/travelplan?${params.toString()}`)
  }

  const hasActiveFilters = searchQuery || destination || tags || useMatch

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
                Travel Plans
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Discover amazing travel experiences
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-md p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Search & Filters</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search travel plans..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setUseSearch(!!e.target.value)
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-9 h-10 bg-background/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Destination</label>
              <Input
                placeholder="e.g., Cox's Bazar"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="h-10 bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Tags (comma-separated)</label>
              <Input
                placeholder="e.g., beach, seafood"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="h-10 bg-background/50"
              />
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

          {!useSearch && (destination || tags) && (
            <div className="flex items-center gap-2 pt-2 border-t border-border/30">
              <input
                type="checkbox"
                id="useMatch"
                checked={useMatch}
                onChange={(e) => setUseMatch(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="useMatch" className="text-xs text-muted-foreground cursor-pointer">
                Use match mode (finds plans matching all criteria)
              </label>
            </div>
          )}
        </div>

        {/* Travel Plans Grid */}
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
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => {
                const planId = plan.id || plan._id || ""
                const firstImage = plan.images && plan.images.length > 0 ? plan.images[0] : null
                const budgetRange =
                  plan.budgetMin && plan.budgetMax
                    ? `$${plan.budgetMin} - $${plan.budgetMax}`
                    : plan.budgetMin
                      ? `From $${plan.budgetMin}`
                      : plan.budgetMax
                        ? `Up to $${plan.budgetMax}`
                        : "Budget not specified"

                return (
                  <Link
                    key={planId}
                    href={`/travelplan/${planId}`}
                    className="group block h-full rounded-xl border border-border/50 bg-card/30 backdrop-blur-md hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Image */}
                    <div className="aspect-video relative bg-gradient-to-br from-primary/10 to-amber-500/10 overflow-hidden">
                      {firstImage ? (
                        <Image
                          src={firstImage}
                          alt={plan.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge
                          className={`text-xs border ${STATUS_COLORS[plan.status] || STATUS_COLORS.CLOSED}`}
                        >
                          {plan.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5 space-y-3">
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {plan.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {TRAVEL_TYPES[plan.travelType] || plan.travelType}
                        </p>
                      </div>

                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {plan.destinationCity}, {plan.destinationCountry}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>
                            {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>
                            {plan.participantsCount}
                            {plan.maxParticipants ? ` / ${plan.maxParticipants}` : ""} participants
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>{budgetRange}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      {plan.tags && plan.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/30">
                          {plan.tags.slice(0, 3).map((tag, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0.5"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {plan.tags.length > 3 && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                              +{plan.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Host Info */}
                      {plan.hostName && plan.hostId && (
                        <div
                          className="flex items-center gap-2 pt-2 border-t border-border/30 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            router.push(`/users/${plan.hostId}`)
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {plan.hostImage ? (
                              <Image
                                src={plan.hostImage}
                                alt={plan.hostName}
                                width={24}
                                height={24}
                                className="rounded-full"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-3.5 w-3.5 text-primary" />
                              </div>
                            )}
                            <span className="text-xs text-muted-foreground hover:text-primary transition-colors">
                              {plan.hostName}
                            </span>
                          </div>
                          {plan.hostRatingAverage !== undefined && plan.hostRatingAverage > 0 && (
                            <div className="flex items-center gap-1 ml-auto">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span className="text-xs text-muted-foreground">
                                {plan.hostRatingAverage.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
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
    </div>
  )
}


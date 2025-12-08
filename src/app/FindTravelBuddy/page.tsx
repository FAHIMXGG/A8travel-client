"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  User,
  MapPin,
  Star,
  Mail,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Users,
  Crown,
  Globe,
  Plane,
  Heart,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import toast from "react-hot-toast"

type User = {
  id: string
  name: string
  email: string
  role: string
  image: string | null
  bio: string | null
  phone: string
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

type Meta = {
  total: number
  page: number
  limit: number
  totalPages: number
}

type UsersResponse = {
  success: boolean
  message: string
  data: {
    meta: Meta
    data: User[]
  }
}

async function fetchAllUsers(params: {
  page?: number
  limit?: number
}): Promise<UsersResponse> {
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.set("page", params.page.toString())
  if (params.limit) queryParams.set("limit", params.limit.toString())

  const res = await fetch(`/api/users/all?${queryParams.toString()}`)
  const data = await res.json()

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "Failed to fetch users",
      data: {
        meta: { page: 1, limit: 12, total: 0, totalPages: 0 },
        data: [],
      },
    }
  }

  return data
}

async function searchUsers(params: {
  query?: string
  travelInterests?: string
  visitedCountries?: string
  page?: number
  limit?: number
}): Promise<UsersResponse> {
  const queryParams = new URLSearchParams()
  if (params.query) queryParams.set("query", params.query)
  if (params.travelInterests) queryParams.set("travelInterests", params.travelInterests)
  if (params.visitedCountries) queryParams.set("visitedCountries", params.visitedCountries)
  if (params.page) queryParams.set("page", params.page.toString())
  if (params.limit) queryParams.set("limit", params.limit.toString())

  const res = await fetch(`/api/users/search?${queryParams.toString()}`)
  const data = await res.json()

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "Failed to search users",
      data: {
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
        data: [],
      },
    }
  }

  return data
}

function Pagination({
  page,
  pages,
  total,
  limit,
  onPageChange,
}: {
  page: number
  pages: number
  total: number
  limit: number
  onPageChange: (p: number) => void
}) {
  if (pages <= 1) return null

  const windowSize = 5
  let start = Math.max(1, page - Math.floor(windowSize / 2))
  const end = Math.min(pages, start + windowSize - 1)
  if (end - start < windowSize - 1) {
    start = Math.max(1, end - windowSize + 1)
  }

  const pageNumbers = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <div className="text-sm text-muted-foreground">
        Showing {total > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, total)} of {total} users
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {pageNumbers.map((p) => (
          <Button
            key={p}
            variant={p === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(p)}
            className="h-8 w-8 p-0"
          >
            {p}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pages)}
          disabled={page >= pages}
          className="h-8 w-8 p-0"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function FindTravelBuddyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [users, setUsers] = useState<User[]>([])
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 12, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "")
  const [travelInterests, setTravelInterests] = useState(searchParams.get("travelInterests") || "")
  const [visitedCountries, setVisitedCountries] = useState(searchParams.get("visitedCountries") || "")

  const page = Number(searchParams.get("page")) || 1
  const isSearchMode = !!(
    searchQuery.trim() || 
    travelInterests.trim() || 
    visitedCountries.trim()
  )

  const loadUsers = useCallback(async () => {
    setLoading(true)
    const trimmedQuery = searchQuery.trim()
    const trimmedInterests = travelInterests.trim()
    const trimmedCountries = visitedCountries.trim()
    
    const hasFilters = !!(trimmedQuery || trimmedInterests || trimmedCountries)
    const currentIsSearchMode = hasFilters
    const limit = currentIsSearchMode ? 10 : 12
    
    try {
      let result: UsersResponse
      
      if (currentIsSearchMode) {
        // Use search API when any filter is provided
        result = await searchUsers({
          query: trimmedQuery || undefined,
          travelInterests: trimmedInterests || undefined,
          visitedCountries: trimmedCountries || undefined,
          page,
          limit,
        })
      } else {
        // Use all users API by default
        result = await fetchAllUsers({
          page,
          limit,
        })
      }
      
      if (result.success) {
        setUsers(result.data.data)
        setMeta(result.data.meta)
      } else {
        toast.error(result.message || "Failed to load users")
        setUsers([])
        setMeta({ page: 1, limit, total: 0, totalPages: 0 })
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load users")
      setUsers([])
      setMeta({ page: 1, limit, total: 0, totalPages: 0 })
    } finally {
      setLoading(false)
    }
  }, [searchQuery, travelInterests, visitedCountries, page])

  // Sync state with URL params when they change
  useEffect(() => {
    const queryParam = searchParams.get("query") || ""
    const interestsParam = searchParams.get("travelInterests") || ""
    const countriesParam = searchParams.get("visitedCountries") || ""
    
    setSearchQuery(queryParam)
    setTravelInterests(interestsParam)
    setVisitedCountries(countriesParam)
  }, [searchParams])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleSearch = () => {
    const params = new URLSearchParams()
    const trimmedQuery = searchQuery.trim()
    const trimmedInterests = travelInterests.trim()
    const trimmedCountries = visitedCountries.trim()
    
    if (trimmedQuery) {
      params.set("query", trimmedQuery)
    }
    if (trimmedInterests) {
      params.set("travelInterests", trimmedInterests)
    }
    if (trimmedCountries) {
      params.set("visitedCountries", trimmedCountries)
    }
    params.set("page", "1")
    router.push(`/FindTravelBuddy?${params.toString()}`)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setTravelInterests("")
    setVisitedCountries("")
    router.push("/FindTravelBuddy?page=1")
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`/FindTravelBuddy?${params.toString()}`)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          Find Travel Buddy
        </h1>
        <p className="text-muted-foreground">Search for travel companions and connect with fellow adventurers</p>
      </div>

      {/* Search Bar */}
      <Card className="border-border/50 bg-card/30 backdrop-blur-md">
        <CardContent className="p-4 space-y-4">
          {/* Main Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search users by name, email, location, interests, or anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            {isSearchMode && (
              <Button onClick={handleClearSearch} variant="outline" disabled={loading}>
                Clear
              </Button>
            )}
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isSearchMode ? "Searching..." : "Loading..."}
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  {isSearchMode ? "Search" : "Show All"}
                </>
              )}
            </Button>
          </div>

          {/* Filter Inputs */}
          <div className="grid gap-2 md:grid-cols-2">
            <div className="relative">
              <Heart className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Travel Interests (e.g., Adventure, Beach, Culture)"
                value={travelInterests}
                onChange={(e) => setTravelInterests(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Visited Countries (e.g., France, Italy, Spain)"
                value={visitedCountries}
                onChange={(e) => setVisitedCountries(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Tip: Separate multiple values with commas (e.g., "Adventure,Beach" or "France,Italy")
          </p>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-border/50 bg-card/30 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : users.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <Link key={user.id} href={`/users/${user.id}`}>
                <Card className="border-border/50 bg-card/30 backdrop-blur-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer h-full flex flex-col">
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="h-16 w-16 border-2 border-border flex-shrink-0">
                        <AvatarImage src={user.image || undefined} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-amber-500/20 text-lg">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate">{user.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Mail className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{user.email}</span>
                            </div>
                          </div>
                          {user.subscriptionStatus === "ACTIVE" && (
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 flex-shrink-0">
                              <Crown className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 flex-1">
                      {/* Location - always show */}
                      <div className="flex items-center gap-1.5 text-sm min-h-[20px]">
                        {user.currentLocation ? (
                          <>
                            <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <span className="truncate text-muted-foreground">{user.currentLocation}</span>
                          </>
                        ) : (
                          <span className="text-muted-foreground/50 text-xs">No location set</span>
                        )}
                      </div>

                      {/* Rating - always show */}
                      <div className="flex items-center gap-1.5 text-sm min-h-[20px]">
                        {user.ratingAverage > 0 ? (
                          <>
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                            <span>
                              {user.ratingAverage.toFixed(1)} ({user.ratingCount} reviews)
                            </span>
                          </>
                        ) : (
                          <span className="text-muted-foreground/50 text-xs">No ratings yet</span>
                        )}
                      </div>

                      {/* Bio - always show with fixed height */}
                      <div className="min-h-[40px]">
                        {user.bio ? (
                          <p className="text-sm text-muted-foreground line-clamp-2">{user.bio}</p>
                        ) : (
                          <p className="text-sm text-muted-foreground/50 line-clamp-2">No bio available</p>
                        )}
                      </div>

                      {/* Stats - always show */}
                      <div className="flex flex-wrap gap-2 pt-2 min-h-[24px]">
                        {user.travelInterests && user.travelInterests.length > 0 ? (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Heart className="h-3 w-3" />
                            <span>{user.travelInterests.length} interests</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground/50">
                            <Heart className="h-3 w-3" />
                            <span>0 interests</span>
                          </div>
                        )}
                        {user.visitedCountries && user.visitedCountries.length > 0 ? (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Plane className="h-3 w-3" />
                            <span>{user.visitedCountries.length} countries</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground/50">
                            <Plane className="h-3 w-3" />
                            <span>0 countries</span>
                          </div>
                        )}
                        {user.gallery && user.gallery.length > 0 ? (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Globe className="h-3 w-3" />
                            <span>{user.gallery.length} photos</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground/50">
                            <Globe className="h-3 w-3" />
                            <span>0 photos</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="pt-4">
              <Pagination 
                page={meta.page} 
                pages={meta.totalPages} 
                total={meta.total} 
                limit={meta.limit}
                onPageChange={handlePageChange} 
              />
            </div>
          )}
        </>
      ) : isSearchMode ? (
        <Card className="border-border/50 bg-card/30 backdrop-blur-md">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No users found</h3>
            <p className="text-muted-foreground">Try adjusting your search query</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50 bg-card/30 backdrop-blur-md">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No users available</h3>
            <p className="text-muted-foreground">There are no users to display at the moment</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function FindTravelBuddyPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Find Travel Buddy
          </h1>
          <p className="text-muted-foreground">Search for travel companions and connect with fellow adventurers</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-border/50 bg-card/30 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    }>
      <FindTravelBuddyContent />
    </Suspense>
  )
}


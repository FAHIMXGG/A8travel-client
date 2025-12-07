"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Users,
  Search,
  Shield,
  ShieldOff,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  X,
  Loader2,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
} from "lucide-react"
import toast from "react-hot-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type User = {
  id: string
  _id?: string // Support both formats
  name: string
  email: string
  phone?: string | null
  role: "ADMIN" | "USER"
  isBlocked: boolean
  createdAt?: string
  updatedAt?: string
}

type Meta = {
  page: number
  limit: number
  total: number
  pages: number
  totalPages?: number // Support both formats
}

type UsersResponse = {
  success: boolean
  message: string
  data: User[]
  meta?: Meta
}

async function fetchUsers(params: {
  page?: number
  limit?: number
  search?: string
  status?: string
  id?: string
}): Promise<UsersResponse> {
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.set("page", params.page.toString())
  if (params.limit) queryParams.set("limit", params.limit.toString())
  if (params.search) queryParams.set("search", params.search)
  if (params.status) queryParams.set("status", params.status)
  if (params.id) queryParams.set("id", params.id)

  const res = await fetch(`/api/users?${queryParams.toString()}`)
  const data = await res.json()

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "Failed to fetch users",
      data: [],
      meta: { page: 1, limit: 10, total: 0, pages: 0 },
    }
  }

  // Handle nested response structure: { success, message, data: { meta: {...}, data: [...] } }
  const nestedData = data?.data
  const usersArray = Array.isArray(nestedData?.data) ? nestedData.data : []
  const metaData = nestedData?.meta || {}

  return {
    success: data?.success ?? true,
    message: data?.message || "",
    data: usersArray,
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
        users • Page{" "}
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

function UsersPageContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [users, setUsers] = useState<User[]>([])
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10, total: 0, pages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all")
  const [userIdSearch, setUserIdSearch] = useState(searchParams.get("id") || "")
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)

  const page = Number(searchParams.get("page")) || 1
  const limit = 10

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = { page, limit }
      if (search) params.search = search
      if (statusFilter !== "all") params.status = statusFilter
      if (userIdSearch) params.id = userIdSearch

      const result = await fetchUsers(params)
      setUsers(result.data)
      setMeta(result.meta || { page, limit, total: 0, pages: 0 })
    } catch (error: any) {
      toast.error(error.message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter, userIdSearch])

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
      loadUsers()
    }
  }, [status, session, router, loadUsers])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (statusFilter !== "all") params.set("status", statusFilter)
    if (userIdSearch) params.set("id", userIdSearch)
    params.set("page", "1")
    router.push(`/dashboard/users?${params.toString()}`)
  }

  const handleClearFilters = () => {
    setSearch("")
    setStatusFilter("all")
    setUserIdSearch("")
    router.push("/dashboard/users?page=1")
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`/dashboard/users?${params.toString()}`)
  }

  const handleBlockToggle = async (userId: string, isBlocked: boolean) => {
    setUpdatingUserId(userId)
    try {
      const res = await fetch(`/api/users/${userId}/admin`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: !isBlocked }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.message || "Failed to update user")
      }

      toast.success(isBlocked ? "User unblocked successfully" : "User blocked successfully")
      loadUsers()
    } catch (error: any) {
      toast.error(error.message || "Failed to update user")
    } finally {
      setUpdatingUserId(null)
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

  const hasActiveFilters = search || statusFilter !== "all" || userIdSearch

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
                User Management
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Manage all registered travelers
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
              <label className="text-xs font-medium text-muted-foreground">Search by Name/Email</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-9 h-10 bg-background/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Filter by Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="blocked">Blocked Only</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Search by User ID</label>
              <Input
                placeholder="User ID..."
                value={userIdSearch}
                onChange={(e) => setUserIdSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="h-10 bg-background/50 font-mono text-xs"
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
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 sm:p-12 text-center">
            <Users className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-muted-foreground">
              No users found. {hasActiveFilters && "Try adjusting your filters."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-hidden rounded-xl border border-border/50 bg-card/30 backdrop-blur-md">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 backdrop-blur-sm border-b border-border/50">
                  <tr>
                    <th className="text-left p-4 font-semibold">User</th>
                    <th className="text-left p-4 font-semibold">Contact</th>
                    <th className="text-left p-4 font-semibold">Role</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Joined</th>
                    <th className="text-right p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const userId = user.id || user._id || ""
                    return (
                    <tr
                      key={userId}
                      className="border-t border-border/30 hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground font-mono mt-1">
                          {userId}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-xs">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-xs mt-1">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">{user.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                            user.role === "ADMIN"
                              ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                              : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        {user.isBlocked ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                            <UserX className="h-3 w-3" />
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                            <UserCheck className="h-3 w-3" />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant={user.isBlocked ? "default" : "destructive"}
                            size="sm"
                            onClick={() => handleBlockToggle(userId, user.isBlocked)}
                            disabled={updatingUserId === userId}
                            className="h-8 gap-1.5"
                          >
                            {updatingUserId === userId ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : user.isBlocked ? (
                              <>
                                <Shield className="h-3.5 w-3.5" />
                                Unblock
                              </>
                            ) : (
                              <>
                                <ShieldOff className="h-3.5 w-3.5" />
                                Block
                              </>
                            )}
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
              {users.map((user) => {
                const userId = user.id || user._id || ""
                return (
                <div
                  key={userId}
                  className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-md p-4 sm:p-5 space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg">{user.name}</h3>
                        <p className="text-xs text-muted-foreground font-mono mt-1">{userId}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                            user.role === "ADMIN"
                              ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                              : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          {user.role}
                        </span>
                        {user.isBlocked ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-600 dark:text-red-400">
                            <UserX className="h-3 w-3" />
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400">
                            <UserCheck className="h-3 w-3" />
                            Active
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs sm:text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          {user.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        Joined {formatDate(user.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/30">
                    <Button
                      variant={user.isBlocked ? "default" : "destructive"}
                      size="sm"
                      onClick={() => handleBlockToggle(userId, user.isBlocked)}
                      disabled={updatingUserId === userId}
                      className="w-full gap-2"
                    >
                      {updatingUserId === userId ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : user.isBlocked ? (
                        <>
                          <Shield className="h-3.5 w-3.5" />
                          Unblock User
                        </>
                      ) : (
                        <>
                          <ShieldOff className="h-3.5 w-3.5" />
                          Block User
                        </>
                      )}
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
    </div>
  )
}

export default function UsersPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </div>
    }>
      <UsersPageContent />
    </Suspense>
  )
}

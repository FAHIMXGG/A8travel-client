"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  DialogFooter,
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
import {
  Ticket,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  X,
  Loader2,
  Calendar,
  Percent,
  DollarSign,
  Hash,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import toast from "react-hot-toast"
import { Badge } from "@/components/ui/badge"

type Coupon = {
  id: string
  _id?: string
  code: string
  description?: string
  discountType: "PERCENTAGE" | "FIXED"
  discountValue: number
  minAmount?: number
  maxDiscount?: number
  expiresAt: string
  usageLimit?: number
  isActive: boolean
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

type CouponsResponse = {
  success: boolean
  message: string
  data: Coupon[]
  meta?: Meta
}

async function fetchCoupons(params: {
  page?: number
  limit?: number
  isActive?: string
}): Promise<CouponsResponse> {
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.set("page", params.page.toString())
  if (params.limit) queryParams.set("limit", params.limit.toString())
  if (params.isActive !== undefined && params.isActive !== "") {
    queryParams.set("isActive", params.isActive)
  }

  const res = await fetch(`/api/coupons?${queryParams.toString()}`)
  const data = await res.json()

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "Failed to fetch coupons",
      data: [],
      meta: { page: 1, limit: 10, total: 0, pages: 0 },
    }
  }

  const nestedData = data?.data
  const couponsArray = Array.isArray(nestedData?.data) ? nestedData.data : (Array.isArray(data?.data) ? data.data : [])
  const metaData = nestedData?.meta || data?.meta || {}

  return {
    success: data?.success ?? true,
    message: data?.message || "",
    data: couponsArray,
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
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatCurrency(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
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
        coupons • Page{" "}
        <span className="font-medium text-foreground">{page}</span> of{" "}
        <span className="font-medium text-foreground">{pages}</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="h-8 gap-1"
        >
          <ChevronsLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">First</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="h-8 gap-1"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Prev</span>
        </Button>

        {nums.map((n) => (
          <Button
            key={n}
            variant={n === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(n)}
            className="h-8 min-w-8"
          >
            {n}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages}
          className="h-8 gap-1"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pages)}
          disabled={page === pages}
          className="h-8 gap-1"
        >
          <span className="hidden sm:inline">Last</span>
          <ChevronsRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

function CouponFormDialog({
  open,
  onOpenChange,
  coupon,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  coupon?: Coupon
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    discountValue: "",
    minAmount: "",
    maxDiscount: "",
    expiresAt: "",
    usageLimit: "",
    isActive: true,
  })

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code || "",
        description: coupon.description || "",
        discountType: coupon.discountType || "PERCENTAGE",
        discountValue: coupon.discountType === "FIXED" 
          ? (coupon.discountValue ? (coupon.discountValue / 100).toString() : "")
          : (coupon.discountValue?.toString() || ""),
        minAmount: coupon.minAmount ? (coupon.minAmount / 100).toString() : "",
        maxDiscount: coupon.maxDiscount ? (coupon.maxDiscount / 100).toString() : "",
        expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().slice(0, 16) : "",
        usageLimit: coupon.usageLimit?.toString() || "",
        isActive: coupon.isActive ?? true,
      })
    } else {
      setFormData({
        code: "",
        description: "",
        discountType: "PERCENTAGE",
        discountValue: "",
        minAmount: "",
        maxDiscount: "",
        expiresAt: "",
        usageLimit: "",
        isActive: true,
      })
    }
  }, [coupon, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload: any = {
        code: formData.code,
        description: formData.description,
        discountType: formData.discountType,
        discountValue: formData.discountType === "PERCENTAGE" 
          ? parseFloat(formData.discountValue) 
          : Math.round(parseFloat(formData.discountValue) * 100), // Convert to cents for FIXED
        expiresAt: new Date(formData.expiresAt).toISOString(),
        isActive: formData.isActive,
      }

      if (formData.minAmount) {
        payload.minAmount = Math.round(parseFloat(formData.minAmount) * 100) // Convert to cents
      }
      if (formData.maxDiscount) {
        payload.maxDiscount = Math.round(parseFloat(formData.maxDiscount) * 100) // Convert to cents
      }
      if (formData.usageLimit) {
        payload.usageLimit = parseInt(formData.usageLimit, 10)
      }

      const url = coupon ? `/api/coupons/${coupon.id || coupon._id}` : "/api/coupons"
      const method = coupon ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.message || "Failed to save coupon")
      }

      toast.success(coupon ? "Coupon updated successfully" : "Coupon created successfully")
      onOpenChange(false)
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || "Failed to save coupon")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{coupon ? "Edit Coupon" : "Create New Coupon"}</DialogTitle>
          <DialogDescription>
            {coupon ? "Update coupon details" : "Fill in the details to create a new coupon"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="SAVE10"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountType">Discount Type *</Label>
              <Select
                value={formData.discountType}
                onValueChange={(value: "PERCENTAGE" | "FIXED") =>
                  setFormData({ ...formData, discountType: value })
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                  <SelectItem value="FIXED">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Save 10% on your subscription"
              disabled={loading}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="discountValue">
                Discount Value * {formData.discountType === "PERCENTAGE" ? "(%)" : "($)"}
              </Label>
              <Input
                id="discountValue"
                type="number"
                step={formData.discountType === "PERCENTAGE" ? "1" : "0.01"}
                min="0"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                placeholder={formData.discountType === "PERCENTAGE" ? "10" : "10.00"}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expires At *</Label>
              <Input
                id="expiresAt"
                type="datetime-local"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="minAmount">Minimum Amount ($)</Label>
              <Input
                id="minAmount"
                type="number"
                step="0.01"
                min="0"
                value={formData.minAmount}
                onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                placeholder="50.00"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxDiscount">Max Discount ($)</Label>
              <Input
                id="maxDiscount"
                type="number"
                step="0.01"
                min="0"
                value={formData.maxDiscount}
                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                placeholder="20.00"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="usageLimit">Usage Limit</Label>
              <Input
                id="usageLimit"
                type="number"
                min="1"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                placeholder="100"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="isActive">Status</Label>
              <Select
                value={formData.isActive ? "active" : "inactive"}
                onValueChange={(value) =>
                  setFormData({ ...formData, isActive: value === "active" })
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                coupon ? "Update" : "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function CouponsPageContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10, total: 0, pages: 0 })
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState(searchParams.get("isActive") || "all")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null)
  const [deleteCoupon, setDeleteCoupon] = useState<Coupon | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const page = Number(searchParams.get("page")) || 1
  const limit = 10

  const loadCoupons = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = { page, limit }
      if (activeFilter !== "all") {
        params.isActive = activeFilter === "active" ? "true" : "false"
      }

      const result = await fetchCoupons(params)
      setCoupons(result.data)
      setMeta(result.meta || { page, limit, total: 0, pages: 0 })
    } catch (error: any) {
      toast.error(error.message || "Failed to load coupons")
    } finally {
      setLoading(false)
    }
  }, [page, activeFilter])

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
      loadCoupons()
    }
  }, [status, session, router, loadCoupons])

  const handleFilterChange = (value: string) => {
    setActiveFilter(value)
    const params = new URLSearchParams()
    params.set("isActive", value)
    params.set("page", "1")
    router.push(`/dashboard/coupon?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`/dashboard/coupon?${params.toString()}`)
  }

  const handleDelete = async () => {
    if (!deleteCoupon) return

    const couponId = deleteCoupon.id || deleteCoupon._id
    if (!couponId) return

    setDeletingId(couponId)
    try {
      const res = await fetch(`/api/coupons/${couponId}`, {
        method: "DELETE",
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.message || "Failed to delete coupon")
      }

      toast.success("Coupon deleted successfully")
      setDeleteCoupon(null)
      loadCoupons()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete coupon")
    } finally {
      setDeletingId(null)
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
              <Ticket className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Coupon Management
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Create and manage discount coupons
              </p>
            </div>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Coupon
          </Button>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-md p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Filter</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="space-y-2 flex-1 max-w-xs">
              <Label>Status</Label>
              <Select value={activeFilter} onValueChange={handleFilterChange}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Coupons</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Coupons Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 sm:p-12 text-center">
            <Ticket className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-muted-foreground">
              No coupons found. {activeFilter !== "all" && "Try adjusting your filter."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-hidden rounded-xl border border-border/50 bg-card/30 backdrop-blur-md">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 backdrop-blur-sm border-b border-border/50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Code</th>
                    <th className="text-left p-4 font-semibold">Description</th>
                    <th className="text-left p-4 font-semibold">Discount</th>
                    <th className="text-left p-4 font-semibold">Conditions</th>
                    <th className="text-left p-4 font-semibold">Expires</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-right p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => {
                    const couponId = coupon.id || coupon._id || ""
                    return (
                      <tr
                        key={couponId}
                        className="border-t border-border/30 hover:bg-muted/20 transition-colors"
                      >
                        <td className="p-4">
                          <div className="font-mono font-semibold text-primary">{coupon.code}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">{coupon.description || "—"}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {coupon.discountType === "PERCENTAGE" ? (
                              <>
                                <Percent className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{coupon.discountValue}%</span>
                              </>
                            ) : (
                              <>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{formatCurrency(coupon.discountValue)}</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-xs space-y-1 text-muted-foreground">
                            {coupon.minAmount && (
                              <div>Min: {formatCurrency(coupon.minAmount)}</div>
                            )}
                            {coupon.maxDiscount && (
                              <div>Max: {formatCurrency(coupon.maxDiscount)}</div>
                            )}
                            {coupon.usageLimit && (
                              <div>Limit: {coupon.usageLimit} uses</div>
                            )}
                            {!coupon.minAmount && !coupon.maxDiscount && !coupon.usageLimit && "—"}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span className="text-xs">{formatDate(coupon.expiresAt)}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          {coupon.isActive ? (
                            <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditCoupon(coupon)}
                              className="h-8 gap-1.5"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeleteCoupon(coupon)}
                              disabled={deletingId === couponId}
                              className="h-8 gap-1.5"
                            >
                              {deletingId === couponId ? (
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
              {coupons.map((coupon) => {
                const couponId = coupon.id || coupon._id || ""
                return (
                  <div
                    key={couponId}
                    className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-md p-4 sm:p-5 space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-mono font-semibold text-lg text-primary">{coupon.code}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{coupon.description || "No description"}</p>
                        </div>
                        {coupon.isActive ? (
                          <Badge className="bg-green-500/10 text-green-600 dark:text-green-400">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-red-500/10 text-red-600 dark:text-red-400">
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-1.5 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          {coupon.discountType === "PERCENTAGE" ? (
                            <>
                              <Percent className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="font-medium">{coupon.discountValue}% discount</span>
                            </>
                          ) : (
                            <>
                              <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="font-medium">{formatCurrency(coupon.discountValue)} discount</span>
                            </>
                          )}
                        </div>
                        {coupon.minAmount && (
                          <div className="text-muted-foreground">
                            Min purchase: {formatCurrency(coupon.minAmount)}
                          </div>
                        )}
                        {coupon.maxDiscount && (
                          <div className="text-muted-foreground">
                            Max discount: {formatCurrency(coupon.maxDiscount)}
                          </div>
                        )}
                        {coupon.usageLimit && (
                          <div className="text-muted-foreground">
                            Usage limit: {coupon.usageLimit} times
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          Expires: {formatDate(coupon.expiresAt)}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/30 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditCoupon(coupon)}
                        className="flex-1 gap-2"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteCoupon(coupon)}
                        disabled={deletingId === couponId}
                        className="flex-1 gap-2"
                      >
                        {deletingId === couponId ? (
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

      {/* Create/Edit Dialog */}
      <CouponFormDialog
        open={createDialogOpen || !!editCoupon}
        onOpenChange={(open) => {
          if (!open) {
            setCreateDialogOpen(false)
            setEditCoupon(null)
          }
        }}
        coupon={editCoupon || undefined}
        onSuccess={loadCoupons}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteCoupon} onOpenChange={(open) => !open && setDeleteCoupon(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete coupon <strong>{deleteCoupon?.code}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              {deletingId ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

export default function CouponsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <CouponsPageContent />
    </Suspense>
  )
}


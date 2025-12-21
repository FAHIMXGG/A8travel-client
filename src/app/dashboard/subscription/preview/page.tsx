"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import toast from "react-hot-toast"
import {
  Check,
  Loader2,
  ArrowLeft,
  CreditCard,
  Tag,
  X,
  AlertCircle,
} from "lucide-react"

interface CouponData {
  code: string
  description: string
  discountType: "PERCENTAGE" | "FIXED"
  discountValue: number
}

interface CouponValidationResponse {
  success: boolean
  data?: {
    coupon: CouponData
    originalAmount: number
    discountAmount: number
    finalAmount: number
  }
  message?: string
}

function PaymentPreviewContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null)
  const [couponError, setCouponError] = useState("")
  const [discountAmount, setDiscountAmount] = useState(0)
  const [finalAmount, setFinalAmount] = useState(0)

  // Get plan details from URL params
  const planId = searchParams.get("planId")
  const planName = searchParams.get("planName")
  const planPrice = searchParams.get("planPrice")
  const planDuration = searchParams.get("planDuration")
  const planCurrency = searchParams.get("planCurrency") || "USD"

  const originalAmount = planPrice ? parseInt(planPrice) * 100 : 0 // Convert to cents

  useEffect(() => {
    if (!planId || !planName || !planPrice || !planDuration) {
      toast.error("Invalid plan details")
      router.push("/dashboard/subscription")
      return
    }

    if (status === "unauthenticated") {
      toast.error("Please log in to continue")
      router.push("/login")
      return
    }

    // Initialize final amount
    setFinalAmount(originalAmount)
  }, [planId, planName, planPrice, planDuration, status, router, originalAmount])

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code")
      return
    }

    setIsValidatingCoupon(true)
    setCouponError("")

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.trim().toUpperCase(),
          amount: originalAmount,
        }),
      })

      const data: CouponValidationResponse = await res.json()

      if (!res.ok || !data.success) {
        setCouponError(data.message || "Invalid coupon code")
        setAppliedCoupon(null)
        setDiscountAmount(0)
        setFinalAmount(originalAmount)
        return
      }

      if (data.data) {
        setAppliedCoupon(data.data.coupon)
        setDiscountAmount(data.data.discountAmount)
        setFinalAmount(data.data.finalAmount)
        toast.success("Coupon applied successfully!")
      }
    } catch (e: any) {
      console.error("Coupon validation error:", e)
      setCouponError("Failed to validate coupon. Please try again.")
      setAppliedCoupon(null)
      setDiscountAmount(0)
      setFinalAmount(originalAmount)
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponCode("")
    setAppliedCoupon(null)
    setDiscountAmount(0)
    setFinalAmount(originalAmount)
    setCouponError("")
  }

  const handleProceedToPayment = async () => {
    if (!session?.user?.id) {
      toast.error("Please log in to continue")
      router.push("/login")
      return
    }

    try {
      setIsLoading(true)

      // Create payment intent with coupon if applied
      const res = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: originalAmount,
          currency: planCurrency.toLowerCase(),
          subscriptionDays: parseInt(planDuration || "30"),
          couponCode: appliedCoupon?.code || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Failed to create payment session")
      }

      if (data?.data?.checkoutUrl) {
        // Store session ID and plan details for confirmation after redirect
        if (data?.data?.sessionId) {
          const storageData = {
            sessionId: data.data.sessionId,
            subscriptionDays: planDuration,
            planId: planId,
            timestamp: Date.now().toString(),
          }
          sessionStorage.setItem("paymentSessionId", data.data.sessionId)
          sessionStorage.setItem("subscriptionDays", planDuration || "30")
          sessionStorage.setItem("paymentPlanData", JSON.stringify(storageData))
        }

        // Redirect to checkout
        window.location.href = data.data.checkoutUrl
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (e: any) {
      console.error("Payment error:", e)
      toast.error(e.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: planCurrency,
    }).format(amount / 100)
  }

  if (status === "loading") {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (!planId || !planName || !planPrice || !planDuration) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-headline font-bold">Payment Preview</h1>
          <p className="text-muted-foreground">Review your subscription details</p>
        </div>
      </div>

      {/* Payment Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Details
          </CardTitle>
          <CardDescription>Review your subscription plan and payment information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan Summary */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
              <div>
                <h3 className="font-semibold">{planName}</h3>
                <p className="text-sm text-muted-foreground">
                  {planDuration} days subscription
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{formatCurrency(originalAmount)}</p>
              </div>
            </div>
          </div>

          {/* Coupon Section */}
          <div className="space-y-3 pt-4 border-t">
            <Label className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Coupon Code (Optional)
            </Label>
            {appliedCoupon ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 rounded-lg border bg-emerald-500/10 border-emerald-500/20">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
                        {appliedCoupon.code}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {appliedCoupon.description}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {appliedCoupon.discountType === "PERCENTAGE"
                        ? `${appliedCoupon.discountValue}% off`
                        : `${formatCurrency(appliedCoupon.discountValue * 100)} off`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveCoupon}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value)
                    setCouponError("")
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleValidateCoupon()
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={handleValidateCoupon}
                  disabled={isValidatingCoupon || !couponCode.trim()}
                  variant="outline"
                >
                  {isValidatingCoupon ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>
            )}
            {couponError && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {couponError}
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(originalAmount)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="text-emerald-500">-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t font-semibold text-lg">
              <span>Total</span>
              <span>{formatCurrency(finalAmount)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full"
            size="lg"
            onClick={handleProceedToPayment}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Proceed to Payment
                <CreditCard className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            You will be redirected to a secure payment page to complete your purchase
          </p>
        </CardFooter>
      </Card>

      {/* Security Notice */}
      <Card className="border-primary/10 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Secure Payment</p>
              <p className="text-xs text-muted-foreground">
                Your payment information is encrypted and processed securely. We never store your
                credit card details.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentPreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      }
    >
      <PaymentPreviewContent />
    </Suspense>
  )
}

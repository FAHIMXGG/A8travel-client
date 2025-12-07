"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2, XCircle } from "lucide-react"
import toast from "react-hot-toast"

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status, update } = useSession()
  const [isConfirming, setIsConfirming] = useState(true)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const confirmPayment = async () => {
      // If user is logged out, send them to login then back here
      if (status === "unauthenticated") {
        setError("Please log in to complete payment confirmation")
        const current = window.location.href
        router.push(`/login?callbackUrl=${encodeURIComponent(current)}`)
        setIsConfirming(false)
        return
      }

      if (status !== "authenticated") return

      // Get session_id from URL (Stripe redirects with this)
      const sessionId = searchParams.get("session_id")
      
      // Get subscription days from URL or sessionStorage (stored before redirect)
      let subscriptionDays = searchParams.get("subscriptionDays") || sessionStorage.getItem("subscriptionDays")
      
      // Try to get from stored plan data if direct storage not available
      if (!subscriptionDays) {
        const planDataStr = sessionStorage.getItem("paymentPlanData")
        if (planDataStr) {
          try {
            const planData = JSON.parse(planDataStr)
            subscriptionDays = planData.subscriptionDays
          } catch (e) {
            console.error("Failed to parse plan data:", e)
          }
        }
      }

      console.log("Payment success page - sessionId:", sessionId)
      console.log("Payment success page - subscriptionDays:", subscriptionDays)
      console.log("Payment success page - all URL params:", Array.from(searchParams.entries()))

      if (!sessionId) {
        setError("No payment session ID found in URL. Please contact support if you've been charged.")
        setIsConfirming(false)
        return
      }

      // We need subscriptionDays for the API call - use 30 as default if not found
      const finalSubscriptionDays = subscriptionDays ? parseInt(subscriptionDays, 10) : 30
      
      if (!subscriptionDays) {
        console.warn("Subscription days not found, using default:", finalSubscriptionDays)
        // Continue with default - backend should ideally have this info
      }

      // Prevent duplicate confirmation
      const confirmedKey = `payment_confirmed_${sessionId}`
      if (sessionStorage.getItem(confirmedKey)) {
        setIsConfirmed(true)
        setIsConfirming(false)
        // Redirect after a moment
        setTimeout(() => {
          router.push("/dashboard/subscription")
        }, 2000)
        return
      }

      try {
        setIsConfirming(true)
        
        const res = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            subscriptionDays: finalSubscriptionDays,
          }),
        })
        
        console.log("Payment confirm API response:", res.status)

        const data = await res.json()
        console.log("Payment confirm response data:", data)

        if (res.ok && data?.success) {
          setIsConfirmed(true)
          sessionStorage.setItem(confirmedKey, "true")
          sessionStorage.removeItem("paymentSessionId")
          sessionStorage.removeItem("subscriptionDays")
          
          // Fetch updated user profile from backend
          try {
            const profileRes = await fetch("/api/profile")
            const profileData = await profileRes.json()
            
            if (profileRes.ok && profileData?.success && profileData?.data) {
              const updatedUser = profileData.data
              
              console.log("Fetched updated user data:", {
                subscriptionStatus: updatedUser.subscriptionStatus,
                subscriptionExpiresAt: updatedUser.subscriptionExpiresAt,
              })
              
              // Update session with the fetched user data - trigger backend refresh
              await update({
                refreshFromBackend: true,
                subscriptionStatus: updatedUser.subscriptionStatus || "NONE",
                subscriptionExpiresAt: updatedUser.subscriptionExpiresAt || null,
              })
              
              // Wait a moment for session to update
              await new Promise((resolve) => setTimeout(resolve, 1000))
              
              // Force a hard refresh to ensure session is updated
              toast.success("Subscription activated successfully!")
              
              setTimeout(() => {
                window.location.href = "/dashboard/subscription"
              }, 1000)
            } else {
              // If profile fetch fails, still try to refresh session
              await update({ refreshFromBackend: true })
              toast.success("Subscription activated successfully!")
              
              setTimeout(() => {
                window.location.href = "/dashboard/subscription"
              }, 1500)
            }
          } catch (profileError) {
            console.error("Failed to fetch updated profile:", profileError)
            // Still proceed and try to refresh session
            await update({ refreshFromBackend: true })
            toast.success("Subscription activated successfully!")
            
            setTimeout(() => {
              window.location.href = "/dashboard/subscription"
            }, 1500)
          }
        } else {
          setError(data?.message || "Failed to confirm payment")
          toast.error(data?.message || "Failed to confirm payment")
        }
      } catch (e: any) {
        console.error("Payment confirmation error:", e)
        const errorMessage = e.message || "Failed to confirm payment. Please contact support."
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsConfirming(false)
      }
    }

    confirmPayment()
  }, [status, searchParams, router, update])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {isConfirming && (
            <>
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <CardTitle>Confirming Payment</CardTitle>
              <CardDescription>Please wait while we confirm your subscription...</CardDescription>
            </>
          )}
          
          {isConfirmed && (
            <>
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <CardTitle className="text-emerald-500">Payment Successful!</CardTitle>
              <CardDescription>Your subscription has been activated successfully.</CardDescription>
            </>
          )}
          
          {error && (
            <>
              <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
              <CardTitle className="text-red-500">Payment Confirmation Failed</CardTitle>
              <CardDescription>{error}</CardDescription>
            </>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isConfirmed && (
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Redirecting you to your subscription page...
              </p>
            </div>
          )}
          
          {error && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                If you&apos;ve been charged, please contact support with your payment session ID.
              </p>
              <Button
                onClick={() => router.push("/dashboard/subscription")}
                className="w-full"
                variant="outline"
              >
                Go to Subscription Page
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}


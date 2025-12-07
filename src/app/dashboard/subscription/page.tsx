"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import toast from "react-hot-toast"
import {
  Crown,
  Check,
  Sparkles,
  MapPin,
  Users,
  MessageSquare,
  Calendar,
  ShieldCheck,
  Zap,
  Globe,
  Loader2,
  ArrowRight,
} from "lucide-react"

const SUBSCRIPTION_PLANS = [
  {
    id: "monthly",
    name: "Monthly Plan",
    price: 10,
    duration: 30,
    currency: "USD",
    popular: false,
  },
  {
    id: "quarterly",
    name: "Quarterly Plan",
    price: 25,
    duration: 90,
    currency: "USD",
    popular: true,
    savings: "17%",
  },
  {
    id: "yearly",
    name: "Annual Plan",
    price: 100,
    duration: 365,
    currency: "USD",
    popular: false,
    savings: "33%",
  },
]

const BENEFITS = [
  {
    icon: Crown,
    title: "Premium Access",
    description: "Unlock all premium features and exclusive content",
  },
  {
    icon: MapPin,
    title: "Custom Travel Itineraries",
    description: "Get personalized travel routes for every destination",
  },
  {
    icon: Users,
    title: "Priority Support",
    description: "24/7 customer support with faster response times",
  },
  {
    icon: MessageSquare,
    title: "Exclusive Community",
    description: "Join premium traveler groups and networking events",
  },
  {
    icon: Calendar,
    title: "Advanced Planning Tools",
    description: "Access premium trip planning and scheduling features",
  },
  {
    icon: ShieldCheck,
    title: "Verified Badge",
    description: "Get verified status and build trust with other travelers",
  },
  {
    icon: Zap,
    title: "Fast Approval",
    description: "Expedited approval process for bookings and events",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Access travel plans and events worldwide",
  },
]

export default function SubscriptionPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const user = session?.user

  const subscriptionStatus = user?.subscriptionStatus ?? "NONE"
  const isSubscribed = subscriptionStatus === "ACTIVE" || subscriptionStatus === "TRIAL"

  // Refresh session data on mount to ensure we have latest subscription status
  useEffect(() => {
    const refreshSession = async () => {
      if (status === "authenticated" && user?.id) {
        try {
          // Fetch latest user profile
          const profileRes = await fetch("/api/profile")
          const profileData = await profileRes.json()
          
          if (profileRes.ok && profileData?.success && profileData?.data) {
            const updatedUser = profileData.data
            
            // Update session if subscription status changed
            if (updatedUser.subscriptionStatus !== subscriptionStatus) {
              await update({
                subscriptionStatus: updatedUser.subscriptionStatus || "NONE",
                subscriptionExpiresAt: updatedUser.subscriptionExpiresAt || null,
              })
            }
          }
        } catch (error) {
          console.error("Failed to refresh session:", error)
        }
      }
    }
    
    refreshSession()
  }, [status, user?.id, update, subscriptionStatus])

  const handleSubscribe = async (plan: typeof SUBSCRIPTION_PLANS[0]) => {
    if (!session?.user?.id) {
      toast.error("Please log in to subscribe")
      router.push("/login")
      return
    }

    try {
      setIsLoading(true)
      setSelectedPlan(plan.id)

      // Create payment intent
      const res = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: plan.price * 100, // Convert to cents
          currency: plan.currency.toLowerCase(),
          subscriptionDays: plan.duration,
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
            subscriptionDays: plan.duration.toString(),
            planId: plan.id,
            timestamp: Date.now().toString(),
          }
          sessionStorage.setItem("paymentSessionId", data.data.sessionId)
          sessionStorage.setItem("subscriptionDays", plan.duration.toString())
          sessionStorage.setItem("paymentPlanData", JSON.stringify(storageData))
          console.log("Stored payment data:", storageData)
        }

        // Redirect to checkout
        window.location.href = data.data.checkoutUrl
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (e: any) {
      console.error("Subscription error:", e)
      toast.error(e.message || "Something went wrong")
      setSelectedPlan(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Check for payment confirmation on mount
  useEffect(() => {
    if (status !== "authenticated") return

    const urlParams = new URLSearchParams(window.location.search)
    const urlSessionId = urlParams.get("session_id")
    const storedSessionId = sessionStorage.getItem("paymentSessionId")
    const subscriptionDays = sessionStorage.getItem("subscriptionDays")

    // Use URL session_id if available (from Stripe redirect), otherwise use stored one
    const sessionId = urlSessionId || storedSessionId

    if (sessionId && subscriptionDays && !isSubscribed) {
      // Prevent duplicate confirmation
      const confirmedKey = `payment_confirmed_${sessionId}`
      if (sessionStorage.getItem(confirmedKey)) return

      // Confirm payment
      const confirmPayment = async () => {
        try {
          setIsLoading(true)
          const res = await fetch("/api/payments/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId,
              subscriptionDays: parseInt(subscriptionDays, 10),
            }),
          })

          const data = await res.json()

          if (res.ok && data?.success) {
            toast.success("Subscription activated successfully!")
            sessionStorage.setItem(confirmedKey, "true")
            sessionStorage.removeItem("paymentSessionId")
            sessionStorage.removeItem("subscriptionDays")
            // Refresh session to get updated subscription status
            await update()
            router.refresh()
            // Clean URL
            window.history.replaceState({}, "", "/dashboard/subscription")
          } else {
            toast.error(data?.message || "Failed to confirm payment")
          }
        } catch (e: any) {
          console.error("Payment confirmation error:", e)
          toast.error("Failed to confirm payment. Please contact support.")
        } finally {
          setIsLoading(false)
        }
      }

      confirmPayment()
    }
  }, [status, isSubscribed, router, update])

  if (status === "loading") {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <Crown className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Premium Subscription</span>
        </div>
        <h1 className="text-4xl font-bold">Unlock Premium Travel Features</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join thousands of travelers enjoying exclusive benefits and premium features
        </p>
      </div>

      {/* Current Subscription Status */}
      {isSubscribed && (
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-emerald-500" />
              Active Subscription
            </CardTitle>
            <CardDescription>
              Your premium subscription is active. Enjoy all the benefits!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
                  {subscriptionStatus}
                </Badge>
              </div>
              {user?.subscriptionExpiresAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Expires</span>
                  <span className="text-sm font-medium">
                    {new Date(user.subscriptionExpiresAt).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Plans */}
      <div className="grid gap-6 md:grid-cols-3">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={`relative overflow-hidden transition-all hover:shadow-lg ${
              plan.popular ? "border-primary shadow-lg scale-105" : ""
            } ${isSubscribed ? "opacity-75" : ""}`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
                Most Popular
              </div>
            )}
            {plan.savings && (
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="text-xs">
                  Save {plan.savings}
                </Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground"> / {plan.duration} days</span>
              </div>
              <CardDescription>
                ${(plan.price / plan.duration).toFixed(2)} per day
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {BENEFITS.slice(0, 4).map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{benefit.title}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleSubscribe(plan)}
                disabled={isLoading || isSubscribed}
              >
                {isLoading && selectedPlan === plan.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : isSubscribed ? (
                  "Already Subscribed"
                ) : (
                  <>
                    Subscribe Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Benefits Section */}
      <Card className="border-primary/10 bg-gradient-to-br from-background via-background to-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Premium Benefits
          </CardTitle>
          <CardDescription>
            Everything you get with your premium subscription
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((benefit, idx) => {
              const Icon = benefit.icon
              return (
                <div key={idx} className="space-y-3 p-4 rounded-lg border border-border/60 bg-background/50">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* FAQ or Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Why Subscribe?</CardTitle>
          <CardDescription>Common questions about premium membership</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Can I cancel anytime?</h4>
            <p className="text-sm text-muted-foreground">
              Yes, you can cancel your subscription at any time. Your premium benefits will remain active until the end of your current billing period.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">What payment methods do you accept?</h4>
            <p className="text-sm text-muted-foreground">
              We accept all major credit cards and payment methods through our secure payment processor.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Do you offer refunds?</h4>
            <p className="text-sm text-muted-foreground">
              We offer a 30-day money-back guarantee. If you&apos;re not satisfied, contact our support team for a full refund.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


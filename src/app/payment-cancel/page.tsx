"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react"

export default function PaymentCancelPage() {
  const router = useRouter()

  useEffect(() => {
    // Clean up any stored payment data
    sessionStorage.removeItem("paymentSessionId")
    sessionStorage.removeItem("subscriptionDays")
    sessionStorage.removeItem("paymentPlanData")
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
            <XCircle className="h-8 w-8 text-orange-500" />
          </div>
          <CardTitle className="text-orange-500">Payment Cancelled</CardTitle>
          <CardDescription>
            Your payment was cancelled. No charges were made to your account.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              You can return to the subscription page to try again or choose a different plan.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.push("/dashboard/subscription")}
              className="w-full"
              variant="default"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


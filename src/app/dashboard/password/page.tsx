"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useSession } from "next-auth/react"
import { passwordUpdateSchema, type PasswordUpdateInput } from "@/app/lib/validators"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { KeyRound, Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export default function PasswordPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PasswordUpdateInput>({
    resolver: zodResolver(passwordUpdateSchema),
  })

  const onSubmit = async (values: PasswordUpdateInput) => {
    try {
      const res = await fetch("/api/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      })

      const data = await res.json()
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Password update failed")
      }

      toast.success("Password updated successfully!")
      reset()
      router.refresh()
    } catch (e: any) {
      toast.error(e.message || "Something went wrong")
    }
  }

  if (status === "loading") {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden border border-primary/10 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="pointer-events-none absolute -right-32 top-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <CardHeader className="relative space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <KeyRound className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold">Update Password</CardTitle>
              <CardDescription>Change your account password to keep it secure</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-sm font-medium">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter your current password"
                    className="h-11 bg-background/50 backdrop-blur-sm pr-10"
                    {...register("currentPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-xs text-destructive font-medium mt-1">{errors.currentPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter your new password (min 6 characters)"
                    className="h-11 bg-background/50 backdrop-blur-sm pr-10"
                    {...register("newPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-xs text-destructive font-medium mt-1">{errors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    className="h-11 bg-background/50 backdrop-blur-sm pr-10"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive font-medium mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-amber-500 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Password Requirements</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Minimum 6 characters</li>
                    <li>Use a strong, unique password</li>
                    <li>Don&apos;t reuse passwords from other accounts</li>
                  </ul>
                </div>
              </div>
            </div>

            <CardFooter className="px-0 pt-4">
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Updating...
                  </span>
                ) : (
                  "Update Password"
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { registerSchema, type RegisterFormValues, type RegisterData } from "@/app/lib/validators"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),

  })

  const onSubmit = async (values: RegisterFormValues) => {
    const payload: RegisterData = registerSchema.parse(values)
    console.log(payload)

    try {
      const res = await fetch("/api/proxy/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Registration failed")
      }
      toast.success("Registered successfully! Please log in.")
      router.push("/login")
    } catch (e: any) {
      toast.error(e.message || "Something went wrong")
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-8 sm:p-6 md:p-8 bg-gradient-to-br from-[#FFFFFF] via-[#FFFFFF] to-[#FFFFFF] dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 overflow-hidden">
      <div className="w-full max-w-[90%] sm:max-w-md relative">
        {/* Decorative blur elements - hidden on mobile */}
        <div className="hidden sm:block absolute -top-16 -left-16 md:-top-5 md:-left-24 w-32 h-32 md:w-48 md:h-48 bg-primary/20 rounded-full blur-3xl" />
        <div className="hidden sm:block absolute -bottom-16 -right-16 md:-bottom-24 md:-right-24 w-32 h-32 md:w-48 md:h-48 bg-accent/20 rounded-full blur-3xl" />

        {/* Glassmorphism card */}
        <div className="md:-top-16 relative backdrop-blur-xl bg-white/70 dark:bg-neutral-900/70 border border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 space-y-5 sm:space-y-6">
          {/* Subtle inner glow */}
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />

          <div className="relative z-10 space-y-5 sm:space-y-6">
            <div className="space-y-1.5 sm:space-y-2 text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                Create an account
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Sign up to get started</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="name" className="text-xs sm:text-sm font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="h-10 sm:h-11 text-sm sm:text-base bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border-neutral-200/50 dark:border-neutral-700/50 focus:border-primary/50 focus:ring-primary/20"
                  {...register("name")}
                />
                {errors.name && <p className="text-xs text-destructive font-medium mt-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="h-10 sm:h-11 text-sm sm:text-base bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border-neutral-200/50 dark:border-neutral-700/50 focus:border-primary/50 focus:ring-primary/20"
                  {...register("email")}
                />
                {errors.email && <p className="text-xs text-destructive font-medium mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="text-xs sm:text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-10 sm:h-11 text-sm sm:text-base bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border-neutral-200/50 dark:border-neutral-700/50 focus:border-primary/50 focus:ring-primary/20"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-destructive font-medium mt-1">{errors.password.message}</p>
                )}
              </div>



              {/* Hidden role field */}
              

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 sm:h-12 text-sm sm:text-base bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 mt-6"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            <div className="text-center text-xs sm:text-sm text-muted-foreground pt-2">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-primary hover:underline underline-offset-4 transition-colors"
              >
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

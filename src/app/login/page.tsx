"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginInput, forgotPasswordSchema, resetPasswordSchema, type ForgotPasswordInput, type ResetPasswordInput } from "@/app/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OTPInput } from "@/components/ui/otp-input";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<"email" | "reset">("email");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpValue, setOtpValue] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerForgotPassword,
    handleSubmit: handleSubmitForgotPassword,
    formState: { errors: forgotPasswordErrors, isSubmitting: isSubmittingForgotPassword },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const {
    register: registerResetPassword,
    handleSubmit: handleSubmitResetPassword,
    formState: { errors: resetPasswordErrors, isSubmitting: isSubmittingResetPassword },
    setValue: setResetPasswordValue,
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      otp: "",
    },
  });


  const onSubmit = async (values: LoginInput) => {
    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (res?.ok) {
        await fetch("/api/auth/sync-cookie", { method: "POST" });
        toast.success("Logged in successfully");
        router.push("/");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  const onForgotPasswordSubmit = async (values: ForgotPasswordInput) => {
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await res.json();
      if (res.ok) {
        setForgotPasswordEmail(values.email);
        setResetPasswordValue("email", values.email);
        setOtpValue("");
        setResetPasswordValue("otp", "");
        setForgotPasswordStep("reset");
        toast.success("OTP sent to your email");
      } else {
        toast.error(data?.message || "Failed to send OTP");
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  const onResetPasswordSubmit = async (values: ResetPasswordInput) => {
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotPasswordEmail || values.email,
          otp: values.otp,
          newPassword: values.newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Password reset successfully");
        setForgotPasswordOpen(false);
        setForgotPasswordStep("email");
        setForgotPasswordEmail("");
      } else {
        toast.error(data?.message || "Failed to reset password");
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-8 sm:p-6 md:p-8 bg-gradient-to-br from-neutral-[#FFFFFF] via-[#FFFFFF] to-[#FFFFFF] dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 overflow-hidden">
      <div className="w-full max-w-[90%] sm:max-w-md relative">
        <div className="hidden sm:block absolute -top-16 -left-16 md:-top-24 md:-left-24 w-32 h-32 md:w-48 md:h-48 bg-primary/20 rounded-full blur-3xl" />
        <div className="hidden sm:block absolute -bottom-16 -right-16 md:-bottom-24 md:-right-24 w-32 h-32 md:w-48 md:h-48 bg-accent/20 rounded-full blur-3xl" />

        <div className="md:-top-24 relative backdrop-blur-xl bg-white/70 dark:bg-neutral-900/70 border border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 space-y-5 sm:space-y-6">
          {/* Subtle inner glow */}
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />

          <div className="relative z-10 space-y-5 sm:space-y-6">
            <div className="space-y-1.5 sm:space-y-2 text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                Welcome back
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-5"
            >
              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs sm:text-sm font-medium"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="h-10 sm:h-11 text-sm sm:text-base bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border-neutral-200/50 dark:border-neutral-700/50 focus:border-primary/50 focus:ring-primary/20"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive font-medium mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-xs sm:text-sm font-medium"
                  >
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(true)}
                    className="text-xs text-primary hover:underline underline-offset-4 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-10 sm:h-11 text-sm sm:text-base bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border-neutral-200/50 dark:border-neutral-700/50 focus:border-primary/50 focus:ring-primary/20"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-destructive font-medium mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 sm:h-12 text-sm sm:text-base bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 mt-6"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="text-center text-xs sm:text-sm text-muted-foreground pt-2">
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="font-medium text-primary hover:underline underline-offset-4 transition-colors"
              >
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={forgotPasswordOpen}
        onOpenChange={(open) => {
          setForgotPasswordOpen(open);
          if (!open) {
            setForgotPasswordStep("email");
            setForgotPasswordEmail("");
            setOtpValue("");
            setShowNewPassword(false);
            setShowConfirmPassword(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {forgotPasswordStep === "email" ? "Forgot Password" : "Reset Password"}
            </DialogTitle>
            <DialogDescription>
              {forgotPasswordStep === "email"
                ? "Enter your email address and we'll send you an OTP to reset your password."
                : "Enter the OTP sent to your email and your new password."}
            </DialogDescription>
          </DialogHeader>

          {forgotPasswordStep === "email" ? (
            <form
              onSubmit={handleSubmitForgotPassword(onForgotPasswordSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="forgot-email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="you@example.com"
                  className="h-10 text-sm"
                  {...registerForgotPassword("email")}
                />
                {forgotPasswordErrors.email && (
                  <p className="text-xs text-destructive font-medium mt-1">
                    {forgotPasswordErrors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmittingForgotPassword}
                className="w-full"
              >
                {isSubmittingForgotPassword ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>
          ) : (
            <form
              onSubmit={handleSubmitResetPassword(onResetPasswordSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label className="text-sm font-medium text-center block">
                  Enter OTP
                </Label>
                <OTPInput
                  value={otpValue}
                  onChange={(value) => {
                    setOtpValue(value);
                    setResetPasswordValue("otp", value);
                  }}
                  length={6}
                  error={!!resetPasswordErrors.otp}
                />
                {resetPasswordErrors.otp && (
                  <p className="text-xs text-destructive font-medium mt-1 text-center">
                    {resetPasswordErrors.otp.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reset-password" className="text-sm font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="reset-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-10 text-sm pr-10"
                    {...registerResetPassword("newPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {resetPasswordErrors.newPassword && (
                  <p className="text-xs text-destructive font-medium mt-1">
                    {resetPasswordErrors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reset-confirm-password" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="reset-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-10 text-sm pr-10"
                    {...registerResetPassword("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {resetPasswordErrors.confirmPassword && (
                  <p className="text-xs text-destructive font-medium mt-1">
                    {resetPasswordErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setForgotPasswordStep("email");
                    setForgotPasswordEmail("");
                  }}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingResetPassword}
                  className="flex-1"
                >
                  {isSubmittingResetPassword ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Resetting...
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

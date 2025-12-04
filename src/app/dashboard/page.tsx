"use client"

import Link from "next/link"
import { FileText, Eye, TrendingUp, Plus, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardOverviewPage() {
  const stats = [
    {
      label: "Total Posts",
      value: "17",
      icon: FileText,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
    },
    {
      label: "Total Views",
      value: "170",
      icon: Eye,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
    },
    {
      label: "This Week",
      value: "20",
      icon: TrendingUp,
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-500/10 to-orange-500/10",
    },
  ]

  return (
    <div className="relative min-h-screen">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background via-background to-amber-500/5" />

      {/* Decorative blur elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl"
          style={{ animation: "float 20s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
          style={{
            animation: "float 25s ease-in-out infinite reverse",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
                Welcome back! Here's what's happening with your blog.
              </p>
            </div>

            <Button
              asChild
              size="default"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 w-full sm:w-auto"
            >
              <Link href="/dashboard/blogs/new">
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats - Static data */}
        <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 sm:p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />

              <div className="relative space-y-3">
                {/* Icon */}
                <div
                  className={`inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-gradient-to-br ${stat.gradient} p-2 sm:p-2.5`}
                >
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>

                {/* Value */}
                <div className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>

                {/* Label */}
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">Quick Actions</h2>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Button
              asChild
              variant="outline"
              className="h-auto p-4 sm:p-6 justify-start border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-white/20"
            >
              <Link href="/dashboard/blogs/new">
                <div className="flex items-start gap-3 sm:gap-4 w-full">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
                    <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm sm:text-base">Create Post</div>
                    <div className="text-xs text-muted-foreground mt-1">Write a new blog post</div>
                  </div>
                </div>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto p-4 sm:p-6 justify-start border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-white/20"
            >
              <Link href="/dashboard/blogs">
                <div className="flex items-start gap-3 sm:gap-4 w-full">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm sm:text-base">All Posts</div>
                    <div className="text-xs text-muted-foreground mt-1">Manage your blog posts</div>
                  </div>
                </div>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto p-4 sm:p-6 justify-start border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-white/20"
            >
              <Link href="/dashboard/blogs">
                <div className="flex items-start gap-3 sm:gap-4 w-full">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                    <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm sm:text-base">View All Posts</div>
                    <div className="text-xs text-muted-foreground mt-1">Browse all your content</div>
                  </div>
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(30px, -30px) rotate(5deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(-5deg);
          }
        }
      `}</style>
    </div>
  )
}

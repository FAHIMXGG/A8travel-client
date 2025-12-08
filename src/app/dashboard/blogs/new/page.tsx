"use client"

import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import BlogForm from "@/components/dashboard/blog-form"

export default function NewBlogPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 600)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20 sm:p-4 md:p-6 lg:p-8">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-40 w-40 animate-pulse rounded-full bg-amber-300/40 blur-3xl sm:h-60 sm:w-60 md:h-80 md:w-80" />
        <div className="absolute -bottom-20 -right-20 h-40 w-40 animate-pulse rounded-full bg-orange-300/40 blur-3xl animation-delay-1000 sm:h-60 sm:w-60 md:h-80 md:w-80" />
        <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-amber-200/30 blur-3xl animation-delay-2000 sm:h-48 sm:w-48" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="">
          <Link
            href="/dashboard/blogs"
            className="group inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-stone-600 transition-all hover:bg-white/60 hover:text-stone-900 hover:shadow-sm  sm:text-base"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 sm:h-5 sm:w-5" />
            Back to All Posts
          </Link>

          {/* {isLoading ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="h-8 w-56 animate-pulse rounded-xl bg-gradient-to-r from-stone-200/60 to-stone-300/60 backdrop-blur-sm sm:h-10 sm:w-72 md:h-12 md:w-80" />
              <div className="h-5 w-72 animate-pulse rounded-lg bg-gradient-to-r from-stone-200/60 to-stone-300/60 backdrop-blur-sm sm:h-6 sm:w-96 md:w-[28rem]" />
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-2 shadow-lg sm:p-2.5">
                  <Sparkles className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </div>
                <h1 className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-700 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl">
                  Create New Post
                </h1>
              </div>
              <p className="ml-0 text-base text-stone-600 sm:ml-14 sm:text-lg md:text-xl">
                Share your thoughts and ideas with the world
              </p>
            </div>
          )} */}
        </div>

        {/* Blog Form */}
        <BlogForm isLoading={isLoading} />
      </div>
    </div>
  )
}

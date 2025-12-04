"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  blogCreateSchema,
  type BlogCreateFormValues,
  type BlogCreateValues,
} from "@/app/lib/blog-validators"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import RichTextEditor from "@/components/rich-text-editor"
import { useRouter } from "next/navigation"
import ThumbnailUploader from "@/components/thumbnail-uploader"
import { FileText, ImageIcon, PenSquare, AlignLeft, Tag, FolderOpen, Star, Loader2 } from "lucide-react"

/** ----------------- SKELETON (responsive) ----------------- */
function BlogFormSkeleton() {
  return (
    <div className="w-full mx-auto max-w-3xl sm:max-w-4xl px-4 py-6 sm:py-8 lg:py-10">
      <div className="relative rounded-xl sm:rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-6 lg:p-8 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70">
        {/* Decorative gradient only on md+ to reduce clutter on phones */}
        <div className="pointer-events-none absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 md:block hidden" />
        <div className="relative">
          <div className="mb-5 sm:mb-7 lg:mb-8 flex items-center gap-3 sm:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-6 sm:h-7 w-40 sm:w-56 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
              <div className="h-4 w-48 sm:w-64 rounded bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
            </div>
          </div>

          <div className="space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <div className="h-4 w-16 rounded bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
              <div className="h-11 sm:h-12 w-full rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
              <div className="h-36 sm:h-44 lg:h-52 w-full rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
              <div className="h-56 sm:h-64 lg:h-72 w-full rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
              <div className="h-11 sm:h-12 w-full rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div className="space-y-2">
                <div className="h-4 w-24 rounded bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
                <div className="h-11 sm:h-12 w-full rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-28 rounded bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
                <div className="h-11 sm:h-12 w-full rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/60 dark:bg-gray-800/50 p-3 sm:p-4">
              <div className="h-5 w-5 rounded bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
              <div className="h-4 w-40 rounded bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
            </div>

            <div className="pt-2">
              <div className="h-12 w-full rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** ----------------- FORM (responsive) ----------------- */
export default function BlogForm({
  initial,
  isLoading = false,
}: {
  initial?: Partial<BlogCreateFormValues>
  isLoading?: boolean
}) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    control,
  } = useForm<BlogCreateFormValues>({
    resolver: zodResolver(blogCreateSchema),
    defaultValues: {
      title: initial?.title ?? "",
      content: initial?.content ?? "",
      excerpt: initial?.excerpt ?? "",
      thumbnailUrl: (initial?.thumbnailUrl as string | undefined) ?? "",
      isFeatured: initial?.isFeatured ?? false,
      tags: initial?.tags ?? [],
      categories: initial?.categories ?? [],
    },
  })

  const onSubmit = async (values: BlogCreateFormValues) => {
    const payload: BlogCreateValues = blogCreateSchema.parse(values)
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || data?.success === false) throw new Error(data?.message || "Failed to create post")
      toast.success("Post created")
      router.push("/dashboard/blogs")
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error creating post")
    }
  }

  if (isLoading) return <BlogFormSkeleton />

  return (
    <div className="w-full mx-auto md:mx-0 max-w-3xl sm:max-w-4xl md:px-4 py-6 sm:py-8 lg:py-10">
      <div className="relative rounded-xl sm:rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-6 lg:p-8 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70">
        {/* Decorative gradient reduced on small screens */}
        <div className="pointer-events-none absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 md:block hidden" />

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-5 sm:mb-7 lg:mb-8 flex items-center gap-3 sm:gap-4">
            <div className="rounded-lg sm:rounded-xl p-2 sm:p-2.5 bg-primary/10">
              <PenSquare className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Create New Post</h2>
              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">Share your thoughts with the world</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6 lg:space-y-7">
            {/* Title */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2 text-sm sm:text-base font-semibold">
                <FileText className="h-4 w-4 text-primary" />
                Title
              </Label>
              <Input
                id="title"
                placeholder="Enter an engaging title..."
                className="h-11 sm:h-12 text-sm sm:text-base backdrop-blur-sm bg-white/60 dark:bg-gray-800/50 border-white/20 focus:border-primary/50"
                {...register("title")}
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "title-error" : undefined}
              />
              {errors.title && (
                <p id="title-error" className="text-xs sm:text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Thumbnail */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="flex items-center gap-2 text-sm sm:text-base font-semibold">
                <ImageIcon className="h-4 w-4 text-primary" />
                Thumbnail
              </Label>
              <input type="hidden" {...register("thumbnailUrl")} />
              <Controller
                name="thumbnailUrl"
                control={control}
                render={({ field }) => (
                  <div className="rounded-lg sm:rounded-xl border border-white/20 p-3 sm:p-4 backdrop-blur-sm bg-white/60 dark:bg-gray-800/50">
                    <ThumbnailUploader value={field.value || ""} onChange={(url) => field.onChange(url ?? "")} />
                  </div>
                )}
              />
              {errors.thumbnailUrl && (
                <p className="text-xs sm:text-sm text-red-500">{errors.thumbnailUrl.message as string}</p>
              )}
            </div>

            {/* Content */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="flex items-center gap-2 text-sm sm:text-base font-semibold">
                <PenSquare className="h-4 w-4 text-primary" />
                Content
              </Label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <div className="overflow-hidden rounded-lg sm:rounded-xl border border-white/20 backdrop-blur-sm bg-white/60 dark:bg-gray-800/50">
                    <RichTextEditor value={field.value} onChange={field.onChange} />
                  </div>
                )}
              />
              {errors.content && <p className="text-xs sm:text-sm text-red-500">{errors.content.message}</p>}
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="excerpt" className="flex items-center gap-2 text-sm sm:text-base font-semibold">
                <AlignLeft className="h-4 w-4 text-primary" />
                Excerpt
              </Label>
              <Input
                id="excerpt"
                placeholder="Write a brief summary..."
                className="h-11 sm:h-12 text-sm sm:text-base backdrop-blur-sm bg-white/60 dark:bg-gray-800/50 border-white/20 focus:border-primary/50"
                {...register("excerpt")}
                aria-invalid={!!errors.excerpt}
                aria-describedby={errors.excerpt ? "excerpt-error" : undefined}
              />
              {errors.excerpt && (
                <p id="excerpt-error" className="text-xs sm:text-sm text-red-500">
                  {errors.excerpt.message}
                </p>
              )}
            </div>

            {/* Tags + Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="tags" className="flex items-center gap-2 text-sm sm:text-base font-semibold">
                  <Tag className="h-4 w-4 text-primary" />
                  Tags <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="tags"
                  placeholder="react, nextjs, typescript"
                  className="h-11 sm:h-12 text-sm sm:text-base backdrop-blur-sm bg-white/60 dark:bg-gray-800/50 border-white/20 focus:border-primary/50"
                  onChange={(e) =>
                    setValue(
                      "tags",
                      e.currentTarget.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                      { shouldValidate: true, shouldDirty: true },
                    )
                  }
                />
                {errors.tags && <p className="text-xs sm:text-sm text-red-500">{String(errors.tags.message)}</p>}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="categories" className="flex items-center gap-2 text-sm sm:text-base font-semibold">
                  <FolderOpen className="h-4 w-4 text-primary" />
                  Categories <span className="text-xs font-normal text-red-500">(required)</span>
                </Label>
                <Input
                  id="categories"
                  placeholder="technology, tutorial"
                  className="h-11 sm:h-12 text-sm sm:text-base backdrop-blur-sm bg-white/60 dark:bg-gray-800/50 border-white/20 focus:border-primary/50"
                  onChange={(e) =>
                    setValue(
                      "categories",
                      e.currentTarget.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                      { shouldValidate: true, shouldDirty: true },
                    )
                  }
                />
                {errors.categories && (
                  <p className="text-xs sm:text-sm text-red-500">{String(errors.categories.message)}</p>
                )}
              </div>
            </div>

            {/* Featured */}
            <div className="flex items-center gap-3 rounded-lg sm:rounded-xl border border-white/20 p-3 sm:p-4 backdrop-blur-sm bg-white/60 dark:bg-gray-800/50">
              <input
                id="featured"
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0"
                {...register("isFeatured")}
              />
              <Label htmlFor="featured" className="flex items-center gap-2 text-sm sm:text-base font-medium cursor-pointer">
                <Star className="h-4 w-4 text-amber-500" />
                Mark as Featured Post
              </Label>
              {errors.isFeatured && (
                <p className="text-xs sm:text-sm text-red-500">{String(errors.isFeatured.message)}</p>
              )}
            </div>

            {/* Actions */}
            <div className="pt-1 sm:pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl bg-primary hover:bg-primary/90 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <PenSquare className="mr-2 h-5 w-5" />
                    Publish Post
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

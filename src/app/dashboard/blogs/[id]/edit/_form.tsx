"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  blogCreateSchema,
  type BlogCreateFormValues,
  type BlogCreateValues,
  type BlogUpdateValues,
} from "@/app/lib/blog-validators"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import RichTextEditor from "@/components/rich-text-editor"
import { useRouter } from "next/navigation"
import ThumbnailUploader from "@/components/thumbnail-uploader"
import { Type, ImageIcon, FileEdit, AlignLeft, Tag, FolderOpen, Star, Loader2, Save } from "lucide-react"

type Post = {
  _id: string
  title: string
  content: string
  excerpt?: string | null
  tags?: string[]
  categories?: string[]
  isFeatured?: boolean
  thumbnailUrl?: string | null
}

interface BlogEditFormProps {
  post: Post
  isLoading?: boolean
}

export default function BlogEditForm({ post, isLoading = false }: BlogEditFormProps) {
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
      title: post.title ?? "",
      content: post.content ?? "",
      excerpt: post.excerpt ?? "",
      thumbnailUrl: post.thumbnailUrl ?? "",
      isFeatured: Boolean(post.isFeatured),
      tags: post.tags ?? [],
      categories: post.categories ?? [],
    },
  })

  const onSubmit = async (values: BlogCreateFormValues) => {
    const full: BlogCreateValues = blogCreateSchema.parse(values)

    const payload: BlogUpdateValues = {
      title: full.title,
      content: full.content,
      excerpt: full.excerpt,
      thumbnailUrl: full.thumbnailUrl,
      isFeatured: full.isFeatured,
      tags: full.tags,
      categories: full.categories,
    }

    try {
      const res = await fetch(`/api/blogs/${post._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Update failed")
      }
      toast.success("Post updated successfully!")
      router.push(`/dashboard/blogs/${post._id}`)
      router.refresh()
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error updating post"
      toast.error(msg)
    }
  }

  if (isLoading) {
    return (
      <div className="relative w-full">
        <div className="relative rounded-xl border border-white/20 bg-white/40 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.1),transparent_50%)] pointer-events-none" />

          <div className="relative p-4 sm:p-6 md:p-8 lg:p-10 space-y-4 sm:space-y-5 md:space-y-6">
            {/* Title skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-16 bg-gradient-to-r from-neutral-200/60 to-neutral-300/60 rounded animate-pulse" />
              <div className="h-10 sm:h-11 md:h-12 bg-gradient-to-r from-neutral-200/60 to-neutral-300/60 rounded-lg animate-pulse" />
            </div>

            {/* Thumbnail skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gradient-to-r from-neutral-200/60 to-neutral-300/60 rounded animate-pulse" />
              <div className="h-32 sm:h-40 md:h-48 bg-gradient-to-r from-neutral-200/60 to-neutral-300/60 rounded-lg animate-pulse" />
            </div>

            {/* Content editor skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gradient-to-r from-neutral-200/60 to-neutral-300/60 rounded animate-pulse" />
              <div className="h-48 sm:h-56 md:h-64 bg-gradient-to-r from-neutral-200/60 to-neutral-300/60 rounded-lg animate-pulse" />
            </div>

            {/* Excerpt skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-16 bg-gradient-to-r from-neutral-200/60 to-neutral-300/60 rounded animate-pulse" />
              <div className="h-10 sm:h-11 md:h-12 bg-gradient-to-r from-neutral-200/60 to-neutral-300/60 rounded-lg animate-pulse" />
            </div>

            {/* Tags and Categories skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gradient-to-r from-neutral-200/60 to-neutral-300/60 rounded animate-pulse" />
                <div className="h-10 sm:h-11 md:h-12 bg-gradient-to-r from-neutral-200/60 to-neutral-300/60 rounded-lg animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-28 bg-gradient-to-r from-neutral-200/60 to-neutral-300/60 rounded animate-pulse" />
                <div className="h-10 sm:h-11 md:h-12 bg-gradient-to-r from-neutral-200/60 to-neutral-300/60 rounded-lg animate-pulse" />
              </div>
            </div>

            {/* Featured checkbox skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-gradient-to-r from-neutral-200/60 to-neutral-300/60 rounded animate-pulse" />
              <div className="h-4 w-20 bg-gradient-to-r from-neutral-200/60 to-neutral-300/60 rounded animate-pulse" />
            </div>

            {/* Button skeleton */}
            <div className="h-10 sm:h-11 md:h-12 w-full sm:w-40 bg-gradient-to-r from-neutral-200/60 to-neutral-300/60 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <div className="relative rounded-xl border border-white/20 bg-white/40 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.1),transparent_50%)] pointer-events-none" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative p-4 sm:p-6 md:p-8 lg:p-10 space-y-4 sm:space-y-5 md:space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2 text-sm sm:text-base font-medium">
              <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm">
                <Type className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-700" />
              </div>
              Title
            </Label>
            <Input
              id="title"
              {...register("title")}
              className="h-10 sm:h-11 md:h-12 bg-white/50 backdrop-blur-sm border-white/30 focus:border-amber-500/50 focus:ring-amber-500/20 text-sm sm:text-base"
              placeholder="Enter post title..."
            />
            {errors.title && <p className="text-xs sm:text-sm text-red-600 font-medium">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm sm:text-base font-medium">
              <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm">
                <ImageIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-700" />
              </div>
              Thumbnail
            </Label>
            <Controller
              name="thumbnailUrl"
              control={control}
              render={({ field }) => (
                <ThumbnailUploader value={field.value || ""} onChange={(url) => field.onChange(url ?? "")} />
              )}
            />
            {errors.thumbnailUrl && (
              <p className="text-xs sm:text-sm text-red-600 font-medium">{errors.thumbnailUrl.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm sm:text-base font-medium">
              <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm">
                <FileEdit className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-700" />
              </div>
              Content
            </Label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => <RichTextEditor value={field.value} onChange={field.onChange} />}
            />
            {errors.content && <p className="text-xs sm:text-sm text-red-600 font-medium">{errors.content.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt" className="flex items-center gap-2 text-sm sm:text-base font-medium">
              <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm">
                <AlignLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-700" />
              </div>
              Excerpt
            </Label>
            <Input
              id="excerpt"
              {...register("excerpt")}
              className="h-10 sm:h-11 md:h-12 bg-white/50 backdrop-blur-sm border-white/30 focus:border-amber-500/50 focus:ring-amber-500/20 text-sm sm:text-base"
              placeholder="Brief description..."
            />
            {errors.excerpt && <p className="text-xs sm:text-sm text-red-600 font-medium">{errors.excerpt.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div className="space-y-2">
              <Label htmlFor="tags" className="flex items-center gap-2 text-sm sm:text-base font-medium">
                <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm">
                  <Tag className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-700" />
                </div>
                Tags
              </Label>
              <Input
                id="tags"
                defaultValue={(post.tags ?? []).join(", ")}
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
                className="h-10 sm:h-11 md:h-12 bg-white/50 backdrop-blur-sm border-white/30 focus:border-amber-500/50 focus:ring-amber-500/20 text-sm sm:text-base"
                placeholder="tag1, tag2, tag3"
              />
              {errors.tags && (
                <p className="text-xs sm:text-sm text-red-600 font-medium">{String(errors.tags.message)}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="categories" className="flex items-center gap-2 text-sm sm:text-base font-medium">
                <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm">
                  <FolderOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-700" />
                </div>
                Categories
              </Label>
              <Input
                id="categories"
                defaultValue={(post.categories ?? []).join(", ")}
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
                className="h-10 sm:h-11 md:h-12 bg-white/50 backdrop-blur-sm border-white/30 focus:border-amber-500/50 focus:ring-amber-500/20 text-sm sm:text-base"
                placeholder="category1, category2"
              />
              {errors.categories && (
                <p className="text-xs sm:text-sm text-red-600 font-medium">{String(errors.categories.message)}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 p-3 sm:p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-white/30">
              <input
                id="featured"
                type="checkbox"
                {...register("isFeatured")}
                className="h-4 w-4 sm:h-5 sm:w-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500/20"
              />
              <Label
                htmlFor="featured"
                className="flex items-center gap-2 text-sm sm:text-base font-medium cursor-pointer"
              >
                <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600" />
                Featured Post
              </Label>
            </div>
            {errors.isFeatured && (
              <p className="text-xs sm:text-sm text-red-600 font-medium">{String(errors.isFeatured.message)}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto h-10 sm:h-11 md:h-12 px-6 sm:px-8 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

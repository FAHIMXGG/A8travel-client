import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import Link from "next/link"
import type { BlogDetail } from "@/types/blog"
import { ArrowLeft, Calendar, Eye, Tag, FolderOpen, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const revalidate = 60

async function getPost(id: string): Promise<BlogDetail | null> {
  const res = await fetch(`${process.env.BACKEND_URL}/api/blogs/${id}`, {
    next: { revalidate },
  })
  if (!res.ok) return null
  const json = (await res.json()) as { data?: BlogDetail }
  return json.data ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id?: string | string[] }>
}): Promise<Metadata> {
  const p = await params
  const id = Array.isArray(p.id) ? p.id[0] : p.id
  if (!id) return { title: "Post", description: "Blog post" }

  const post = await getPost(id)
  if (!post) return { title: "Post", description: "Blog post" }

  return {
    title: post.title,
    description: post.excerpt ?? "Blog post",
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      images: post.thumbnailUrl ? [{ url: post.thumbnailUrl }] : undefined,
    },
  }
}

export default async function PublicPostPage({
  params,
}: {
  params: Promise<{ id?: string | string[] }>
}) {
  const p = await params
  const id = Array.isArray(p.id) ? p.id[0] : p.id
  if (!id) notFound()

  const post = await getPost(id)
  if (!post) notFound()

  // ✅ Normalize optional arrays once to avoid undefined checks everywhere
  const tags = post.tags ?? []
  const categories = post.categories ?? []

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 sm:mb-8 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 rounded-lg hover:bg-white/50 dark:hover:bg-white/5 backdrop-blur-sm group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Blog
        </Link>

        <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          {post.thumbnailUrl && (
            <div className="relative aspect-[21/9] sm:aspect-[16/9] w-full overflow-hidden">
              <Image
                src={post.thumbnailUrl || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 896px, 100vw"
                priority
              />
              {post.isFeatured && (
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg backdrop-blur-sm px-3 py-1.5 text-xs sm:text-sm">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 fill-current" />
                    Featured
                  </Badge>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          )}

          <div className="p-4 sm:p-6 lg:p-10">
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6 text-xs sm:text-sm text-muted-foreground">
              {post.createdAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
              {post.views !== undefined && (
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{post.views.toLocaleString()} views</span>
                </div>
              )}
            </div>

            {post.excerpt && (
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed font-light italic border-l-4 border-amber-500/50 pl-4 sm:pl-6">
                {post.excerpt}
              </p>
            )}

            {/* ✅ Tags & Categories (warning-free) */}
            {(tags.length > 0 || categories.length > 0) && (
              <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-border/50">
                {tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                    {tags.map((tag, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 text-xs sm:text-sm"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                {categories.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <FolderOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                    {categories.map((cat, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 text-xs sm:text-sm"
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div
              className="prose prose-neutral dark:prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h1:text-2xl sm:prose-h1:text-3xl lg:prose-h1:text-4xl
                prose-h2:text-xl sm:prose-h2:text-2xl lg:prose-h2:text-3xl
                prose-h3:text-lg sm:prose-h3:text-xl lg:prose-h3:text-2xl
                prose-p:leading-relaxed prose-p:text-foreground/90
                prose-a:text-amber-600 dark:prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold
                prose-code:text-amber-600 dark:prose-code:text-amber-400 prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-muted prose-pre:border prose-pre:border-border
                prose-img:rounded-xl prose-img:shadow-lg
                prose-blockquote:border-l-amber-500 prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r
                mb-8 sm:mb-10"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {post.author && (
              <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-border/50">
                <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm border border-border/50">
                  <Avatar className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-amber-500/20 shadow-lg">
                    {/* <AvatarImage src={post.author.profilePicture || "/placeholder.svg"} alt={post.author.name} /> */}
                    <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm sm:text-lg font-semibold">
                      {post.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1 sm:mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground">{post.author.name}</h3>
                      {post.author.role && (
                        <Badge
                          variant="secondary"
                          className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 text-xs"
                        >
                          {post.author.role}
                        </Badge>
                      )}
                    </div>
                    {post.author.email && (
                      <p className="text-xs sm:text-sm text-muted-foreground break-all">{post.author.email}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  )
}

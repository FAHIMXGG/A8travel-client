import Link from "next/link"
import Image from "next/image"
import { Eye, Calendar, Tag, ChevronLeft, ChevronRight, Star } from "lucide-react"

// Revalidate (ISR) every 60s
export const revalidate = 60

// Page metadata (server-only)
export const metadata = {
  title: "Blog",
  description: "All posts and updates",
}

// Tiny inline blur placeholder for images
const TINY_BLUR =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDE2IDkiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjkiIGZpbGw9IiNmMmYyZjIiLz48L3N2Zz4="

type BlogItem = {
  _id: string
  title: string
  content: string
  excerpt?: string | null
  tags?: string[]
  categories?: string[]
  isFeatured?: boolean
  thumbnailUrl?: string | null
  views?: number
  createdAt?: string
  updatedAt?: string
}

type BlogListResponse = {
  success: boolean
  message?: string
  data: BlogItem[]
  meta?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

async function getBlogs(page: number, limit = 9): Promise<BlogListResponse> {
  const url = `${process.env.BACKEND_URL}/api/blogs?page=${page}&limit=${limit}`
  const res = await fetch(url, { next: { revalidate } })
  if (!res.ok) throw new Error(`Failed to fetch blogs (HTTP ${res.status})`)
  return res.json() as Promise<BlogListResponse>
}

export default async function PublicBlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const sp = await searchParams
  const pageParam = Array.isArray(sp.page) ? sp.page[0] : sp.page
  const pageNum = Number.parseInt(pageParam ?? "1", 10)
  const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1

  const limit = 9
  const { data: posts, meta } = await getBlogs(page, limit)

  const currentPage = meta?.page ?? page
  const totalPages = meta?.pages ?? 1
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Soft gradient background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50" />
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply blur-xl opacity-20" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply blur-xl opacity-20" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply blur-xl opacity-20" />
      </div>

      <section className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 space-y-6 sm:space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
              <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
              All Blogs
            </h1>
          </div>
          {meta && (
            <p className="text-xs sm:text-sm text-muted-foreground bg-white/50 px-3 py-1.5 rounded-full border border-amber-200/50">
              Page {currentPage} of {totalPages} • {meta.total} posts
            </p>
          )}
        </header>

        {/* Card grid */}
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 md:py-24">
            <div className="p-4 sm:p-5 rounded-2xl bg-white/60 backdrop-blur-md border border-amber-200/50 shadow-xl mb-4">
              <Tag className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-sm text-muted-foreground">Check back soon for new content!</p>
          </div>
        ) : (
          <ul className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p: BlogItem, idx: number) => {
              // Only first 3 cards on page 1 load eagerly; the rest are lazy
              const isAboveFold = currentPage === 1 && idx < 3

              return (
                <li key={p._id} className="group">
                  <Link
                    href={`/blog/${p._id}`}
                    className="block h-full rounded-xl sm:rounded-2xl overflow-hidden bg-white/60 backdrop-blur-md border border-amber-200/50 shadow-lg hover:shadow-2xl hover:border-amber-300/60 transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video relative bg-gradient-to-br from-amber-100 to-orange-100 overflow-hidden">
                      {p.thumbnailUrl ? (
                        <Image
                          src={p.thumbnailUrl}
                          alt={p.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          priority={isAboveFold}
                          loading={isAboveFold ? "eager" : "lazy"}
                          fetchPriority={isAboveFold ? "high" : "auto"}
                          decoding="async"
                          placeholder="blur"
                          blurDataURL={TINY_BLUR}
                        />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center">
                          <div className="p-3 sm:p-4 rounded-xl bg-white/50 backdrop-blur-sm">
                            <Tag className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
                          </div>
                        </div>
                      )}

                      {/* Featured badge */}
                      {p.isFeatured && (
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 px-2 sm:px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] sm:text-xs font-semibold flex items-center gap-1 shadow-lg">
                          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3">
                      <h2 className="text-sm sm:text-base md:text-lg font-semibold line-clamp-2 text-gray-900 group-hover:text-amber-600 transition-colors">
                        {p.title}
                      </h2>

                      {p.excerpt && (
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {p.excerpt}
                        </p>
                      )}

                      {/* Tags */}
                      {p.tags && p.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {p.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 text-[10px] sm:text-xs font-medium border border-amber-200/50"
                            >
                              {tag}
                            </span>
                          ))}
                          {p.tags.length > 3 && (
                            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] sm:text-xs font-medium">
                              +{p.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Meta */}
                      <div className="flex items-center justify-between pt-2 border-t border-amber-200/30">
                        <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
                          <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span>{p.views ?? 0} views</span>
                        </div>
                        {p.createdAt && (
                          <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="flex items-center justify-between pt-4 sm:pt-6">
            <Link
              href={`/blog${hasPrev ? `?page=${currentPage - 1}` : ""}`}
              aria-disabled={!hasPrev}
              className={`flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium backdrop-blur-md border transition-all duration-200 ${
                hasPrev
                  ? "bg-white/60 border-amber-200/50 text-gray-900 hover:bg-white/80 hover:border-amber-300/60 hover:shadow-lg"
                  : "pointer-events-none opacity-50 bg-white/30 border-gray-200/50 text-gray-400"
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Previous</span>
            </Link>

            <div className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-white/60 backdrop-blur-md border border-amber-200/50 text-xs sm:text-sm font-medium text-gray-900">
              Page {currentPage} of {totalPages}
            </div>

            <Link
              href={`/blog${hasNext ? `?page=${currentPage + 1}` : ""}`}
              aria-disabled={!hasNext}
              className={`flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium backdrop-blur-md border transition-all duration-200 ${
                hasNext
                  ? "bg-white/60 border-amber-200/50 text-gray-900 hover:bg-white/80 hover:border-amber-300/60 hover:shadow-lg"
                  : "pointer-events-none opacity-50 bg-white/30 border-gray-200/50 text-gray-400"
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </nav>
        )}
      </section>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Tag,
  Calendar,
  Eye,
  Pencil,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import DeleteBlogButton from "@/components/DeleteBlogButton"

type Blog = {
  _id: string
  title: string
  tags?: string[]
  createdAt?: string
  updatedAt?: string
}

type Meta = {
  page: number
  limit: number
  total: number
  pages: number
}

type BlogsResponse = {
  success: boolean
  message: string
  data: Blog[]
  meta: Meta
}

const API_BASE = process.env.BACKEND_URL ?? "https://a7-blog-server.vercel.app"

async function getPosts(page = 1, limit = 10): Promise<BlogsResponse> {
  const url = `${API_BASE}/api/blogs?page=${page}&limit=${limit}`
  const res = await fetch(url, {
    cache: "no-store",
  })

  if (!res.ok) {
    return {
      success: false,
      message: `Failed to fetch blogs: ${res.status} ${res.statusText}`,
      data: [],
      meta: { page, limit, total: 0, pages: 0 },
    }
  }

  const json = (await res.json()) as BlogsResponse
  return {
    success: json?.success ?? false,
    message: json?.message ?? "",
    data: Array.isArray(json?.data) ? json.data : [],
    meta: json?.meta ?? { page, limit, total: 0, pages: 0 },
  }
}

function formatDate(iso?: string) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.valueOf())) return "—"
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function Pagination({
  page,
  pages,
  total,
}: {
  page: number
  pages: number
  total: number
}) {
  if (pages <= 1) return null

  const makeHref = (p: number) => `/dashboard/blogs?page=${p}`

  const windowSize = 5
  let start = Math.max(1, page - Math.floor(windowSize / 2))
  const end = Math.min(pages, start + windowSize - 1)
  if (end - start + 1 < windowSize) start = Math.max(1, end - windowSize + 1)

  const nums = []
  for (let i = start; i <= end; i++) nums.push(i)

  return (
    <div className="mt-6 space-y-3">
      <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
        Showing{" "}
        <span className="font-medium text-foreground">
          {total.toLocaleString()}
        </span>{" "}
        posts • Page{" "}
        <span className="font-medium text-foreground">{page}</span> of{" "}
        <span className="font-medium text-foreground">{pages}</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          disabled={page === 1}
          className="h-8 w-8 sm:w-auto sm:px-3 bg-transparent"
        >
          <Link href={makeHref(1)}>
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:ml-1">First</span>
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          disabled={page === 1}
          className="h-8 w-8 sm:w-auto sm:px-3 bg-transparent"
        >
          <Link href={makeHref(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:ml-1">Prev</span>
          </Link>
        </Button>

        <div className="flex items-center gap-1">
          {start > 1 && (
            <>
              <Link
                href={makeHref(1)}
                className="h-8 w-8 flex items-center justify-center rounded-md text-xs sm:text-sm hover:bg-accent transition-colors"
              >
                1
              </Link>
              {start > 2 && (
                <span className="px-1 text-muted-foreground">…</span>
              )}
            </>
          )}

          {nums.map((n) => (
            <Link
              key={n}
              href={makeHref(n)}
              className={[
                "h-8 w-8 flex items-center justify-center rounded-md text-xs sm:text-sm transition-colors",
                n === page
                  ? "bg-primary text-primary-foreground font-medium"
                  : "hover:bg-accent",
              ].join(" ")}
            >
              {n}
            </Link>
          ))}

          {end < pages && (
            <>
              {end < pages - 1 && (
                <span className="px-1 text-muted-foreground">…</span>
              )}
              <Link
                href={makeHref(pages)}
                className="h-8 w-8 flex items-center justify-center rounded-md text-xs sm:text-sm hover:bg-accent transition-colors"
              >
                {pages}
              </Link>
            </>
          )}
        </div>

        <Button
          asChild
          variant="outline"
          size="sm"
          disabled={page === pages}
          className="h-8 w-8 sm:w-auto sm:px-3 bg-transparent"
        >
          <Link href={makeHref(page + 1)}>
            <span className="sr-only sm:not-sr-only sm:mr-1">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          disabled={page === pages}
          className="h-8 w-8 sm:w-auto sm:px-3 bg-transparent"
        >
          <Link href={makeHref(pages)}>
            <span className="sr-only sm:not-sr-only sm:mr-1">Last</span>
            <ChevronsRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default async function BlogsIndex({
  searchParams,
}: {
  // ✅ Important: Next.js 15 treats this as a Promise
  searchParams: Promise<{ page?: string }>
}) {
  // ✅ Await the Promise
  const sp = await searchParams
  const pageParam = Number(sp?.page ?? 1)
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1
  const limit = 10

  const { data: posts, meta, success, message } = await getPosts(page, limit)

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background via-background to-muted/20" />

      <div className="fixed top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />
      <div
        className="fixed bottom-20 left-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10 animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="space-y-4 sm:space-y-6 p-3 sm:p-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-primary/20 to-amber-500/20 backdrop-blur-sm flex items-center justify-center border border-primary/10">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                All Posts
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Manage your blog content
              </p>
            </div>
          </div>
          <Button asChild className="w-full sm:w-auto gap-2 h-9 sm:h-10">
            <Link href="/dashboard/blogs/new">
              <Plus className="h-4 w-4" />
              Create Post
            </Link>
          </Button>
        </div>

        {!success && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 backdrop-blur-sm p-3 sm:p-4 text-sm text-destructive">
            {message || "Failed to load posts."}
          </div>
        )}

        {posts.length === 0 ? (
          <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 sm:p-12 text-center">
            <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-muted-foreground">
              No posts yet. Create your first post to get started!
            </p>
          </div>
        ) : (
          <>
            {/* Large screen table view */}
            <div className="hidden lg:block overflow-hidden rounded-xl border border-border/50 bg-card/30 backdrop-blur-md">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 backdrop-blur-sm border-b border-border/50">
                  <tr>
                    <th className="text-left p-3 sm:p-4 font-semibold">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        Title
                      </div>
                    </th>
                    <th className="text-left p-3 sm:p-4 font-semibold">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        Tags
                      </div>
                    </th>
                    <th className="text-left p-3 sm:p-4 font-semibold">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Updated
                      </div>
                    </th>
                    <th className="text-right p-3 sm:p-4 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p, idx) => (
                    <tr
                      key={p._id}
                      className="border-t border-border/30 hover:bg-muted/20 transition-colors"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <td className="p-3 sm:p-4 font-medium">{p.title}</td>
                      <td className="p-3 sm:p-4">
                        <div className="flex flex-wrap gap-1">
                          {(p.tags ?? []).slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-primary/10 text-primary border border-primary/20"
                            >
                              {tag}
                            </span>
                          ))}
                          {(p.tags ?? []).length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{(p.tags ?? []).length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 sm:p-4 text-muted-foreground">
                        {formatDate(p.updatedAt ?? p.createdAt)}
                      </td>
                      <td className="p-3 sm:p-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1.5"
                          >
                            <Link href={`/dashboard/blogs/${p._id}`}>
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </Link>
                          </Button>
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1.5"
                          >
                            <Link href={`/dashboard/blogs/${p._id}/edit`}>
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </Link>
                          </Button>
                          <DeleteBlogButton id={p._id} title={p.title} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="lg:hidden space-y-3 sm:space-y-4">
              {posts.map((p, idx) => (
                <div
                  key={p._id}
                  className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-md p-4 sm:p-5 space-y-3 hover:border-primary/30 transition-all duration-300"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="space-y-2">
                    <h3 className="font-semibold text-base sm:text-lg line-clamp-2">
                      {p.title}
                    </h3>

                    {(p.tags ?? []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {(p.tags ?? []).map((tag, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-primary/10 text-primary border border-primary/20"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(p.updatedAt ?? p.createdAt)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border/30">
                    <Button
                      asChild
                      variant="secondary"
                      size="sm"
                      className="flex-1 sm:flex-none gap-1.5 h-8 sm:h-9"
                    >
                      <Link href={`/dashboard/blogs/${p._id}`}>
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none gap-1.5 h-8 sm:h-9 bg-transparent"
                    >
                      <Link href={`/dashboard/blogs/${p._id}/edit`}>
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                    </Button>
                    <DeleteBlogButton id={p._id} title={p.title} />
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              page={meta?.page ?? page}
              pages={meta?.pages ?? 1}
              total={meta?.total ?? posts.length}
            />
          </>
        )}
      </div>
    </div>
  )
}

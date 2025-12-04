// src/app/dashboard/blogs/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, Eye, Tag, FolderOpen, Star, Edit, Shield } from "lucide-react";
import Image from "next/image";
import DeleteBlogButton from "@/components/DeleteBlogButton";

// If you don't already have this helper, keep it inline:
const isUnoptimizedCdn = (url?: string) =>
  !!url && /(^https?:\/\/[^/]*\.ufs\.sh\/)|(^https?:\/\/utfs\.io\/)/i.test(url);

// ---- Config: prefer server-only BACKEND_URL, then public, then hardcoded fallback
const API_BASE =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://a7-blog-server.vercel.app";

function apiUrl(path: string) {
  if (!API_BASE) {
    throw new Error("BACKEND_URL / NEXT_PUBLIC_BACKEND_URL is not set.");
  }
  return new URL(path, API_BASE).toString();
}

async function getPost(id: string) {
  try {
    const res = await fetch(apiUrl(`/api/blogs/${id}`), { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch (e) {
    console.error("getPost error:", e);
    return null;
  }
}

// ✅ Note the Promise type and the await on params
export default async function BlogView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // <-- await props in React 19 / Next 15
  const post = await getPost(id);
  if (!post) return notFound();

  const authorInitials =
    post.author?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "?";

  return (
    <div className="min-h-screen relative">
      {/* background, etc. */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />

      <div className="container max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
        <Link
          href="/dashboard/blogs"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 sm:mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to all posts
        </Link>

        <article className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          {post.thumbnailUrl && (
            <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-gray-800 dark:to-gray-700">
              <Image
                src={post.thumbnailUrl || "/placeholder.svg"}
                alt={post.title || "thumbnail"}
                fill
                sizes="100vw"
                className="object-cover"
                priority
                // avoid optimizer timeouts for flaky CDNs
                unoptimized={isUnoptimizedCdn(post.thumbnailUrl)}
              />
              {post.isFeatured && (
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                  <Badge className="bg-amber-500/90 backdrop-blur-sm text-white border-0 gap-1 text-xs sm:text-sm px-2 sm:px-3 py-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                    Featured
                  </Badge>
                </div>
              )}
            </div>
          )}

          <div className="p-4 sm:p-6 md:p-8 lg:p-12">
            {/* Header */}
            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent leading-tight">
                  {post.title}
                </h1>
                <div className="flex gap-2 shrink-0">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 h-8 sm:h-8.5"
                  >
                    <Link href={`/dashboard/blogs/${post._id}/edit`}>
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm">Edit</span>
                    </Link>
                  </Button>
                  <DeleteBlogButton id={post._id} title={post.title} />
                </div>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                  <span>
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                  <span>{post.views ?? 0} views</span>
                </div>
                {post.updatedAt && post.updatedAt !== post.createdAt && (
                  <div className="flex items-center gap-1.5 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                    <span className="text-xs">Updated:</span>
                    <span>
                      {new Date(post.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Author */}
              {post.author && (
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 backdrop-blur-sm bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl sm:rounded-2xl border border-amber-200/50 dark:border-amber-800/50">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12 ring-2 ring-amber-400/50">
                    <AvatarImage src="/placeholder.svg" alt={post.author.name || "author"} />
                    <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white text-sm sm:text-base">
                      {authorInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm sm:text-base text-foreground">
                        {post.author.name}
                      </p>
                      {post.author.role === "admin" && (
                        <Badge
                          variant="secondary"
                          className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-0 text-xs px-1.5 py-0"
                        >
                          <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {post.author.email}
                    </p>
                  </div>
                </div>
              )}

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed italic border-l-4 border-amber-400 pl-3 sm:pl-4 py-1 sm:py-2">
                  {post.excerpt}
                </p>
              )}

              {/* Tags & Categories */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {Array.isArray(post.tags) && post.tags.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {post.tags.map((tag: string, i: number) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="backdrop-blur-sm bg-amber-100/80 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-0 text-xs px-2 py-0.5"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {Array.isArray(post.categories) && post.categories.length > 0 && (
                  <div className="flex items-start gap-2">
                    <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400 mt-0.5 shrink-0" />
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {post.categories.map((c: string, i: number) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="backdrop-blur-sm bg-orange-100/80 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-0 text-xs px-2 py-0.5"
                        >
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-amber-300 dark:via-amber-700 to-transparent mb-6 sm:mb-8" />

            <div
              className="prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </div>
    </div>
  );
}

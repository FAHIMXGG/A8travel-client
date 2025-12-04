import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, TrendingUp, Clock, Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isUnoptimizedCdn } from "@/lib/is-unoptimized-cdn";

// Tiny inline blur placeholder (universal fallback)
const TINY_BLUR =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDE2IDkiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjkiIGZpbGw9IiNmMmYyZjIiLz48L3N2Zz4=";

// --- Data fetchers ---
async function getFeaturedPosts() {
  try {
    const res = await fetch(
      "https://a7-blog-server.vercel.app/api/blogs?isFeatured=true",
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.slice(0, 3) || [];
  } catch (error) {
    console.error("Failed to fetch featured posts:", error);
    return [];
  }
}

async function getLatestPosts() {
  try {
    const res = await fetch("https://a7-blog-server.vercel.app/api/blogs", {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.slice(0, 3) || [];
  } catch (error) {
    console.error("Failed to fetch latest posts:", error);
    return [];
  }
}

// --- UI pieces ---
function PostsSkeleton() {
  return (
    <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 overflow-hidden">
          <div className="h-48 sm:h-56 bg-gradient-to-br from-muted/50 to-muted/20 animate-pulse" />
          <div className="p-5 sm:p-6 space-y-3">
            <div className="h-6 bg-muted/50 rounded animate-pulse" />
            <div className="h-4 bg-muted/30 rounded animate-pulse w-3/4" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-16 bg-muted/30 rounded-full animate-pulse" />
              <div className="h-6 w-16 bg-muted/30 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

async function FeaturedPosts() {
  const posts = await getFeaturedPosts();

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No featured posts available</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post: any, index: number) => {
        const isFirst = index === 0; // only first gets eager load

        return (
          <Link
            key={post._id}
            href={`/blog/${post._id}`}
            className="group relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/10"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Featured Badge */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-sm text-white text-xs font-medium shadow-lg">
              <Sparkles className="h-3 w-3" />
              Featured
            </div>

            {/* Thumbnail */}
            <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-amber-500/5 to-orange-500/5">
              {post.thumbnailUrl ? (
                <Image
                  src={post.thumbnailUrl || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  unoptimized={isUnoptimizedCdn(post.thumbnailUrl)}
                  // Lazy/eager behavior
                  priority={isFirst}
                  loading={isFirst ? "eager" : "lazy"}
                  fetchPriority={isFirst ? "high" : "auto"}
                  decoding="async"
                  // Blur-up placeholder
                  placeholder="blur"
                  blurDataURL={TINY_BLUR}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Sparkles className="h-12 w-12 text-amber-500/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold line-clamp-2 group-hover:text-amber-500 transition-colors duration-300">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>

              {/* Metadata */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                <div className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {post.views || 0}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

async function LatestPosts() {
  const posts = await getLatestPosts();

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No posts available</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post: any, index: number) => {
        const isFirst = index === 0; // only first gets eager load

        return (
          <Link
            key={post._id}
            href={`/blog/${post._id}`}
            className="group relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Thumbnail */}
            <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
              {post.thumbnailUrl ? (
                <Image
                  src={post.thumbnailUrl || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  unoptimized={isUnoptimizedCdn(post.thumbnailUrl)}
                  // Lazy/eager behavior
                  priority={isFirst}
                  loading={isFirst ? "eager" : "lazy"}
                  fetchPriority={isFirst ? "high" : "auto"}
                  decoding="async"
                  // Blur-up placeholder
                  placeholder="blur"
                  blurDataURL={TINY_BLUR}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Clock className="h-12 w-12 text-cyan-500/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold line-clamp-2 group-hover:text-cyan-500 transition-colors duration-300">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {post.tags.slice(0, 3).map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Metadata */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                <div className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {post.views || 0}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// --- Page ---
export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <main className="relative">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-cyan-500/10 backdrop-blur-sm border border-white/10">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium bg-gradient-to-r from-amber-500 to-cyan-500 bg-clip-text text-transparent">
                Welcome to My Portfolio
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 bg-clip-text text-transparent">
                Crafting Digital
              </span>
              <br />
              <span className="text-foreground">Experiences</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
              Frontend developer passionate about building beautiful, performant web applications with modern
              technologies.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300"
              >
                <Link href="/blog">
                  Explore Blog
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="group border-white/10 hover:border-white/20 hover:bg-white/5 backdrop-blur-sm bg-transparent"
              >
                <Link href="/projects">
                  View Projects
                  <TrendingUp className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="space-y-8 sm:space-y-12">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Featured Posts</h2>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground">Handpicked articles worth reading</p>
              </div>
              <Button asChild variant="ghost" className="hidden sm:flex group">
                <Link href="/blog">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <Suspense fallback={<PostsSkeleton />}>
              <FeaturedPosts />
            </Suspense>
          </div>
        </section>

        {/* Latest Posts */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="space-y-8 sm:space-y-12">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Latest Posts</h2>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground">Fresh content from the blog</p>
              </div>
              <Button asChild variant="ghost" className="hidden sm:flex group">
                <Link href="/blog">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <Suspense fallback={<PostsSkeleton />}>
              <LatestPosts />
            </Suspense>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-cyan-500/10 backdrop-blur-xl border border-white/10 p-8 sm:p-12 lg:p-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">Let's Work Together</h2>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty">
                Have a project in mind? Let's create something amazing together.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25"
                >
                  <Link href="/about">
                    About Me
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/10 hover:border-white/20 hover:bg-white/5 backdrop-blur-sm bg-transparent"
                >
                  <Link href="/projects">View Projects</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

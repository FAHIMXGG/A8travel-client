import Link from "next/link";
import { Eye, Calendar, Tag, ChevronLeft, ChevronRight, Star, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";

// Page metadata
export const metadata = {
  title: "Travel Blog - TravelBuddy",
  description: "Travel tips, guides, and stories from our community",
};

// Format date consistently for SSR/CSR
function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.valueOf())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Dummy blog posts with travel-related content
const dummyBlogPosts = [
  {
    id: "1",
    title: "10 Essential Tips for Finding the Perfect Travel Buddy",
    excerpt: "Discover how to connect with like-minded travelers and ensure a smooth journey together. Learn about communication, planning, and compatibility.",
    tags: ["Travel Tips", "Community", "Planning"],
    isFeatured: true,
    thumbnailUrl: null,
    views: 1250,
    createdAt: "2024-12-15T10:00:00.000Z",
    category: "Tips & Guides",
  },
  {
    id: "2",
    title: "Solo Travel vs. Group Travel: Which is Right for You?",
    excerpt: "Explore the pros and cons of traveling alone versus with a group. Find out which style matches your personality and travel goals.",
    tags: ["Solo Travel", "Group Travel", "Lifestyle"],
    isFeatured: true,
    thumbnailUrl: null,
    views: 980,
    createdAt: "2024-12-12T10:00:00.000Z",
    category: "Travel Styles",
  },
  {
    id: "3",
    title: "Budget-Friendly Destinations for 2025",
    excerpt: "Plan your next adventure without breaking the bank. We've compiled a list of amazing destinations that offer incredible experiences on a budget.",
    tags: ["Budget Travel", "Destinations", "2025"],
    isFeatured: false,
    thumbnailUrl: null,
    views: 2100,
    createdAt: "2024-12-10T10:00:00.000Z",
    category: "Destinations",
  },
  {
    id: "4",
    title: "Safety First: How to Stay Safe While Traveling with Strangers",
    excerpt: "Important safety guidelines and best practices when meeting new travel companions. Learn how to verify profiles and trust your instincts.",
    tags: ["Safety", "Security", "Tips"],
    isFeatured: false,
    thumbnailUrl: null,
    views: 1750,
    createdAt: "2024-12-08T10:00:00.000Z",
    category: "Safety",
  },
  {
    id: "5",
    title: "Top 5 Hidden Gems in Southeast Asia",
    excerpt: "Discover off-the-beaten-path destinations that offer authentic experiences away from tourist crowds. Perfect for adventurous travelers.",
    tags: ["Southeast Asia", "Hidden Gems", "Adventure"],
    isFeatured: false,
    thumbnailUrl: null,
    views: 1450,
    createdAt: "2024-12-05T10:00:00.000Z",
    category: "Destinations",
  },
  {
    id: "6",
    title: "How to Split Costs Fairly on Group Trips",
    excerpt: "A comprehensive guide to managing expenses when traveling with others. Learn about apps, methods, and best practices for fair cost-sharing.",
    tags: ["Budget", "Group Travel", "Finance"],
    isFeatured: false,
    thumbnailUrl: null,
    views: 1320,
    createdAt: "2024-12-03T10:00:00.000Z",
    category: "Tips & Guides",
  },
  {
    id: "7",
    title: "Building Lasting Friendships Through Travel",
    excerpt: "Real stories from travelers who met their best friends on the road. Discover how shared adventures create unbreakable bonds.",
    tags: ["Community", "Friendship", "Stories"],
    isFeatured: true,
    thumbnailUrl: null,
    views: 1890,
    createdAt: "2024-12-01T10:00:00.000Z",
    category: "Community",
  },
  {
    id: "8",
    title: "Packing Essentials for Every Type of Traveler",
    excerpt: "From minimalist backpackers to luxury travelers, find the perfect packing list for your travel style. Never forget the essentials again.",
    tags: ["Packing", "Essentials", "Preparation"],
    isFeatured: false,
    thumbnailUrl: null,
    views: 1100,
    createdAt: "2024-11-28T10:00:00.000Z",
    category: "Tips & Guides",
  },
  {
    id: "9",
    title: "Cultural Etiquette: How to Respect Local Customs",
    excerpt: "Learn about cultural sensitivity and how to be a respectful traveler. Understanding local customs enhances your experience and builds bridges.",
    tags: ["Culture", "Etiquette", "Respect"],
    isFeatured: false,
    thumbnailUrl: null,
    views: 950,
    createdAt: "2024-11-25T10:00:00.000Z",
    category: "Culture",
  },
];

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const pageParam = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const pageNum = Number.parseInt(pageParam ?? "1", 10);
  const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;

  const limit = 9;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const posts = dummyBlogPosts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(dummyBlogPosts.length / limit);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="min-h-screen relative" suppressHydrationWarning>
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <main className="relative" suppressHydrationWarning>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-cyan-500/10 backdrop-blur-sm border border-white/10">
              <Plane className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium bg-gradient-to-r from-amber-500 to-cyan-500 bg-clip-text text-transparent">
                Travel Blog
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-balance">
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 bg-clip-text text-transparent">
                Travel Stories
              </span>
              <br />
              <span className="text-foreground">& Insights</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Discover travel tips, destination guides, and inspiring stories from our community of travelers.
            </p>
          </div>
        </section>

        {/* Blog Posts Section */}
        <section className="container mx-auto px-4 py-8 sm:py-12">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Latest Articles</h2>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {dummyBlogPosts.length} articles • Page {page} of {totalPages}
                </p>
              </div>
            </div>

            {/* Blog Grid */}
            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 sm:py-20 md:py-24">
                <div className="p-5 rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 mb-4">
                  <Tag className="w-12 h-12 text-amber-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                <p className="text-sm text-muted-foreground">Check back soon for new content!</p>
              </div>
            ) : (
              <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" suppressHydrationWarning>
                {posts.map((post) => {

                  return (
                    <Link
                      key={post.id}
                      href={`/blog/${post.id}`}
                      className="group relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/10"
                    >
                      {/* Thumbnail */}
                      <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-amber-500/5 to-orange-500/5">
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="p-4 rounded-xl bg-background/60 backdrop-blur-sm border border-white/10">
                            <Plane className="w-12 h-12 text-amber-500/50" />
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Featured Badge */}
                        {post.isFeatured && (
                          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-sm text-white text-xs font-medium shadow-lg">
                            <Star className="h-3 w-3 fill-white" />
                            Featured
                          </div>
                        )}

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4 z-10">
                          <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium text-foreground border border-white/10">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 sm:p-6 space-y-3">
                        <h3 className="text-lg sm:text-xl font-semibold line-clamp-2 group-hover:text-amber-500 transition-colors duration-300">
                          {post.title}
                        </h3>

                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {post.tags.slice(0, 3).map((tag, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 text-xs rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              >
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="px-2 py-1 text-xs rounded-full bg-muted/50 text-muted-foreground">
                                +{post.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Meta */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{post.views.toLocaleString()} views</span>
                          </div>
                          {post.createdAt && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{formatDate(post.createdAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="flex items-center justify-between pt-8 sm:pt-12">
                <Button
                  asChild
                  variant="outline"
                  disabled={!hasPrev}
                  className="group border-white/10 hover:border-white/20 hover:bg-white/5 backdrop-blur-sm bg-transparent"
                >
                  <Link
                    href={`/blog${hasPrev ? `?page=${page - 1}` : ""}`}
                    aria-disabled={!hasPrev}
                    className={!hasPrev ? "pointer-events-none opacity-50" : ""}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Previous</span>
                  </Link>
                </Button>

                <div className="px-4 py-2 rounded-xl bg-background/40 backdrop-blur-xl border border-white/10 text-sm font-medium">
                  Page {page} of {totalPages}
                </div>

                <Button
                  asChild
                  variant="outline"
                  disabled={!hasNext}
                  className="group border-white/10 hover:border-white/20 hover:bg-white/5 backdrop-blur-sm bg-transparent"
                >
                  <Link
                    href={`/blog${hasNext ? `?page=${page + 1}` : ""}`}
                    aria-disabled={!hasNext}
                    className={!hasNext ? "pointer-events-none opacity-50" : ""}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </nav>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-cyan-500/10 backdrop-blur-xl border border-white/10 p-8 sm:p-12 lg:p-16" suppressHydrationWarning>
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">
                Share Your Travel Story
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty">
                Have an amazing travel experience to share? Join our community and inspire others with your adventures!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25"
                >
                  <Link href="/register">Join Our Community</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/10 hover:border-white/20 hover:bg-white/5 backdrop-blur-sm bg-transparent"
                >
                  <Link href="/travelplan">Browse Travel Plans</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

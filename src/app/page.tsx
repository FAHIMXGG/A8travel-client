import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { ArrowRight, Sparkles, Clock, Calendar, MapPin, Users, DollarSign, Star, Plane, Globe, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { isUnoptimizedCdn } from "@/lib/is-unoptimized-cdn";

// Tiny inline blur placeholder (universal fallback)
const TINY_BLUR =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDE2IDkiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjkiIGZpbGw9IiNmMmYyZjIiLz48L3N2Zz4=";

// --- Types ---
type TravelPlan = {
  id: string;
  hostId: string;
  title: string;
  destinationCountry: string;
  destinationCity: string;
  startDate: string;
  endDate: string;
  budgetMin: number | null;
  budgetMax: number | null;
  travelType: string;
  description: string;
  images: string[];
  tags: string[];
  status: string;
  participantsCount: number;
  maxParticipants: number | null;
  hostName: string;
  hostImage: string | null;
  hostRatingAverage: number;
  createdAt: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  ratingAverage: number;
  ratingCount: number;
  currentLocation: string | null;
  visitedCountries: string[];
  travelInterests: string[];
};

// Helper to get base URL for server-side fetches
async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${protocol}://${host}`;
}

// --- Data fetchers ---
async function getFeaturedTravelPlans() {
  try {
    const baseUrl = await getBaseUrl();
    const res = await fetch(`${baseUrl}/api/travel-plans?limit=20`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const plans = data.data?.data || [];
    // Filter out ended, full, and closed plans, then sort by participantsCount descending and take top 3
    return plans
      .filter((plan: TravelPlan) => 
        plan.status !== "ENDED" && 
        plan.status !== "FULL" && 
        plan.status !== "CLOSED"
      )
      .sort((a: TravelPlan, b: TravelPlan) => (b.participantsCount || 0) - (a.participantsCount || 0))
      .slice(0, 3);
  } catch (error) {
    console.error("Failed to fetch featured travel plans:", error);
    return [];
  }
}

async function getLatestTravelPlans() {
  try {
    const baseUrl = await getBaseUrl();
    const res = await fetch(`${baseUrl}/api/travel-plans?limit=10`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const plans = data.data?.data || [];
    // Sort by createdAt descending (newest first) and take top 3
    return plans
      .sort((a: TravelPlan, b: TravelPlan) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 3);
  } catch (error) {
    console.error("Failed to fetch latest travel plans:", error);
    return [];
  }
}

async function getPopularTravellers() {
  try {
    const baseUrl = await getBaseUrl();
    const res = await fetch(`${baseUrl}/api/users/popular?limit=20`, {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      console.error("Failed to fetch users:", res.status, res.statusText);
      return [];
    }
    const data = await res.json();
    if (!data.success) {
      console.error("API returned error:", data.message);
      return [];
    }
    const users = data.data?.data || [];
    // Users are already sorted by the API, but we'll take top 6
    return users.slice(0, 6);
  } catch (error) {
    console.error("Failed to fetch popular travellers:", error);
    return [];
  }
}

// --- UI pieces ---
function TravelPlansSkeleton() {
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

function TravellersSkeleton() {
  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-xl bg-background/40 backdrop-blur-xl border border-white/10 p-4 space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted/50 animate-pulse" />
          <div className="h-4 bg-muted/50 rounded animate-pulse" />
          <div className="h-3 bg-muted/30 rounded animate-pulse w-2/3 mx-auto" />
        </div>
      ))}
    </div>
  );
}

function formatDateRange(start?: string, end?: string) {
  if (!start || !end) return "—";
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.valueOf()) || Number.isNaN(endDate.valueOf())) return "—";
  return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
}

const STATUS_COLORS: Record<string, string> = {
  OPEN: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  CLOSED: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
  CANCELED: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  FULL: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  ENDED: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
};

async function FeaturedTravelPlans() {
  const plans = await getFeaturedTravelPlans();

  if (plans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No featured travel plans available</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan: TravelPlan, index: number) => {
        const isFirst = index === 0;
        const imageUrl = plan.images && plan.images.length > 0 ? plan.images[0] : null;

        return (
          <Link
            key={plan.id}
            href={`/travelplan/${plan.id}`}
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
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={plan.title}
                  fill
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  unoptimized={isUnoptimizedCdn(imageUrl)}
                  priority={isFirst}
                  loading={isFirst ? "eager" : "lazy"}
                  fetchPriority={isFirst ? "high" : "auto"}
                  decoding="async"
                  placeholder="blur"
                  blurDataURL={TINY_BLUR}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Plane className="h-12 w-12 text-amber-500/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg sm:text-xl font-semibold line-clamp-2 group-hover:text-amber-500 transition-colors duration-300 flex-1">
                  {plan.title}
                </h3>
                <Badge className={STATUS_COLORS[plan.status] || STATUS_COLORS.CLOSED} variant="outline">
                  {plan.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-1">
                  {plan.destinationCity}, {plan.destinationCountry}
                </span>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">{plan.description}</p>

              {/* Metadata */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDateRange(plan.startDate, plan.endDate)}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {plan.participantsCount || 0}
                  {plan.maxParticipants && ` / ${plan.maxParticipants}`}
                </div>
                {plan.budgetMin && plan.budgetMax && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    ${plan.budgetMin}-${plan.budgetMax}
                  </div>
                )}
              </div>

              {/* Tags */}
              {plan.tags && plan.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {plan.tags.slice(0, 3).map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

async function LatestTravelPlans() {
  const plans = await getLatestTravelPlans();

  if (plans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No travel plans available</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan: TravelPlan, index: number) => {
        const isFirst = index === 0;
        const imageUrl = plan.images && plan.images.length > 0 ? plan.images[0] : null;

        return (
          <Link
            key={plan.id}
            href={`/travelplan/${plan.id}`}
            className="group relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Thumbnail */}
            <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={plan.title}
                  fill
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  unoptimized={isUnoptimizedCdn(imageUrl)}
                  priority={isFirst}
                  loading={isFirst ? "eager" : "lazy"}
                  fetchPriority={isFirst ? "high" : "auto"}
                  decoding="async"
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
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg sm:text-xl font-semibold line-clamp-2 group-hover:text-cyan-500 transition-colors duration-300 flex-1">
                  {plan.title}
                </h3>
                <Badge className={STATUS_COLORS[plan.status] || STATUS_COLORS.CLOSED} variant="outline">
                  {plan.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-1">
                  {plan.destinationCity}, {plan.destinationCountry}
                </span>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">{plan.description}</p>

              {/* Tags */}
              {plan.tags && plan.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {plan.tags.slice(0, 3).map((tag: string, i: number) => (
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
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDateRange(plan.startDate, plan.endDate)}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {plan.participantsCount || 0}
                  {plan.maxParticipants && ` / ${plan.maxParticipants}`}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

async function PopularTravellers() {
  const travellers = await getPopularTravellers();

  if (travellers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No popular travellers available</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {travellers.map((user: User) => (
        <Link
          key={user.id}
          href={`/users/${user.id}`}
          className="group relative overflow-hidden rounded-xl bg-background/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/10 p-4 text-center"
        >
          <div className="relative w-16 h-16 mx-auto mb-3">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.image || undefined} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-amber-500/20 to-cyan-500/20 text-foreground">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {user.ratingCount > 0 && (
              <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1">
                <Star className="h-3 w-3 text-white fill-white" />
              </div>
            )}
          </div>
          <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-amber-500 transition-colors">
            {user.name}
          </h4>
          <div className="flex items-center justify-center gap-1 mt-1">
            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
            <span className="text-xs text-muted-foreground">
              {user.ratingAverage.toFixed(1)} ({user.ratingCount})
            </span>
          </div>
          {user.currentLocation && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1 flex items-center justify-center gap-1">
              <MapPin className="h-3 w-3" />
              {user.currentLocation}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}

// Dummy reviews data
const dummyReviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, USA",
    rating: 5,
    comment: "Amazing platform! Found the perfect travel buddy for my trip to Japan. The community is friendly and trustworthy.",
    image: null,
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Singapore",
    rating: 5,
    comment: "Best travel companion finder I've used. Met incredible people and had unforgettable adventures together.",
    image: null,
  },
  {
    id: 3,
    name: "Emma Williams",
    location: "London, UK",
    rating: 5,
    comment: "Love how easy it is to connect with like-minded travelers. Highly recommend for solo travelers!",
    image: null,
  },
  {
    id: 4,
    name: "David Martinez",
    location: "Barcelona, Spain",
    rating: 5,
    comment: "The verification system gives me confidence. I've joined multiple trips and all were fantastic experiences.",
    image: null,
  },
];

// --- Page ---
// Mark page as dynamic since it uses headers()
export const dynamic = 'force-dynamic';

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
              <Plane className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium bg-gradient-to-r from-amber-500 to-cyan-500 bg-clip-text text-transparent">
                Find Your Perfect Travel Companion
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 bg-clip-text text-transparent">
                Travel Together,
              </span>
              <br />
              <span className="text-foreground">Explore Forever</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
              Connect with fellow travelers, join exciting trips, and create unforgettable memories. Your next adventure starts here.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300"
              >
                <Link href="/travelplan">
                  Browse Travel Plans
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="group border-white/10 hover:border-white/20 hover:bg-white/5 backdrop-blur-sm bg-transparent"
              >
                <Link href="/FindTravelBuddy">
                  Find Travel Buddy
                  <Users className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Travel Plans */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="space-y-8 sm:space-y-12">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Featured Travel Plans</h2>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground">Most popular trips with active travelers</p>
              </div>
              <Button asChild variant="ghost" className="hidden sm:flex group">
                <Link href="/travelplan">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <Suspense fallback={<TravelPlansSkeleton />}>
              <FeaturedTravelPlans />
            </Suspense>
          </div>
        </section>

        {/* Latest Plans */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="space-y-8 sm:space-y-12">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Latest Plans</h2>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground">Fresh travel opportunities just added</p>
              </div>
              <Button asChild variant="ghost" className="hidden sm:flex group">
                <Link href="/travelplan">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <Suspense fallback={<TravelPlansSkeleton />}>
              <LatestTravelPlans />
            </Suspense>
          </div>
        </section>

        {/* Most Popular Travellers */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="space-y-8 sm:space-y-12">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Most Popular Travellers</h2>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground">Top-rated travelers in our community</p>
              </div>
              <Button asChild variant="ghost" className="hidden sm:flex group">
                <Link href="/FindTravelBuddy">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <Suspense fallback={<TravellersSkeleton />}>
              <PopularTravellers />
            </Suspense>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="space-y-8 sm:space-y-12">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">What Our Travelers Say</h2>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">Real experiences from our community</p>
            </div>

            <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {dummyReviews.map((review) => (
                <div
                  key={review.id}
                  className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-6 space-y-4 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "text-amber-500 fill-amber-500"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-4">{review.comment}</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-amber-500/20 to-cyan-500/20">
                        {review.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{review.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {review.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="space-y-8 sm:space-y-12">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Why Choose Us</h2>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">Everything you need for safe and fun travels</p>
            </div>

            <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Shield,
                  title: "Verified Travelers",
                  description: "All users are verified to ensure a safe and trustworthy community.",
                  color: "from-green-500/10 to-emerald-500/10",
                  iconColor: "text-green-500",
                },
                {
                  icon: Users,
                  title: "Active Community",
                  description: "Join thousands of travelers sharing experiences and planning trips together.",
                  color: "from-blue-500/10 to-cyan-500/10",
                  iconColor: "text-blue-500",
                },
                {
                  icon: Globe,
                  title: "Global Destinations",
                  description: "Explore trips to amazing destinations all around the world.",
                  color: "from-purple-500/10 to-pink-500/10",
                  iconColor: "text-purple-500",
                },
                {
                  icon: Zap,
                  title: "Easy Matching",
                  description: "Find travel buddies that match your interests and travel style instantly.",
                  color: "from-amber-500/10 to-orange-500/10",
                  iconColor: "text-amber-500",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-6 space-y-4 hover:border-white/20 transition-all duration-300 hover:scale-105"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                    <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Destinations Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="space-y-8 sm:space-y-12">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Popular Destinations</h2>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">Discover trending travel destinations</p>
            </div>

            <div className="grid gap-6 md:gap-8 grid-cols-2 md:grid-cols-4">
              {[
                { name: "Japan", flag: "🇯🇵", travelers: "1.2k+" },
                { name: "Thailand", flag: "🇹🇭", travelers: "980+" },
                { name: "Spain", flag: "🇪🇸", travelers: "850+" },
                { name: "Italy", flag: "🇮🇹", travelers: "720+" },
              ].map((destination, index) => (
                <Link
                  key={index}
                  href={`/travelplan?destination=${destination.name}`}
                  className="group relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 p-6 text-center space-y-3"
                >
                  <div className="text-4xl mb-2">{destination.flag}</div>
                  <h3 className="text-lg font-semibold group-hover:text-amber-500 transition-colors">
                    {destination.name}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Users className="h-3 w-3" />
                    {destination.travelers} travelers
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-cyan-500/10 backdrop-blur-xl border border-white/10 p-8 sm:p-12 lg:p-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">Ready to Start Your Journey?</h2>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty">
                Join thousands of travelers and create unforgettable memories together. Your next adventure awaits!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25"
                >
                  <Link href="/travelplan">
                    Browse Travel Plans
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/10 hover:border-white/20 hover:bg-white/5 backdrop-blur-sm bg-transparent"
                >
                  <Link href="/FindTravelBuddy">Find Travel Buddy</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


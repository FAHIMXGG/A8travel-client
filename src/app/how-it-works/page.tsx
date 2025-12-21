import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Plane,
  Users,
  Search,
  Handshake,
  ArrowRight,
  CheckCircle,
  Star,
  Globe,
  Shield,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Learn how TravelBuddy works. Discover how to find travel companions, join group trips, create travel plans, and connect with like-minded travelers.",
  openGraph: {
    title: "How TravelBuddy Works - Find Travel Companions",
    description: "Learn how to use TravelBuddy to find travel buddies, join trips, and create amazing travel experiences.",
  },
};

export default function HowItWorksPage() {
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
      </div>

      <main className="relative">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-cyan-500/10 backdrop-blur-sm border border-white/10">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium bg-gradient-to-r from-amber-500 to-cyan-500 bg-clip-text text-transparent">
                Getting Started
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight text-balance">
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 bg-clip-text text-transparent">
                How It Works
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
              Join thousands of travelers and start your adventure in just a few simple steps. 
              Find your perfect travel companion or create your own travel plan today.
            </p>
          </div>
        </section>

        {/* Main Steps Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">Simple Steps to Get Started</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Follow these easy steps to begin your travel journey with TravelBuddy
              </p>
            </div>

            <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: "01",
                  icon: Search,
                  title: "Browse or Create",
                  description: "Explore existing travel plans from fellow travelers or create your own trip. Use filters to find trips that match your destination, dates, and budget.",
                  color: "from-amber-500/10 to-orange-500/10",
                  iconColor: "text-amber-500",
                },
                {
                  step: "02",
                  icon: Users,
                  title: "Connect & Review",
                  description: "View traveler profiles, read reviews, and check ratings. Connect with people who share similar interests and travel styles.",
                  color: "from-cyan-500/10 to-blue-500/10",
                  iconColor: "text-cyan-500",
                },
                {
                  step: "03",
                  icon: Handshake,
                  title: "Join or Host",
                  description: "Request to join an existing trip or host your own. Coordinate dates, budgets, and activities with your travel companions.",
                  color: "from-purple-500/10 to-pink-500/10",
                  iconColor: "text-purple-500",
                },
                {
                  step: "04",
                  icon: Plane,
                  title: "Travel Together",
                  description: "Embark on your adventure, create unforgettable memories, and build lasting friendships with your travel buddies.",
                  color: "from-green-500/10 to-emerald-500/10",
                  iconColor: "text-green-500",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-6 space-y-4 hover:border-white/20 transition-all duration-300 hover:scale-105"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 hover:opacity-100 transition-opacity duration-300`} />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl font-bold text-muted-foreground/20">{item.step}</span>
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} border border-white/10`}>
                        <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Process Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">Detailed Process</h2>
              </div>
            </div>

            <div className="space-y-8">
              {/* Step 1 Detail */}
              <div className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center border border-white/10">
                      <Search className="h-8 w-8 text-amber-500" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Step 1: Browse or Create</span>
                    </div>
                    <p className="text-muted-foreground">
                      Start by exploring our extensive collection of travel plans. Use our powerful search filters to find trips based on:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground"><strong className="text-foreground">Destination:</strong> Search by country, city, or region</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground"><strong className="text-foreground">Dates:</strong> Find trips that match your travel timeline</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground"><strong className="text-foreground">Budget:</strong> Filter by your preferred price range</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground"><strong className="text-foreground">Travel Type:</strong> Adventure, relaxation, cultural, and more</span>
                      </li>
                    </ul>
                    <p className="text-muted-foreground pt-2">
                      Can&apos;t find the perfect trip? Create your own travel plan and invite others to join you!
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 Detail */}
              <div className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center border border-white/10">
                      <Users className="h-8 w-8 text-cyan-500" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">Step 2: Connect & Review</span>
                    </div>
                    <p className="text-muted-foreground">
                      Before joining a trip, get to know your potential travel companions:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground"><strong className="text-foreground">View Profiles:</strong> See traveler photos, interests, and travel history</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground"><strong className="text-foreground">Read Reviews:</strong> Check ratings and reviews from previous trips</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground"><strong className="text-foreground">Verify Identity:</strong> All users go through verification for safety</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground"><strong className="text-foreground">Message Host:</strong> Ask questions and discuss trip details</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 3 Detail */}
              <div className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center border border-white/10">
                      <Handshake className="h-8 w-8 text-purple-500" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Step 3: Join or Host</span>
                    </div>
                    <p className="text-muted-foreground">
                      Once you&apos;ve found the perfect match, it&apos;s time to join or host:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Users className="h-4 w-4 text-amber-500" />
                          Joining a Trip
                        </h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Request to join the travel plan</li>
                          <li>• Wait for host approval</li>
                          <li>• Coordinate with other participants</li>
                          <li>• Confirm your participation</li>
                        </ul>
                      </div>
                      <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Plane className="h-4 w-4 text-cyan-500" />
                          Hosting a Trip
                        </h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Create your travel plan</li>
                          <li>• Set dates, budget, and details</li>
                          <li>• Review join requests</li>
                          <li>• Manage participants</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 Detail */}
              <div className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center border border-white/10">
                      <Plane className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">Step 4: Travel Together</span>
                    </div>
                    <p className="text-muted-foreground">
                      The adventure begins! Here&apos;s what to expect:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground"><strong className="text-foreground">Pre-Trip Planning:</strong> Finalize itinerary, accommodations, and activities with your group</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground"><strong className="text-foreground">During the Trip:</strong> Share experiences, split costs, and enjoy the journey together</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground"><strong className="text-foreground">After the Trip:</strong> Leave reviews, share photos, and stay connected with your travel buddies</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">Why TravelBuddy Works</h2>
              </div>
            </div>

            <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-3">
              {[
                {
                  icon: Shield,
                  title: "Safe & Verified",
                  description: "All users are verified to ensure a safe and trustworthy community experience.",
                  color: "from-amber-500/10 to-orange-500/10",
                  iconColor: "text-amber-500",
                },
                {
                  icon: Star,
                  title: "Rating System",
                  description: "Rate and review your travel experiences to help others make informed decisions.",
                  color: "from-cyan-500/10 to-blue-500/10",
                  iconColor: "text-cyan-500",
                },
                {
                  icon: Globe,
                  title: "Global Network",
                  description: "Connect with travelers from around the world and explore amazing destinations together.",
                  color: "from-purple-500/10 to-pink-500/10",
                  iconColor: "text-purple-500",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-6 space-y-4 hover:border-white/20 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                    <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
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
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold text-balance">
                Ready to Start Your Journey?
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty">
                Join our community today and discover the joy of traveling together. Your next adventure awaits!
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
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


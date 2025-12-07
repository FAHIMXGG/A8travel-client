import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Plane,
  Users,
  Shield,
  Globe,
  Heart,
  MapPin,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Lock,
  MessageCircle,
  Calendar,
  Search,
  Handshake,
} from "lucide-react";

export default function AboutPage() {
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
              <Plane className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium bg-gradient-to-r from-amber-500 to-cyan-500 bg-clip-text text-transparent">
                About TravelBuddy
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 bg-clip-text text-transparent">
                Connecting Travelers,
              </span>
              <br />
              <span className="text-foreground">Creating Memories</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
              TravelBuddy is a platform where travelers from around the world come together to share adventures,
              split costs, and create lasting friendships. We believe the best journeys are those shared with others.
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

        {/* How It Works Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">How It Works</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Getting started with TravelBuddy is simple. Follow these easy steps to begin your next adventure.
              </p>
            </div>

            <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: "01",
                  icon: Search,
                  title: "Browse or Create",
                  description: "Explore existing travel plans or create your own trip and invite others to join.",
                  color: "from-amber-500/10 to-orange-500/10",
                  iconColor: "text-amber-500",
                },
                {
                  step: "02",
                  icon: Users,
                  title: "Connect",
                  description: "Find travelers with similar interests and travel styles. View profiles and ratings.",
                  color: "from-cyan-500/10 to-blue-500/10",
                  iconColor: "text-cyan-500",
                },
                {
                  step: "03",
                  icon: Handshake,
                  title: "Join or Host",
                  description: "Join an existing trip or host your own. Coordinate dates, budgets, and activities together.",
                  color: "from-purple-500/10 to-pink-500/10",
                  iconColor: "text-purple-500",
                },
                {
                  step: "04",
                  icon: Plane,
                  title: "Travel Together",
                  description: "Embark on your adventure, create memories, and build friendships that last a lifetime.",
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

        {/* Safety & Trust Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-cyan-500/10 backdrop-blur-xl border border-white/10 p-8 sm:p-12 lg:p-16">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />

              <div className="relative z-10 space-y-8">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-8 w-1 bg-gradient-to-b from-amber-500 to-cyan-500 rounded-full" />
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Safety & Trust</h2>
                  </div>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Your safety and security are our top priorities. We've built multiple layers of protection to ensure
                    a safe and trustworthy community.
                  </p>
                </div>

                <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-3">
                  {[
                    {
                      icon: Shield,
                      title: "Verified Profiles",
                      description: "All users go through verification to ensure authenticity and build trust.",
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
                      icon: Lock,
                      title: "Secure Platform",
                      description: "Your personal information is protected with industry-standard security measures.",
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

                <div className="mt-8 p-6 rounded-2xl bg-background/60 backdrop-blur-xl border border-white/10">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-2">Community Guidelines</h4>
                      <p className="text-sm text-muted-foreground">
                        We maintain a respectful and inclusive community. All members are expected to follow our
                        community guidelines, which promote safety, respect, and positive interactions. Violations
                        may result in account suspension or removal from the platform.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Our Mission</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're on a mission to make travel more accessible, affordable, and enjoyable for everyone.
              </p>
            </div>

            <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Globe,
                  title: "Global Connection",
                  description: "Connect travelers from every corner of the world, breaking down barriers and building bridges between cultures.",
                  color: "from-amber-500/10 to-orange-500/10",
                  iconColor: "text-amber-500",
                },
                {
                  icon: Heart,
                  title: "Shared Experiences",
                  description: "We believe the best memories are made when shared. Travel together, split costs, and create lasting friendships.",
                  color: "from-cyan-500/10 to-blue-500/10",
                  iconColor: "text-cyan-500",
                },
                {
                  icon: Zap,
                  title: "Easy & Accessible",
                  description: "Making travel planning simple and accessible to everyone, regardless of budget or experience level.",
                  color: "from-purple-500/10 to-pink-500/10",
                  iconColor: "text-purple-500",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-8 space-y-4 hover:border-white/20 transition-all duration-300 hover:scale-105"
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                    <item.icon className={`h-8 w-8 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Why Choose TravelBuddy</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join thousands of travelers who have discovered the joy of shared adventures.
              </p>
            </div>

            <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2">
              {[
                {
                  icon: Users,
                  title: "Active Community",
                  stat: "10,000+",
                  description: "Active travelers from around the world",
                  color: "from-amber-500/10 to-orange-500/10",
                  iconColor: "text-amber-500",
                },
                {
                  icon: MapPin,
                  title: "Global Destinations",
                  stat: "150+",
                  description: "Countries and cities to explore",
                  color: "from-cyan-500/10 to-blue-500/10",
                  iconColor: "text-cyan-500",
                },
                {
                  icon: Calendar,
                  title: "Trips Organized",
                  stat: "5,000+",
                  description: "Successful trips completed",
                  color: "from-purple-500/10 to-pink-500/10",
                  iconColor: "text-purple-500",
                },
                {
                  icon: MessageCircle,
                  title: "Happy Travelers",
                  stat: "98%",
                  description: "Satisfaction rate from our community",
                  color: "from-green-500/10 to-emerald-500/10",
                  iconColor: "text-green-500",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-8 space-y-4 hover:border-white/20 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                        <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-cyan-500 bg-clip-text text-transparent">
                        {item.stat}
                      </div>
                    </div>
                  </div>
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
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">
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
                  <Link href="/register">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
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

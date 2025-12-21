import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Plane,
  MapPin,
  DollarSign,
  Luggage,
  Globe,
  Heart,
  Users,
  Calendar,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  Star,
  Camera,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Travel Tips",
  description: "Essential travel tips and advice for travelers. Learn about packing, budgeting, safety, cultural etiquette, and making the most of your travel experiences.",
  openGraph: {
    title: "Travel Tips & Advice - TravelBuddy",
    description: "Discover essential travel tips, packing guides, budgeting advice, and cultural insights to enhance your travel experiences.",
  },
};

export default function TravelTipsPage() {
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
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium bg-gradient-to-r from-amber-500 to-cyan-500 bg-clip-text text-transparent">
                Expert Advice
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight text-balance">
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 bg-clip-text text-transparent">
                Travel Tips
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
              Make the most of your travel experience with these helpful tips from our community 
              of experienced travelers. Learn from those who&apos;ve been there before.
            </p>
          </div>
        </section>

        {/* Planning Tips Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">Planning Your Trip</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Essential tips for planning a successful group travel experience
              </p>
            </div>

            <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2">
              {[
                {
                  icon: Calendar,
                  title: "Plan Ahead",
                  description: "Start planning at least 2-3 months in advance. This gives everyone time to coordinate schedules, book accommodations, and get the best deals on flights.",
                  tips: [
                    "Set clear dates early",
                    "Create a shared itinerary",
                    "Book accommodations together",
                    "Plan for flexibility",
                  ],
                  color: "from-amber-500/10 to-orange-500/10",
                  iconColor: "text-amber-500",
                },
                {
                  icon: DollarSign,
                  title: "Budget Wisely",
                  description: "Discuss budgets openly with your travel companions. Set clear expectations about shared expenses and individual costs.",
                  tips: [
                    "Create a shared expense tracker",
                    "Set a daily budget limit",
                    "Agree on payment methods",
                    "Keep receipts for transparency",
                  ],
                  color: "from-cyan-500/10 to-blue-500/10",
                  iconColor: "text-cyan-500",
                },
                {
                  icon: Users,
                  title: "Communicate Clearly",
                  description: "Open and honest communication is key to a successful group trip. Discuss expectations, preferences, and concerns before you travel.",
                  tips: [
                    "Use group chat for coordination",
                    "Share important documents",
                    "Discuss travel styles",
                    "Set ground rules together",
                  ],
                  color: "from-purple-500/10 to-pink-500/10",
                  iconColor: "text-purple-500",
                },
                {
                  icon: MapPin,
                  title: "Research Your Destination",
                  description: "Learn about your destination before you go. Research local customs, weather, currency, and must-see attractions.",
                  tips: [
                    "Check visa requirements",
                    "Learn basic local phrases",
                    "Research local customs",
                    "Download offline maps",
                  ],
                  color: "from-green-500/10 to-emerald-500/10",
                  iconColor: "text-green-500",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-6 space-y-4 hover:border-white/20 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                    <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <ul className="space-y-2 pt-2">
                    {item.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Packing Tips Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">Packing Smart</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Pack efficiently and avoid common packing mistakes
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Essentials Only",
                  items: [
                    "Pack versatile clothing",
                    "Bring travel-sized toiletries",
                    "Pack a first-aid kit",
                    "Include important documents",
                  ],
                },
                {
                  title: "Tech & Documents",
                  items: [
                    "Keep digital copies of documents",
                    "Bring portable charger",
                    "Download offline apps",
                    "Carry travel adapters",
                  ],
                },
                {
                  title: "Comfort Items",
                  items: [
                    "Pack comfortable shoes",
                    "Bring a travel pillow",
                    "Include snacks",
                    "Pack entertainment",
                  ],
                },
              ].map((section, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-6"
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Luggage className="h-5 w-5 text-amber-500" />
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-amber-500 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* During Your Trip Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">During Your Trip</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Make the most of your travel experience with these on-the-go tips
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: Camera,
                  title: "Capture Memories",
                  description: "Take photos and videos to remember your journey. But don't forget to put the camera down and enjoy the moment too.",
                  color: "from-amber-500/10 to-orange-500/10",
                  iconColor: "text-amber-500",
                },
                {
                  icon: Heart,
                  title: "Be Flexible",
                  description: "Things don't always go as planned. Stay flexible and open to new experiences. Sometimes the best memories come from unexpected moments.",
                  color: "from-cyan-500/10 to-blue-500/10",
                  iconColor: "text-cyan-500",
                },
                {
                  icon: Globe,
                  title: "Respect Local Culture",
                  description: "Learn about and respect local customs, traditions, and etiquette. This shows respect and often leads to more authentic experiences.",
                  color: "from-purple-500/10 to-pink-500/10",
                  iconColor: "text-purple-500",
                },
                {
                  icon: Users,
                  title: "Balance Group & Solo Time",
                  description: "It's okay to spend some time alone or in smaller groups. Balance group activities with personal time to recharge.",
                  color: "from-green-500/10 to-emerald-500/10",
                  iconColor: "text-green-500",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-6"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center border border-white/10`}>
                        <item.icon className={`h-8 w-8 ${item.iconColor}`} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Money-Saving Tips Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">Money-Saving Tips</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Travel more for less with these budget-friendly strategies
              </p>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-cyan-500/10 backdrop-blur-xl border border-white/10 p-8 sm:p-12">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    Save on Accommodations
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Book shared accommodations to split costs",
                      "Look for group discounts",
                      "Consider hostels or vacation rentals",
                      "Travel during off-peak seasons",
                    ].map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Plane className="h-5 w-5 text-cyan-500" />
                    Save on Transportation
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Book flights early for better prices",
                      "Use public transportation",
                      "Share rides and taxis",
                      "Walk or bike when possible",
                    ].map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Heart className="h-5 w-5 text-amber-500" />
                    Save on Food
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Cook meals together when possible",
                      "Eat at local restaurants",
                      "Share large portions",
                      "Buy groceries for snacks",
                    ].map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Star className="h-5 w-5 text-purple-500" />
                    Save on Activities
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Look for group discounts",
                      "Research free attractions",
                      "Use city passes",
                      "Take advantage of student discounts",
                    ].map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* After Your Trip Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">After Your Trip</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Wrap up your journey and help others in the community
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: Star,
                  title: "Leave Reviews",
                  description: "Share your experience by leaving honest reviews. Help other travelers make informed decisions.",
                  color: "from-amber-500/10 to-orange-500/10",
                  iconColor: "text-amber-500",
                },
                {
                  icon: Camera,
                  title: "Share Photos",
                  description: "Upload photos from your trip to inspire others and help them visualize the experience.",
                  color: "from-cyan-500/10 to-blue-500/10",
                  iconColor: "text-cyan-500",
                },
                {
                  icon: Heart,
                  title: "Stay Connected",
                  description: "Keep in touch with your travel companions. Many friendships formed on trips last a lifetime.",
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
                  <h3 className="text-xl font-semibold">{item.title}</h3>
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
                Ready to Put These Tips to Use?
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty">
                Join our community and start planning your next adventure with fellow travelers!
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


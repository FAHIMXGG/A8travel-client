import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Users,
  Eye,
  MessageCircle,
  Flag,
  ArrowRight,
  Phone,
  Mail,
  AlertCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Safety Guidelines",
  description: "Important safety guidelines for travelers using TravelBuddy. Learn how to stay safe while meeting new people, traveling in groups, and exploring new destinations.",
  openGraph: {
    title: "Safety Guidelines for Travelers - TravelBuddy",
    description: "Essential safety tips and guidelines to ensure safe and secure travel experiences when connecting with travel companions.",
  },
};

export default function SafetyGuidelinesPage() {
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
              <Shield className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium bg-gradient-to-r from-amber-500 to-cyan-500 bg-clip-text text-transparent">
                Your Safety Matters
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight text-balance">
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 bg-clip-text text-transparent">
                Safety Guidelines
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
              Your safety and security are our top priorities. Follow these guidelines to ensure 
              a safe and enjoyable travel experience for everyone in our community.
            </p>
          </div>
        </section>

        {/* Before You Travel Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">Before You Travel</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Important steps to take before joining or hosting a trip
              </p>
            </div>

            <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2">
              {[
                {
                  icon: Users,
                  title: "Verify Profiles",
                  description: "Always check that profiles are verified. Look for verification badges and read reviews from previous trips. If something seems off, trust your instincts.",
                  color: "from-amber-500/10 to-orange-500/10",
                  iconColor: "text-amber-500",
                },
                {
                  icon: MessageCircle,
                  title: "Communicate First",
                  description: "Have detailed conversations with potential travel companions before committing. Discuss expectations, travel style, budget, and itinerary thoroughly.",
                  color: "from-cyan-500/10 to-blue-500/10",
                  iconColor: "text-cyan-500",
                },
                {
                  icon: Eye,
                  title: "Review Carefully",
                  description: "Read all trip details, reviews, and host information. Check travel dates, budget breakdown, and cancellation policies before joining.",
                  color: "from-purple-500/10 to-pink-500/10",
                  iconColor: "text-purple-500",
                },
                {
                  icon: Phone,
                  title: "Share Contact Info",
                  description: "Exchange contact information with your travel companions and share your itinerary with family or friends. Keep emergency contacts handy.",
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
                <div className="h-8 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">During Your Trip</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Stay safe and respectful while traveling with your companions
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: "Stay Connected",
                  items: [
                    "Keep your phone charged and accessible",
                    "Share your location with trusted contacts",
                    "Check in regularly with family or friends",
                    "Have local emergency numbers saved",
                  ],
                },
                {
                  title: "Respect Boundaries",
                  items: [
                    "Respect personal space and privacy",
                    "Communicate openly about comfort levels",
                    "Be mindful of cultural differences",
                    "Follow group decisions and consensus",
                  ],
                },
                {
                  title: "Financial Safety",
                  items: [
                    "Keep receipts for shared expenses",
                    "Use secure payment methods",
                    "Don't share sensitive financial information",
                    "Agree on budget and payment terms upfront",
                  ],
                },
                {
                  title: "Health & Wellbeing",
                  items: [
                    "Carry necessary medications and documents",
                    "Share any health concerns with your group",
                    "Stay hydrated and get adequate rest",
                    "Know the location of nearest medical facilities",
                  ],
                },
              ].map((section, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-6"
                >
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Red Flags Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-red-500 to-orange-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">Warning Signs</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Be cautious if you encounter any of these red flags
              </p>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-500/10 via-orange-500/10 to-amber-500/10 backdrop-blur-xl border border-red-500/20 p-8 sm:p-12">
              <div className="space-y-6">
                {[
                  "Requests for upfront payment before meeting or verifying trip details",
                  "Pressure to make quick decisions or skip verification steps",
                  "Vague or inconsistent information about the trip",
                  "Unwillingness to share contact information or meet virtually first",
                  "Requests to communicate outside the platform before establishing trust",
                  "Suspicious profile with no reviews or verification",
                  "Unrealistic promises or offers that seem too good to be true",
                  "Reluctance to answer questions about the trip or themselves",
                ].map((warning, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground flex-1">{warning}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Reporting Issues Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">Reporting Issues</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We take safety seriously. Report any concerns immediately
              </p>
            </div>

            <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2">
              {[
                {
                  icon: Flag,
                  title: "Report Inappropriate Behavior",
                  description: "If you encounter harassment, discrimination, or any form of inappropriate behavior, report it immediately through our reporting system.",
                  color: "from-amber-500/10 to-orange-500/10",
                  iconColor: "text-amber-500",
                },
                {
                  icon: AlertCircle,
                  title: "Report Safety Concerns",
                  description: "Trust your instincts. If you feel unsafe or notice suspicious activity, report it right away. We investigate all reports promptly.",
                  color: "from-cyan-500/10 to-blue-500/10",
                  iconColor: "text-cyan-500",
                },
                {
                  icon: Shield,
                  title: "Emergency Situations",
                  description: "In case of emergency, contact local authorities immediately. Then notify our support team so we can provide assistance.",
                  color: "from-purple-500/10 to-pink-500/10",
                  iconColor: "text-purple-500",
                },
                {
                  icon: Mail,
                  title: "Contact Support",
                  description: "Our support team is available 24/7 to help with any safety concerns, questions, or issues you may encounter.",
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
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Guidelines Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-cyan-500/10 backdrop-blur-xl border border-white/10 p-8 sm:p-12 lg:p-16">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />

              <div className="relative z-10 space-y-8">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-8 w-1 bg-gradient-to-b from-amber-500 to-cyan-500 rounded-full" />
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">Community Guidelines</h2>
                  </div>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    We maintain a respectful and inclusive community for all travelers
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Do&apos;s
                    </h3>
                    <ul className="space-y-2">
                      {[
                        "Be respectful and courteous to all members",
                        "Communicate clearly and honestly",
                        "Follow through on commitments",
                        "Leave honest and constructive reviews",
                        "Respect cultural differences",
                        "Share costs fairly and transparently",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Don&apos;ts
                    </h3>
                    <ul className="space-y-2">
                      {[
                        "Don't share false information",
                        "Don't harass or discriminate",
                        "Don't cancel last minute without notice",
                        "Don't request money outside the platform",
                        "Don't ignore safety concerns",
                        "Don't violate local laws or customs",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
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
                Your Safety is Our Priority
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty">
                If you have any safety concerns or questions, don&apos;t hesitate to reach out to our support team.
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
                  <Link href="/faq">View FAQ</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


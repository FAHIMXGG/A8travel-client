import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Users,
  Heart,
  CheckCircle,
  AlertTriangle,
  Shield,
  MessageCircle,
  Handshake,
  Globe,
  ArrowRight,
  Ban,
  Star,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Community Guidelines",
  description: "Read TravelBuddy's community guidelines to understand expected behavior, respect, and how to create a positive environment for all travelers.",
  openGraph: {
    title: "Community Guidelines - TravelBuddy",
    description: "Learn about our community standards and how to be a respectful and positive member of the TravelBuddy community.",
  },
};

export default function CommunityGuidelinesPage() {
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
              <Users className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium bg-gradient-to-r from-amber-500 to-cyan-500 bg-clip-text text-transparent">
                Building a Positive Community
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight text-balance">
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 bg-clip-text text-transparent">
                Community Guidelines
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
              Our community guidelines help ensure TravelBuddy remains a safe, respectful, and welcoming space 
              for all travelers. Together, we create amazing travel experiences.
            </p>
          </div>
        </section>

        {/* Core Values */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">Our Core Values</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These principles guide our community and help us all have positive experiences
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: Heart,
                  title: "Respect",
                  description: "Treat everyone with kindness, dignity, and respect, regardless of background, beliefs, or travel style.",
                  color: "from-amber-500/10 to-orange-500/10",
                  iconColor: "text-amber-500",
                },
                {
                  icon: Handshake,
                  title: "Trust",
                  description: "Be honest, reliable, and transparent. Build trust through consistent actions and clear communication.",
                  color: "from-cyan-500/10 to-blue-500/10",
                  iconColor: "text-cyan-500",
                },
                {
                  icon: Globe,
                  title: "Inclusivity",
                  description: "Welcome travelers from all walks of life. Embrace diversity and create an inclusive environment for everyone.",
                  color: "from-purple-500/10 to-pink-500/10",
                  iconColor: "text-purple-500",
                },
              ].map((value, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-6 space-y-4 hover:border-white/20 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4`}>
                    <value.icon className={`h-6 w-6 ${value.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Do's Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">What We Encourage</h2>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  title: "Communication",
                  items: [
                    "Communicate clearly and honestly with potential travel companions",
                    "Respond to messages and requests in a timely manner",
                    "Share important information about your travel plans",
                    "Discuss expectations, budgets, and preferences openly",
                  ],
                },
                {
                  title: "Reliability",
                  items: [
                    "Follow through on commitments and agreements",
                    "Show up on time for planned activities",
                    "Honor financial commitments and split costs fairly",
                    "Give adequate notice if plans need to change",
                  ],
                },
                {
                  title: "Respect",
                  items: [
                    "Respect others&apos; boundaries and personal space",
                    "Be considerate of different travel styles and preferences",
                    "Respect local cultures, customs, and laws",
                    "Listen to others and value their perspectives",
                  ],
                },
                {
                  title: "Community Building",
                  items: [
                    "Leave honest and constructive reviews",
                    "Help newcomers feel welcome",
                    "Share knowledge and travel tips",
                    "Report inappropriate behavior when you see it",
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

        {/* Don'ts Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-red-500 to-orange-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">What We Prohibit</h2>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-500/10 via-orange-500/10 to-amber-500/10 backdrop-blur-xl border border-red-500/20 p-8 sm:p-12">
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Harassment & Discrimination",
                    items: [
                      "No harassment, bullying, or intimidation",
                      "No discrimination based on race, gender, religion, or orientation",
                      "No hate speech or offensive language",
                      "No unwanted advances or inappropriate behavior",
                    ],
                  },
                  {
                    title: "False Information",
                    items: [
                      "No fake profiles or impersonation",
                      "No misleading information about trips or yourself",
                      "No false reviews or ratings",
                      "No spam or unsolicited messages",
                    ],
                  },
                  {
                    title: "Fraud & Scams",
                    items: [
                      "No fraudulent activities or scams",
                      "No requesting money outside the platform",
                      "No selling products or services",
                      "No phishing or identity theft attempts",
                    ],
                  },
                  {
                    title: "Safety Violations",
                    items: [
                      "No sharing others&apos; personal information",
                      "No stalking or persistent unwanted contact",
                      "No threats or violent behavior",
                      "No illegal activities",
                    ],
                  },
                ].map((section, index) => (
                  <div key={index} className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Ban className="h-5 w-5 text-red-500" />
                      {section.title}
                    </h3>
                    <ul className="space-y-2">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Reviews & Ratings */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">Reviews & Ratings</h2>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  Writing Good Reviews
                </h3>
                <ul className="space-y-2">
                  {[
                    "Be honest and specific about your experience",
                    "Focus on facts and observable behavior",
                    "Be constructive and fair in your feedback",
                    "Respect privacy - don&apos;t share personal details",
                    "Leave reviews promptly after trips",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Review Guidelines
                </h3>
                <ul className="space-y-2">
                  {[
                    "No fake or paid reviews",
                    "No reviews based on discrimination",
                    "No personal attacks or harassment",
                    "No reviews for trips you didn&apos;t participate in",
                    "No threats or extortion in reviews",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Ban className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Enforcement */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">Enforcement</h2>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-cyan-500" />
                    How We Enforce Guidelines
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We take violations of our community guidelines seriously. When violations are reported or detected, 
                    we may take the following actions:
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Warning: For minor violations, we may issue a warning",
                      "Temporary suspension: For repeated or moderate violations",
                      "Permanent ban: For serious violations or repeated offenses",
                      "Content removal: Removal of inappropriate content or profiles",
                      "Legal action: In cases of illegal activity",
                    ].map((action, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-green-500" />
                    Reporting Violations
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    If you encounter behavior that violates our guidelines, please report it immediately through our 
                    reporting system. We investigate all reports and take appropriate action to maintain a safe community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-cyan-500/10 backdrop-blur-xl border border-white/10 p-8 sm:p-12 lg:p-16">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />

              <div className="relative z-10 space-y-6 text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold text-balance">
                  Together We Build a Better Community
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                  By following these guidelines, we all contribute to making TravelBuddy a safe, welcoming, 
                  and enjoyable platform for travelers worldwide.
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
                    <Link href="/contact-us">Report an Issue</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


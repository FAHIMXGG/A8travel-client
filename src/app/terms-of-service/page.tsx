import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle,
  Shield,
  Users,
  Plane,
  ArrowRight,
  Ban,
  Scale,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read TravelBuddy's terms of service to understand the rules and guidelines for using our platform.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfServicePage() {
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
              <Scale className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium bg-gradient-to-r from-amber-500 to-cyan-500 bg-clip-text text-transparent">
                Legal Agreement
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight text-balance">
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 bg-clip-text text-transparent">
                Terms of Service
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Please read these terms carefully before using TravelBuddy. By using our platform, you agree to be bound by these terms.
            </p>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-8">
              <h2 className="text-2xl sm:text-3xl font-headline font-bold mb-4">Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you and TravelBuddy 
                regarding your use of our travel companion platform. By accessing or using TravelBuddy, you agree to be bound 
                by these Terms. If you do not agree with any part of these Terms, you must not use our platform.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. Your continued use of the platform after changes 
                constitutes acceptance of the modified Terms.
              </p>
            </div>
          </div>
        </section>

        {/* Eligibility */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">Eligibility & Account</h2>
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-amber-500" />
                  Age Requirement
                </h3>
                <p className="text-sm text-muted-foreground">
                  You must be at least 18 years old to use TravelBuddy. By creating an account, you represent and warrant 
                  that you are of legal age to form a binding contract and meet all eligibility requirements.
                </p>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-cyan-500" />
                  Account Responsibility
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You are responsible for:
                </p>
                <ul className="space-y-2">
                  {[
                    "Maintaining the confidentiality of your account credentials",
                    "All activities that occur under your account",
                    "Providing accurate and truthful information",
                    "Keeping your account information up to date",
                    "Notifying us immediately of any unauthorized access",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* User Conduct */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">User Conduct</h2>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Acceptable Use
                </h3>
                <ul className="space-y-2">
                  {[
                    "Be respectful and courteous to all users",
                    "Provide accurate and truthful information",
                    "Respect others&apos; privacy and boundaries",
                    "Follow all applicable laws and regulations",
                    "Report suspicious or inappropriate behavior",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-red-500/20 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Ban className="h-5 w-5 text-red-500" />
                  Prohibited Activities
                </h3>
                <ul className="space-y-2">
                  {[
                    "Harassment, discrimination, or hate speech",
                    "Sharing false or misleading information",
                    "Spam, scams, or fraudulent activities",
                    "Violating others&apos; intellectual property",
                    "Attempting to hack or disrupt the platform",
                    "Selling or soliciting outside the platform",
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
        </section>

        {/* Travel Plans & Payments */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">Travel Plans & Payments</h2>
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Plane className="h-5 w-5 text-amber-500" />
                  Platform Role
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  TravelBuddy is a platform that connects travelers. We do not:
                </p>
                <ul className="space-y-2">
                  {[
                    "Organize, operate, or provide travel services",
                    "Handle payments between users",
                    "Guarantee the accuracy of travel plan information",
                    "Assume responsibility for user conduct during trips",
                    "Provide insurance or liability coverage",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-6">
                <h3 className="text-xl font-semibold mb-4">Payment & Financial Responsibility</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Users are solely responsible for:
                </p>
                <ul className="space-y-2">
                  {[
                    "Coordinating and splitting costs among themselves",
                    "Using secure payment methods",
                    "Resolving payment disputes independently",
                    "Obtaining appropriate travel insurance",
                    "All expenses related to their travel plans",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Liability & Disclaimers */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">Liability & Disclaimers</h2>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">No Warranty</h3>
                  <p className="text-sm text-muted-foreground">
                    TravelBuddy is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, 
                    either express or implied. We do not guarantee that the platform will be uninterrupted, secure, or error-free.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Limitation of Liability</h3>
                  <p className="text-sm text-muted-foreground">
                    To the maximum extent permitted by law, TravelBuddy shall not be liable for any indirect, incidental, 
                    special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly 
                    or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the platform.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">User Responsibility</h3>
                  <p className="text-sm text-muted-foreground">
                    You acknowledge that you use TravelBuddy at your own risk. You are solely responsible for your interactions 
                    with other users, your travel plans, and your safety. We are not responsible for the conduct of any user 
                    or for any issues that arise during or as a result of travel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Termination */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">Termination</h2>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold mb-3">By You</h3>
                <p className="text-sm text-muted-foreground">
                  You may terminate your account at any time by deleting it through your account settings or contacting our support team.
                </p>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold mb-3">By Us</h3>
                <p className="text-sm text-muted-foreground">
                  We may suspend or terminate your account if you violate these Terms, engage in fraudulent activity, 
                  or for any other reason we deem necessary to protect our platform and users.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-cyan-500/10 backdrop-blur-xl border border-white/10 p-8 sm:p-12 lg:p-16">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />

              <div className="relative z-10 space-y-6 text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">
                  Questions About Terms?
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                  If you have any questions about these Terms of Service, please contact us.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25"
                  >
                    <Link href="/contact-us">
                      Contact Us
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-white/10 hover:border-white/20 hover:bg-white/5 backdrop-blur-sm bg-transparent"
                  >
                    <Link href="/privacy-policy">Privacy Policy</Link>
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


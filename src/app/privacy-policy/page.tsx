import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Lock,
  Eye,
  FileText,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Globe,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read TravelBuddy's privacy policy to understand how we collect, use, and protect your personal information.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
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
                Your Privacy Matters
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight text-balance">
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 bg-clip-text text-transparent">
                Privacy Policy
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              At TravelBuddy, we are committed to protecting your privacy and ensuring the security of your personal information.
            </p>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-8">
              <h2 className="text-2xl sm:text-3xl font-headline font-bold mb-4">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                TravelBuddy (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal data. 
                This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our 
                travel companion platform. By using TravelBuddy, you agree to the collection and use of information in accordance 
                with this policy.
              </p>
            </div>
          </div>
        </section>

        {/* Information We Collect */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">Information We Collect</h2>
              </div>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: FileText,
                  title: "Personal Information",
                  description: "When you create an account, we collect information such as your name, email address, profile photo, and any other information you choose to provide.",
                  items: [
                    "Name and contact information",
                    "Email address",
                    "Profile photos and images",
                    "Date of birth (for age verification)",
                    "Location information",
                  ],
                  color: "from-amber-500/10 to-orange-500/10",
                  iconColor: "text-amber-500",
                },
                {
                  icon: Globe,
                  title: "Travel Information",
                  description: "We collect information about your travel plans, preferences, and history to help you connect with compatible travel companions.",
                  items: [
                    "Travel destinations and plans",
                    "Travel dates and itineraries",
                    "Budget information",
                    "Travel interests and preferences",
                    "Travel history and reviews",
                  ],
                  color: "from-cyan-500/10 to-blue-500/10",
                  iconColor: "text-cyan-500",
                },
                {
                  icon: Eye,
                  title: "Usage Data",
                  description: "We automatically collect certain information when you use our platform to improve your experience and our services.",
                  items: [
                    "Device information and IP address",
                    "Browser type and version",
                    "Pages visited and time spent",
                    "Search queries and interactions",
                    "Cookies and similar tracking technologies",
                  ],
                  color: "from-purple-500/10 to-pink-500/10",
                  iconColor: "text-purple-500",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-6 space-y-4"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}>
                      <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                    </div>
                    <div className="flex-1 space-y-3">
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <ul className="space-y-2">
                        {item.items.map((listItem, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                            <span>{listItem}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">How We Use Your Information</h2>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                "To provide and maintain our platform services",
                "To match you with compatible travel companions",
                "To facilitate communication between users",
                "To process and manage travel plans",
                "To send you updates and notifications",
                "To improve our platform and user experience",
                "To detect and prevent fraud or abuse",
                "To comply with legal obligations",
              ].map((use, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-4"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground flex-1">{use}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Data Sharing & Disclosure */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">Data Sharing & Disclosure</h2>
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-amber-500" />
                  We Do Not Sell Your Data
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We do not sell, rent, or trade your personal information to third parties for marketing purposes.
                </p>
                <p className="text-sm text-muted-foreground">
                  We may share your information only in the following circumstances:
                </p>
                <ul className="space-y-2 mt-4">
                  {[
                    "With other users: Your profile information and travel plans are visible to other users to facilitate connections",
                    "Service providers: We may share data with trusted service providers who assist in operating our platform",
                    "Legal requirements: We may disclose information if required by law or to protect our rights and safety",
                    "Business transfers: In the event of a merger or acquisition, your data may be transferred",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Data Security */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">Data Security</h2>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-3">Security Measures</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We implement industry-standard security measures to protect your personal information:
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Encryption of data in transit and at rest",
                      "Secure authentication and access controls",
                      "Regular security audits and updates",
                      "Limited access to personal data on a need-to-know basis",
                      "Secure hosting infrastructure",
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
          </div>
        </section>

        {/* Your Rights */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold">Your Rights</h2>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  title: "Access",
                  description: "You have the right to access and receive a copy of your personal data.",
                },
                {
                  title: "Correction",
                  description: "You can update or correct your personal information at any time through your account settings.",
                },
                {
                  title: "Deletion",
                  description: "You can request deletion of your account and personal data, subject to legal obligations.",
                },
                {
                  title: "Data Portability",
                  description: "You can request a copy of your data in a portable format.",
                },
                {
                  title: "Opt-Out",
                  description: "You can opt-out of marketing communications at any time.",
                },
                {
                  title: "Objection",
                  description: "You can object to certain processing of your personal data.",
                },
              ].map((right, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-6"
                >
                  <h3 className="text-lg font-semibold mb-2">{right.title}</h3>
                  <p className="text-sm text-muted-foreground">{right.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cookies */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-8">
              <h2 className="text-2xl sm:text-3xl font-headline font-bold mb-4">Cookies & Tracking Technologies</h2>
              <p className="text-muted-foreground mb-4">
                We use cookies and similar tracking technologies to enhance your experience, analyze usage, and assist with 
                marketing efforts. You can control cookies through your browser settings, though this may affect platform functionality.
              </p>
              <p className="text-sm text-muted-foreground">
                Types of cookies we use:
              </p>
              <ul className="space-y-2 mt-4">
                {[
                  "Essential cookies: Required for platform functionality",
                  "Analytics cookies: Help us understand how users interact with our platform",
                  "Preference cookies: Remember your settings and preferences",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-cyan-500/10 backdrop-blur-xl border border-white/10 p-8 sm:p-12 lg:p-16">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />

              <div className="relative z-10 space-y-6">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold text-center">
                  Questions About Privacy?
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground text-center max-w-2xl mx-auto">
                  If you have any questions about this Privacy Policy or our data practices, please contact us.
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
                    <Link href="/terms-of-service">Terms of Service</Link>
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


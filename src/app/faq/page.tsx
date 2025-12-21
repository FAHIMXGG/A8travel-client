import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  Users,
  Plane,
  DollarSign,
  Shield,
  Calendar,
  MessageCircle,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about TravelBuddy. Find answers about creating accounts, finding travel buddies, joining trips, safety, payments, and more.",
  openGraph: {
    title: "TravelBuddy FAQ - Frequently Asked Questions",
    description: "Get answers to common questions about using TravelBuddy to find travel companions and join group trips.",
  },
};

export default function FAQPage() {
  const faqCategories = [
    {
      title: "Getting Started",
      icon: Users,
      questions: [
        {
          q: "How do I create an account?",
          a: "Creating an account is easy! Click on the 'Register' button in the top navigation, fill in your details, verify your email, and you're ready to start connecting with travelers.",
        },
        {
          q: "Is TravelBuddy free to use?",
          a: "Yes, creating an account and browsing travel plans is completely free. You only pay for the actual travel expenses when you join a trip, which are shared among all participants.",
        },
        {
          q: "Do I need to verify my profile?",
          a: "While verification is not mandatory, we highly recommend it. Verified profiles build trust and make it easier to connect with other travelers. Verification helps ensure a safe community for everyone.",
        },
        {
          q: "Can I use TravelBuddy without creating a travel plan?",
          a: "Absolutely! You can browse existing travel plans and join trips that interest you. You don't need to host a trip to use the platform.",
        },
      ],
    },
    {
      title: "Finding & Joining Trips",
      icon: Plane,
      questions: [
        {
          q: "How do I find travel plans that match my interests?",
          a: "Use our search and filter features to find trips by destination, dates, budget, travel type, and more. You can also browse featured and latest travel plans on the homepage.",
        },
        {
          q: "How do I join a travel plan?",
          a: "When you find a trip you're interested in, click on it to view details, then click 'Join Trip' or 'Request to Join'. The host will review your request and approve if you're a good match.",
        },
        {
          q: "What happens after I request to join a trip?",
          a: "The host will review your profile and request. They may ask you questions or discuss trip details. Once approved, you'll be added to the trip and can start coordinating with other participants.",
        },
        {
          q: "Can I join multiple trips?",
          a: "Yes, you can join multiple trips as long as the dates don't conflict. Make sure you can commit to all the trips you join.",
        },
        {
          q: "What if a trip is full?",
          a: "If a trip reaches its maximum participants, it will be marked as 'FULL'. You can contact the host to see if there's a waiting list or look for similar trips.",
        },
      ],
    },
    {
      title: "Hosting & Creating Trips",
      icon: Calendar,
      questions: [
        {
          q: "How do I create a travel plan?",
          a: "Go to your dashboard and click 'Create Travel Plan'. Fill in details like destination, dates, budget, description, and upload photos. Once published, other travelers can find and join your trip.",
        },
        {
          q: "Can I edit my travel plan after creating it?",
          a: "Yes, you can edit your travel plan at any time from your dashboard. However, if people have already joined, make sure to communicate any significant changes with them.",
        },
        {
          q: "How do I manage participants?",
          a: "As a host, you can view join requests, approve or decline them, and manage your trip participants through your dashboard. You can also communicate with participants through the platform.",
        },
        {
          q: "What if I need to cancel my trip?",
          a: "If you need to cancel, update your trip status and notify all participants immediately. Be considerate and give as much notice as possible so others can make alternative plans.",
        },
        {
          q: "Can I set a maximum number of participants?",
          a: "Yes, when creating your travel plan, you can set a maximum number of participants. This helps you manage group size and ensure everyone has a great experience.",
        },
      ],
    },
    {
      title: "Safety & Security",
      icon: Shield,
      questions: [
        {
          q: "How do you ensure user safety?",
          a: "We have multiple safety measures including profile verification, rating systems, and reporting features. We also provide safety guidelines and encourage users to communicate before meeting. Always trust your instincts and report any concerns.",
        },
        {
          q: "What should I do if I feel unsafe?",
          a: "If you feel unsafe at any point, remove yourself from the situation immediately and contact local authorities if necessary. Then report the incident through our platform so we can take appropriate action.",
        },
        {
          q: "Are users verified?",
          a: "We offer profile verification to help build trust. While not all users are verified, we encourage everyone to verify their profiles. Always check profiles, read reviews, and communicate before committing to a trip.",
        },
        {
          q: "How do I report inappropriate behavior?",
          a: "You can report any inappropriate behavior through the reporting feature on user profiles or travel plans. We take all reports seriously and investigate promptly.",
        },
      ],
    },
    {
      title: "Payments & Budgets",
      icon: DollarSign,
      questions: [
        {
          q: "How do payments work?",
          a: "TravelBuddy doesn't handle payments directly. Participants coordinate and split costs among themselves. We recommend using secure payment methods and keeping receipts for transparency.",
        },
        {
          q: "How should we split costs?",
          a: "Costs are typically split equally among all participants, but this can be discussed and agreed upon by the group. Some expenses like personal items or optional activities may be individual.",
        },
        {
          q: "What if someone doesn't pay their share?",
          a: "We recommend discussing payment expectations upfront and using secure payment methods. If issues arise, try to resolve them through communication. In serious cases, you can report the issue to our support team.",
        },
        {
          q: "Are there any fees for using TravelBuddy?",
          a: "No, TravelBuddy is free to use. You only pay for actual travel expenses which are shared among trip participants, not to us.",
        },
      ],
    },
    {
      title: "General Questions",
      icon: HelpCircle,
      questions: [
        {
          q: "Can I travel solo and find companions?",
          a: "Absolutely! Many travelers use TravelBuddy to find companions for solo trips. You can join existing trips or create your own and invite others to join you.",
        },
        {
          q: "What types of trips can I find?",
          a: "You can find all types of trips including adventure travel, cultural tours, beach vacations, city breaks, backpacking trips, and more. Use filters to find trips that match your travel style.",
        },
        {
          q: "How do I contact other users?",
          a: "Once you've joined a trip or had a request approved, you can message other participants through the platform's messaging system.",
        },
        {
          q: "Can I leave a review after a trip?",
          a: "Yes! After a trip, you can leave reviews for your travel companions and the trip experience. This helps build trust in the community and helps others make informed decisions.",
        },
        {
          q: "What if I have a problem or question?",
          a: "You can contact our support team through the platform or email. We're here to help with any questions or concerns you may have.",
        },
      ],
    },
  ];

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
              <HelpCircle className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium bg-gradient-to-r from-amber-500 to-cyan-500 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight text-balance">
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 bg-clip-text text-transparent">
                FAQ
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
              Find answers to common questions about using TravelBuddy. 
              Can&apos;t find what you&apos;re looking for? Contact our support team.
            </p>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto space-y-16">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                    categoryIndex % 4 === 0 ? "from-amber-500/10 to-orange-500/10" :
                    categoryIndex % 4 === 1 ? "from-cyan-500/10 to-blue-500/10" :
                    categoryIndex % 4 === 2 ? "from-purple-500/10 to-pink-500/10" :
                    "from-green-500/10 to-emerald-500/10"
                  } flex items-center justify-center border border-white/10`}>
                    <category.icon className={`h-6 w-6 ${
                      categoryIndex % 4 === 0 ? "text-amber-500" :
                      categoryIndex % 4 === 1 ? "text-cyan-500" :
                      categoryIndex % 4 === 2 ? "text-purple-500" :
                      "text-green-500"
                    }`} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-headline font-bold">{category.title}</h2>
                </div>

                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => (
                    <div
                      key={faqIndex}
                      className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-1" />
                          <h3 className="text-lg font-semibold flex-1">{faq.q}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground pl-8">{faq.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Still Have Questions Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-cyan-500/10 backdrop-blur-xl border border-white/10 p-8 sm:p-12 lg:p-16">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />

              <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border border-white/10 mb-4">
                  <MessageCircle className="h-8 w-8 text-amber-500" />
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold text-balance">
                  Still Have Questions?
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground text-pretty">
                  Our support team is here to help! Contact us if you can&apos;t find the answer you&apos;re looking for.
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
                    <Link href="/safety-guidelines">Safety Guidelines</Link>
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


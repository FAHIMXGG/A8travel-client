import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import { Toaster as HotToaster } from "react-hot-toast"
import { Footer } from "@/components/Footer";
import { Bebas_Neue, Montserrat, Raleway, Pacifico } from "next/font/google";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-subtext",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-subtext-alt",
  display: "swap",
});

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-accent",
  display: "swap",
});


export const metadata: Metadata = {
  title: {
    default: "TravelBuddy - Find Your Perfect Travel Companion",
    template: "%s | TravelBuddy",
  },
  description: "Connect with like-minded travelers, join group trips, and explore the world together. Find travel buddies, create travel plans, and share amazing adventures.",
  keywords: ["travel buddy", "travel companion", "group travel", "travel plans", "find travelers", "travel community"],
  authors: [{ name: "TravelBuddy" }],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "TravelBuddy",
    title: "TravelBuddy - Find Your Perfect Travel Companion",
    description: "Connect with like-minded travelers, join group trips, and explore the world together.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TravelBuddy - Find Your Perfect Travel Companion",
    description: "Connect with like-minded travelers, join group trips, and explore the world together.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bebasNeue.variable} ${montserrat.variable} ${raleway.variable} ${pacifico.variable} min-h-screen bg-background text-foreground`} suppressHydrationWarning>
        <Providers>
          <Navbar />
          <HotToaster position="top-center" />
          <main className="container mx-auto px-4 py-6">{children}</main>
          <Footer/>
        </Providers>
      </body>
    </html>
  );
}

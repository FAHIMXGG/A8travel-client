import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Travel Buddy",
  description: "Search and connect with like-minded travelers. Find your perfect travel companion based on interests, destinations, and travel style.",
  openGraph: {
    title: "Find Your Perfect Travel Buddy",
    description: "Connect with travelers who share your interests and travel style. Find your ideal travel companion today.",
  },
};

export default function FindTravelBuddyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}





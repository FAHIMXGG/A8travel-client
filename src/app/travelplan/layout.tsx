import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel Plans",
  description: "Browse and discover amazing travel plans. Join group trips, find travel companions, and explore destinations around the world.",
  openGraph: {
    title: "Travel Plans - Find Your Next Adventure",
    description: "Browse travel plans and join group trips to destinations around the world.",
  },
};

export default function TravelPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}






import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Profile",
  description: "Update your TravelBuddy profile information, travel interests, visited countries, and gallery.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}




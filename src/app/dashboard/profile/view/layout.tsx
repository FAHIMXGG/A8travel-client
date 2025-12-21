import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "View Profile",
  description: "View your TravelBuddy profile as it appears to other users.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ViewProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


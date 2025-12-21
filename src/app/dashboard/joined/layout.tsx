import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Joined Travel Plans",
  description: "View all the travel plans you've joined and manage your upcoming trips.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function JoinedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


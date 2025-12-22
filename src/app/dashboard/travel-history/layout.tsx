import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel History",
  description: "View your travel history and past trips you've participated in.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TravelHistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}





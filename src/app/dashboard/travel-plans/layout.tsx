import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Travel Plans",
  description: "Manage your travel plans. View, edit, and organize all the travel plans you've created.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TravelPlansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}




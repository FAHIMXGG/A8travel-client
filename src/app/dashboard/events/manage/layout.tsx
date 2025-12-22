import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Events",
  description: "Manage all your travel plans and events. View, edit, and organize your hosted trips.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ManageEventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}






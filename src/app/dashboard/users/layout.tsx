import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Users",
  description: "Admin panel to manage users, view profiles, and moderate the TravelBuddy community.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscription",
  description: "Manage your TravelBuddy subscription. View your current plan, upgrade, or renew your subscription.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SubscriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}




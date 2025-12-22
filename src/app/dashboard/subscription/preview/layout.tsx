import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscription Preview",
  description: "Preview your subscription plan before completing payment.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SubscriptionPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}




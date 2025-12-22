import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coupons",
  description: "Manage discount coupons and promotional codes for TravelBuddy subscriptions.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CouponLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}



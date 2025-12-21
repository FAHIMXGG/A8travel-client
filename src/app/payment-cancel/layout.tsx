import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Cancelled",
  description: "Your payment was cancelled. No charges were made to your account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentCancelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Successful",
  description: "Your payment has been processed successfully. Thank you for your subscription to TravelBuddy.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}






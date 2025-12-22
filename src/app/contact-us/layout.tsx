import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with TravelBuddy. Have questions, feedback, or need support? We're here to help you with your travel journey.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}




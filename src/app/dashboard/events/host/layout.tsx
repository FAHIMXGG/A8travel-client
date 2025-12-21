import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Host Travel Plan",
  description: "Create a new travel plan and invite others to join your adventure.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function HostEventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Change Password",
  description: "Update your account password to keep your TravelBuddy account secure.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


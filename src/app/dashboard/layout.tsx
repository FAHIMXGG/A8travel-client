import type { Metadata } from "next";
import { ReactNode } from "react"
import Sidebar from "@/components/dashboard/sidebar"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your travel plans, profile, subscriptions, and more from your TravelBuddy dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
return (
<div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
<aside className="md:sticky md:top-20 h-max"><Sidebar /></aside>
<section>{children}</section>
</div>
)
}
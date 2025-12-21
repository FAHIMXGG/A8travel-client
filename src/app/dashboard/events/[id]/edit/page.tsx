import type { Metadata } from "next";
import { headers } from "next/headers";
import EditTravelPlanForm from "./edit-form";

async function getTravelPlan(id: string) {
  try {
    const headersList = await headers()
    const host = headersList.get("host")
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
    const baseUrl = `${protocol}://${host}`
    
    const res = await fetch(`${baseUrl}/api/travel-plans/${id}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.data || data
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const plan = await getTravelPlan(id)
  
  return {
    title: plan ? `Edit ${plan.title}` : "Edit Travel Plan",
    description: "Edit your travel plan details, dates, budget, and other information.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function EditTravelPlanPage() {
  return <EditTravelPlanForm />
}


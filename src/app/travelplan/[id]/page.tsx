import type { Metadata } from "next"
import { headers } from "next/headers"
import TravelPlanDetailClient from "./travel-plan-client"

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
  
  if (!plan) {
    return {
      title: "Travel Plan Not Found",
      description: "The travel plan you're looking for doesn't exist.",
    }
  }
  
  const destination = `${plan.destinationCity}, ${plan.destinationCountry}`
  const dates = plan.startDate && plan.endDate 
    ? `${new Date(plan.startDate).toLocaleDateString()} - ${new Date(plan.endDate).toLocaleDateString()}`
    : ""
  
  return {
    title: `${plan.title} - ${destination}`,
    description: plan.description || `Join this travel plan to ${destination}${dates ? ` from ${dates}` : ""}. ${plan.participantsCount || 0} travelers already joined!`,
    openGraph: {
      title: `${plan.title} - ${destination}`,
      description: plan.description || `Join this travel plan to ${destination}`,
      images: plan.images && plan.images.length > 0 ? [plan.images[0]] : [],
    },
  }
}

export default function TravelPlanDetailPage() {
  return <TravelPlanDetailClient />
}


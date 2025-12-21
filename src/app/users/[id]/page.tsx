import type { Metadata } from "next"
import { headers } from "next/headers"
import UserProfileClient from "./user-profile-client"

async function getUserProfile(id: string) {
  try {
    const headersList = await headers()
    const host = headersList.get("host")
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
    const baseUrl = `${protocol}://${host}`
    
    const res = await fetch(`${baseUrl}/api/users/${id}`, {
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
  const profile = await getUserProfile(id)
  
  if (!profile) {
    return {
      title: "User Profile Not Found",
      description: "The user profile you're looking for doesn't exist.",
    }
  }
  
  const location = profile.currentLocation ? ` from ${profile.currentLocation}` : ""
  const countries = profile.visitedCountries?.length > 0 
    ? ` • Visited ${profile.visitedCountries.length} countries`
    : ""
  const rating = profile.ratingAverage > 0 
    ? ` • ⭐ ${profile.ratingAverage.toFixed(1)} (${profile.ratingCount} reviews)`
    : ""
  
  return {
    title: `${profile.name} - Travel Profile${location}`,
    description: profile.bio || `Travel enthusiast${location}${countries}${rating}. Connect and travel together!`,
    openGraph: {
      title: `${profile.name} - Travel Profile`,
      description: profile.bio || `Travel enthusiast${location}. Connect and travel together!`,
      images: profile.image ? [profile.image] : [],
    },
  }
}

export default function UserProfilePage() {
  return <UserProfileClient />
}

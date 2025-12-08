import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

const BACKEND_URL = process.env.BACKEND_URL || "https://a8travel-backend.vercel.app"

// Public endpoint to search users
// Uses auth if available, but works without authentication
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("query") || ""
    const page = searchParams.get("page") || "1"
    const limit = searchParams.get("limit") || "10"
    const travelInterests = searchParams.get("travelInterests") || ""
    const visitedCountries = searchParams.get("visitedCountries") || ""

    // Build query string
    const queryParams = new URLSearchParams()
    if (query) queryParams.set("query", query)
    queryParams.set("page", page)
    queryParams.set("limit", limit)
    if (travelInterests) queryParams.set("travelInterests", travelInterests)
    if (visitedCountries) queryParams.set("visitedCountries", visitedCountries)

    // Try to get session, but don't require it
    const session = await getServerSession(authOptions)
    const token = session ? (session as any).accessToken : null

    const res = await fetch(`${BACKEND_URL}/api/users/search?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })

    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data?.message || "Failed to search users" },
        { status: res.status }
      )
    }

    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message || "Network error" }, { status: 500 })
  }
}


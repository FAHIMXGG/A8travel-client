import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

const BACKEND_URL = process.env.BACKEND_URL || "https://a8travel-backend.vercel.app"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

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

    const token = (session as any).accessToken

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


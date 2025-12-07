import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

const BACKEND_URL = process.env.BACKEND_URL || "https://a8travel-backend.vercel.app"

// Public endpoint to get popular users (sorted by rating)
// Uses auth if available, but tries without if not authenticated
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = searchParams.get("page") || "1"
    const limit = searchParams.get("limit") || "20"

    // Build query string
    const queryParams = new URLSearchParams()
    queryParams.set("page", page)
    queryParams.set("limit", limit)

    // Try to get session, but don't require it
    const session = await getServerSession(authOptions)
    const token = session ? (session as any).accessToken : null

    // Call backend with optional auth
    const res = await fetch(`${BACKEND_URL}/api/users/all?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })

    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data?.message || "Failed to fetch users" },
        { status: res.status }
      )
    }

    // Sort by ratingAverage first, then ratingCount
    if (data.success && data.data?.data) {
      const users = data.data.data
      users.sort((a: any, b: any) => {
        if (b.ratingAverage !== a.ratingAverage) {
          return b.ratingAverage - a.ratingAverage
        }
        return b.ratingCount - a.ratingCount
      })
    }

    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message || "Network error" }, { status: 500 })
  }
}


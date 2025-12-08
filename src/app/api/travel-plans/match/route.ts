import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "https://a8travel-backend.vercel.app"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = searchParams.get("page") || "1"
    const limit = searchParams.get("limit") || "12"
    const destination = searchParams.get("destination")
    const tags = searchParams.get("tags")

    const queryParams = new URLSearchParams()
    queryParams.set("page", page)
    queryParams.set("limit", limit)
    if (destination) queryParams.set("destination", destination)
    if (tags) queryParams.set("tags", tags)

    const res = await fetch(`${BACKEND_URL}/api/travel-plans/match?${queryParams.toString()}`)
    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data?.message || "Failed to fetch matching travel plans" },
        { status: res.status }
      )
    }

    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message || "Network error" }, { status: 500 })
  }
}





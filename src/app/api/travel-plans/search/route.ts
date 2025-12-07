import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "https://a8travel-backend.vercel.app"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("query")
    const page = searchParams.get("page") || "1"
    const limit = searchParams.get("limit") || "12"

    if (!query) {
      return NextResponse.json(
        { success: false, message: "Query parameter is required" },
        { status: 400 }
      )
    }

    const queryParams = new URLSearchParams()
    queryParams.set("query", query)
    queryParams.set("page", page)
    queryParams.set("limit", limit)

    const res = await fetch(`${BACKEND_URL}/api/travel-plans/search?${queryParams.toString()}`)
    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data?.message || "Failed to search travel plans" },
        { status: res.status }
      )
    }

    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message || "Network error" }, { status: 500 })
  }
}



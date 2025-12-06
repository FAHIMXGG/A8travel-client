import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

const BACKEND_URL = process.env.BACKEND_URL || "https://a8travel-backend.vercel.app"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Forbidden: Admin access required" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const page = searchParams.get("page") || "1"
    const limit = searchParams.get("limit") || "10"
    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const id = searchParams.get("id")

    // Build query string
    const queryParams = new URLSearchParams()
    queryParams.set("page", page)
    queryParams.set("limit", limit)
    if (search) queryParams.set("search", search)
    if (status) queryParams.set("status", status)
    if (id) queryParams.set("id", id)

    const token = (session as any).accessToken

    const res = await fetch(`${BACKEND_URL}/api/users?${queryParams.toString()}`, {
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

    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message || "Network error" }, { status: 500 })
  }
}


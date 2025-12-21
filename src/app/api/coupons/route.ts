import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth-options"

const BACKEND_URL = process.env.BACKEND_URL || "https://a8travel-backend.vercel.app"

// GET /api/coupons - List all coupons
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
    const isActive = searchParams.get("isActive")

    // Build query string
    const queryParams = new URLSearchParams()
    queryParams.set("page", page)
    queryParams.set("limit", limit)
    if (isActive !== null && isActive !== undefined) {
      queryParams.set("isActive", isActive)
    }

    const token = (session as any).accessToken

    const res = await fetch(`${BACKEND_URL}/api/coupons?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })

    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data?.message || "Failed to fetch coupons" },
        { status: res.status }
      )
    }

    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message || "Network error" }, { status: 500 })
  }
}

// POST /api/coupons - Create coupon
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Forbidden: Admin access required" }, { status: 403 })
    }

    const body = await req.json()
    const token = (session as any).accessToken

    const res = await fetch(`${BACKEND_URL}/api/coupons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data?.message || "Failed to create coupon" },
        { status: res.status }
      )
    }

    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message || "Network error" }, { status: 500 })
  }
}



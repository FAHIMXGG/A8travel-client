import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth-options"

const BACKEND_URL = process.env.BACKEND_URL || "https://a8travel-backend.vercel.app"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Public endpoint - no auth required
    const { id } = await params
    const session = await getServerSession(authOptions)
    const token = (session as any)?.accessToken

    const res = await fetch(`${BACKEND_URL}/api/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })

    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json({ success: false, message: data?.message || "Failed to fetch user profile" }, { status: res.status })
    }

    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message || "Network error" }, { status: 500 })
  }
}



import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../[...nextauth]/route"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const token = (session as any).accessToken

    // Fetch updated user data from backend
    const res = await fetch(`${BACKEND_URL}/api/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })

    const data = await res.json()
    if (!res.ok || !data?.success || !data?.data) {
      return NextResponse.json(
        { success: false, message: data?.message || "Failed to fetch updated profile" },
        { status: res.status }
      )
    }

    const updatedUser = data.data

    // Return updated user data to be used for session update
    return NextResponse.json({
      success: true,
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone || null,
        isApproved: updatedUser.isApproved ?? true,
        subscriptionStatus: updatedUser.subscriptionStatus || "NONE",
        subscriptionExpiresAt: updatedUser.subscriptionExpiresAt || null,
      },
    })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message || "Network error" }, { status: 500 })
  }
}


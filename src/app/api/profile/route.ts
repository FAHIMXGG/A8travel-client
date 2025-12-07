import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const token = (session as any).accessToken
    const res = await fetch(`${BACKEND_URL}/api/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })

    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json({ success: false, message: data?.message || "Failed to fetch profile" }, { status: res.status })
    }

    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message || "Network error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const token = (session as any).accessToken

    console.log("Profile update request body:", JSON.stringify(body, null, 2))
    console.log("Travel interests:", body.travelInterests)
    console.log("Visited countries:", body.visitedCountries)

    const res = await fetch(`${BACKEND_URL}/api/users/${session.user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    console.log("Backend response:", JSON.stringify(data, null, 2))
    
    if (!res.ok) {
      return NextResponse.json({ success: false, message: data?.message || "Update failed" }, { status: res.status })
    }

    return NextResponse.json(data)
  } catch (e: any) {
    console.error("Profile update error:", e)
    return NextResponse.json({ success: false, message: e.message || "Network error" }, { status: 500 })
  }
}


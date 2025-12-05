import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const token = (session as any).accessToken

    const res = await fetch(`${BACKEND_URL}/api/travel-plans`, {
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
        { success: false, message: data?.message || "Failed to create travel plan" },
        { status: res.status }
      )
    }

    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message || "Network error" }, { status: 500 })
  }
}


import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"

const BACKEND_URL = process.env.BACKEND_URL || "https://a8travel-backend.vercel.app"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Forbidden: Admin access required" }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const token = (session as any).accessToken

    const res = await fetch(`${BACKEND_URL}/api/users/${id}/admin`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data?.message || "Failed to update user" },
        { status: res.status }
      )
    }

    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message || "Network error" }, { status: 500 })
  }
}


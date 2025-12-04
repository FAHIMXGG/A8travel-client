import { NextResponse } from "next/server"
import { authHeaders } from "@/app/lib/api"

const BASE = process.env.BACKEND_URL

// Get all posts
export async function GET() {
  try {
    const headers = await authHeaders() // ✅ await
    const res = await fetch(`${BASE}/api/blogs/`, {
      headers,
      cache: "no-store",
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e.message || "Network error" },
      { status: 500 }
    )
  }
}

// Create new post
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const headers = await authHeaders() // ✅ await
    const res = await fetch(`${BASE}/api/blogs`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e.message || "Network error" },
      { status: 500 }
    )
  }
}

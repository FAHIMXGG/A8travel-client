import { NextResponse } from "next/server"


const BACKEND_URL = process.env.BACKEND_URL!


export async function POST(req: Request) {
try {
const body = await req.json()
const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(body),
})


const data = await res.json()
if (!res.ok) {
return NextResponse.json({ success: false, message: data?.message || "Registration failed" }, { status: res.status })
}


return NextResponse.json(data)
} catch (e: any) {
return NextResponse.json({ success: false, message: e.message || "Network error" }, { status: 500 })
}
}
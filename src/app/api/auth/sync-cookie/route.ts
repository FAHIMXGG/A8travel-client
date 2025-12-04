import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function POST(req: NextRequest) {
  const jwt = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const token = (jwt as any)?.accessToken
  const res = NextResponse.json({ success: !!token })
  if (token) {
    res.cookies.set({
      name: "accessToken",
      value: token as string,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.COOKIE_SECURE === "true",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    })
  }
  return res
}

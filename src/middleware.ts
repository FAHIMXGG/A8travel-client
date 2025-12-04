import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"


export default withAuth(
function middleware(req) {
const token = (req as any).nextauth?.token
const role = token?.role
const allowedRoles = new Set(["ADMIN", "USER"])
const pathname = req.nextUrl.pathname
const adminOnlySegments = ["/dashboard/users"]
const userOnlySegments = ["/dashboard/events/host"]

if (!role || !allowedRoles.has(role)) {
return NextResponse.redirect(new URL("/login", req.url))
}

const isAdminPath = adminOnlySegments.some((segment) => pathname.startsWith(segment))
if (isAdminPath && role !== "ADMIN") {
return NextResponse.redirect(new URL("/dashboard", req.url))
}

const isUserPath = userOnlySegments.some((segment) => pathname.startsWith(segment))
if (isUserPath && role !== "USER") {
return NextResponse.redirect(new URL("/dashboard", req.url))
}

return NextResponse.next()
},
{
callbacks: {
authorized: ({ token }) => !!token, // must be signed in first
},
}
)


export const config = {
matcher: ["/dashboard/:path*"],
}
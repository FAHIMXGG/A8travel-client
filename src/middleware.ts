import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"


export default withAuth(
function middleware(req) {
const token = (req as any).nextauth?.token
const isAdmin = token?.role === "ADMIN"


if (!isAdmin) {
return NextResponse.redirect(new URL("/login", req.url))
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
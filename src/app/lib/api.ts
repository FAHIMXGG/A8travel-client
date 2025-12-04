import { cookies } from "next/headers"

// Helper to read the accessToken from the frontend's httpOnly cookie
export async function getAccessTokenFromCookie() {
  try {
    const cookieStore = await cookies() // ✅ await fixes TS error
    return cookieStore.get("accessToken")?.value
  } catch {
    return undefined
  }
}

// Always include JSON + auth headers for backend requests
export async function authHeaders() {
  const token = await getAccessTokenFromCookie()
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (token) {
    // Send both formats: header + cookie (backend may accept either)
    headers["Authorization"] = `Bearer ${token}`
    headers["Cookie"] = `accessToken=${token}`
  }
  return headers
}

export const runtime = "nodejs"
export async function GET() {
  const ok = !!process.env.UPLOADTHING_APP_ID && !!process.env.UPLOADTHING_SECRET
  return new Response(JSON.stringify({ ok }), { status: ok ? 200 : 500 })
}
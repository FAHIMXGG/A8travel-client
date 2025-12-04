// app/api/uploadthing/route.ts
export const runtime = "nodejs"       // <— important
export const dynamic = "force-dynamic" // optional but avoids caching hiccups

import { createRouteHandler } from "uploadthing/next"
import { ourFileRouter } from "./core"

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  // config optional if env vars are set:
  // config: { uploadthingId: process.env.UPLOADTHING_APP_ID!, uploadthingSecret: process.env.UPLOADTHING_SECRET! }
})

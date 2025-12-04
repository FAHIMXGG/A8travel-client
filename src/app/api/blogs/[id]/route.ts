import { NextRequest, NextResponse } from "next/server";
import { authHeaders } from "@/app/lib/api";

const BASE = process.env.BACKEND_URL!;

// Get one post
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const headers = await authHeaders();
    const res = await fetch(`${BASE}/api/blogs/${id}`, {
      headers,
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Network error" },
      { status: 500 }
    );
  }
}

// Update post
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const headers = await authHeaders();
    const res = await fetch(`${BASE}/api/blogs/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Network error" },
      { status: 500 }
    );
  }
}

// Hard delete (server-initiated)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const headers = await authHeaders();
    const res = await fetch(`${BASE}/api/blogs/${id}`, {
      method: "DELETE",
      headers,
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Network error" },
      { status: 500 }
    );
  }
}

// Allow client to POST to this route to perform a DELETE upstream
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const headers = await authHeaders();
    const res = await fetch(`${BASE}/api/blogs/${id}`, {
      method: "DELETE",
      headers,
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Network error" },
      { status: 500 }
    );
  }
}

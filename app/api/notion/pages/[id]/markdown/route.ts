import { NextRequest, NextResponse } from "next/server";

// GET /api/notion/pages/[id]/markdown
// Proxies GET /v1/pages/{id}/markdown — not wired up yet.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({ id, markdown: null }, { status: 501 });
}

// PATCH /api/notion/pages/[id]/markdown
// Proxies PATCH /v1/pages/{id}/markdown — not wired up yet.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({ id }, { status: 501 });
}

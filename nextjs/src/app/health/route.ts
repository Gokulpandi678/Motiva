import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Same top-level (not under /api/v1) health check the old Express app.ts exposed.
export async function GET() {
  return NextResponse.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
}

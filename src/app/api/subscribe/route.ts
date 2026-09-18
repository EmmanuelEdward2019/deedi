import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  const limit = rateLimit(`subscribe:${clientIp(request)}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Please try again shortly." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : "";
  const source = typeof body.source === "string" ? body.source.trim().slice(0, 40) : "website";

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    await sql`
      INSERT INTO subscribers (email, source) VALUES (${email}, ${source})
      ON CONFLICT (email) DO NOTHING
    `;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[deedi] subscribe failed:", error);
    return NextResponse.json({ error: "Could not subscribe right now." }, { status: 500 });
  }
}

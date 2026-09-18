import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const ENQUIRY_TYPES = new Set([
  "property",
  "management",
  "investment",
  "art",
  "interiors",
  "general",
]);

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const limit = rateLimit(`contact:${clientIp(request)}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many messages sent. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter ?? 60) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: a real person never fills this in.
  if (text(body.company, 100)) {
    return NextResponse.json({ ok: true });
  }

  const name = text(body.name, 120);
  const email = text(body.email, 200);
  const message = text(body.message, 4000);
  const phone = text(body.phone, 40) || null;
  const rawType = text(body.enquiry_type, 40);
  const enquiryType = ENQUIRY_TYPES.has(rawType) ? rawType : "general";
  const subject = text(body.subject, 200) || "Website enquiry";
  const sourcePage = text(body.source_page, 200) || null;
  const relatedRef = text(body.related_ref, 200) || null;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Please fill in your name, email and message." },
      { status: 400 },
    );
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });
  }

  if (message.length < 10) {
    return NextResponse.json(
      { error: "Please give us a little more detail so we can help." },
      { status: 400 },
    );
  }

  try {
    const rows = await sql<{ id: number }>`
      INSERT INTO contact_messages
        (name, email, phone, subject, enquiry_type, message, source_page, related_ref, status)
      VALUES
        (${name}, ${email}, ${phone}, ${subject}, ${enquiryType}, ${message},
         ${sourcePage}, ${relatedRef}, 'new')
      RETURNING id
    `;

    return NextResponse.json({ ok: true, id: rows[0]?.id });
  } catch (error) {
    console.error("[deedi] contact insert failed:", error);
    return NextResponse.json(
      { error: "We couldn't save your message. Please call or WhatsApp us instead." },
      { status: 500 },
    );
  }
}

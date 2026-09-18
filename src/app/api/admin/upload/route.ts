import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/format";

export const runtime = "nodejs";

/** 8MB — comfortably above a high-quality property photo. */
const MAX_BYTES = 8 * 1024 * 1024;

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

/** Builds a collision-proof, readable filename. */
function safeName(original: string, extension: string) {
  const base = slugify(path.basename(original, path.extname(original))).slice(0, 60) || "image";
  const stamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `${base}-${stamp}${random}.${extension}`;
}

export async function POST(request: Request) {
  // Signed-in admins only — managers may upload, same as they may edit.
  // An API route answers with 401 rather than redirecting, so the caller gets
  // JSON it can parse instead of a login page.
  if (!(await getSession())) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Could not read the upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was received." }, { status: 400 });
  }

  const extension = ALLOWED[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Use a JPG, PNG, WebP, AVIF or GIF image." },
      { status: 415 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `That image is ${(file.size / 1024 / 1024).toFixed(1)}MB. The limit is 8MB.` },
      { status: 413 },
    );
  }

  if (file.size === 0) {
    return NextResponse.json({ error: "That file is empty." }, { status: 400 });
  }

  const filename = safeName(file.name || "image", extension);

  try {
    // Vercel's filesystem is read-only, so anything deployed uses Blob storage.
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`uploads/${filename}`, file, {
        access: "public",
        contentType: file.type,
        addRandomSuffix: false,
      });
      return NextResponse.json({ url: blob.url, storage: "blob" });
    }

    // Development fallback: write into /public. Note that `next start` indexes
    // /public at boot, so a file written afterwards is only served by `next dev`
    // or after a restart. Production always goes through Blob storage above.
    const directory = path.join(process.cwd(), "public", "images", "uploads");
    await mkdir(directory, { recursive: true });
    await writeFile(
      path.join(directory, filename),
      Buffer.from(await file.arrayBuffer()),
    );

    return NextResponse.json({ url: `/images/uploads/${filename}`, storage: "local" });
  } catch (error) {
    console.error("[deedi] upload failed:", error);

    const message =
      process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN
        ? "Uploads need a Vercel Blob store. Create one in the project's Storage tab, then redeploy."
        : "That upload could not be saved. Please try again.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import "server-only";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);
const MEDIA_ROOT = path.join(process.cwd(), "public", "images");

async function listFolder(folder: string) {
  try {
    const entries = await readdir(path.join(MEDIA_ROOT, folder), { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
      .map((entry) => `/images/${folder}/${entry.name}`)
      .sort();
  } catch {
    return [];
  }
}

/**
 * Every image bundled in /public/images, grouped by folder, so admin forms can
 * offer a picker instead of asking someone to type a path.
 */
export const getMediaLibrary = cache(async () => {
  const [properties, art, brand] = await Promise.all([
    listFolder("properties"),
    listFolder("art"),
    listFolder("brand"),
  ]);
  return { properties, art, brand, all: [...properties, ...art] };
});

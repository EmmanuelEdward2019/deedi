import type { MetadataRoute } from "next";
import { getArtworks, getGalleryItems, getPosts, getProperties } from "@/lib/queries";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, artworks, posts, gallery] = await Promise.all([
    getProperties({}),
    getArtworks({}),
    getPosts({}),
    getGalleryItems(),
  ]);

  const staticPages: MetadataRoute.Sitemap = (
    [
      { url: site.url, changeFrequency: "weekly", priority: 1 },
      { url: `${site.url}/properties`, changeFrequency: "daily", priority: 0.9 },
      { url: `${site.url}/art`, changeFrequency: "weekly", priority: 0.9 },
      { url: `${site.url}/gallery`, changeFrequency: "monthly", priority: 0.7 },
      { url: `${site.url}/blog`, changeFrequency: "weekly", priority: 0.8 },
      { url: `${site.url}/services`, changeFrequency: "monthly", priority: 0.8 },
      { url: `${site.url}/about`, changeFrequency: "monthly", priority: 0.6 },
      { url: `${site.url}/contact`, changeFrequency: "yearly", priority: 0.7 },
      { url: `${site.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
      { url: `${site.url}/terms`, changeFrequency: "yearly", priority: 0.2 },
    ] satisfies MetadataRoute.Sitemap
  ).map((page) => ({ ...page, lastModified: new Date() }));

  return [
    ...staticPages,
    ...properties.map((property) => ({
      url: `${site.url}/properties/${property.slug}`,
      lastModified: new Date(property.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...artworks.map((artwork) => ({
      url: `${site.url}/art/${artwork.slug}`,
      lastModified: new Date(artwork.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...posts.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...(gallery.length > 0
      ? [
          {
            url: `${site.url}/gallery`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.7,
          },
        ]
      : []),
  ];
}

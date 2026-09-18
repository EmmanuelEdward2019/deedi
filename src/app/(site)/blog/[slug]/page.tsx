import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Eyebrow, Section, SectionHeading, TextLink } from "@/components/ui";
import { ShareRow } from "@/components/share-row";
import { NewsletterInline } from "@/components/newsletter-inline";
import { Clock } from "@/components/icons";
import { getPostBySlug, getPosts, getRelatedPosts } from "@/lib/queries";
import { formatDate, formatShortDate, stripHtml, toISO, truncate } from "@/lib/format";
import { site } from "@/lib/site";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const posts = await getPosts({});
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found" };

  const title = post.meta_title ?? post.title;
  const description = post.meta_description ?? truncate(post.excerpt || stripHtml(post.content), 158);
  const image = post.og_image ?? post.cover_image ?? "/images/properties/bolton-aerial.jpeg";

  return {
    title,
    description,
    keywords: post.tags,
    authors: [{ name: post.author }],
    alternates: { canonical: post.canonical_url ?? `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${site.url}/blog/${post.slug}`,
      publishedTime: toISO(post.published_at),
      modifiedTime: toISO(post.updated_at),
      authors: [post.author],
      section: post.category,
      tags: post.tags,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post.id, post.category);
  const url = `${site.url}/blog/${post.slug}`;
  const image = post.og_image ?? post.cover_image ?? "/images/properties/bolton-aerial.jpeg";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.meta_description ?? post.excerpt,
    image: `${site.url}${image}`,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: post.published_at,
    dateModified: post.updated_at,
    articleSection: post.category,
    keywords: post.tags.join(", "),
    wordCount: stripHtml(post.content).split(/\s+/).length,
    inLanguage: "en-GB",
    author: {
      "@type": "Person",
      name: post.author,
      ...(post.author_role ? { jobTitle: post.author_role } : {}),
      worksFor: { "@type": "Organization", name: site.legalName },
    },
    publisher: {
      "@type": "Organization",
      name: site.legalName,
      logo: { "@type": "ImageObject", url: `${site.url}/images/brand/deedi-logo.png` },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Journal", item: `${site.url}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Article header */}
      <header className="relative overflow-hidden bg-navy-950">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/85 via-navy-950/75 to-navy-950/95" />

        <Container className="relative py-24 lg:py-32">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-[0.75rem] text-white/45">
              <li>
                <Link href="/" className="transition-colors hover:text-gold-300">
                  Home
                </Link>
              </li>
              <li className="text-gold-500/60">/</li>
              <li>
                <Link href="/blog" className="transition-colors hover:text-gold-300">
                  Journal
                </Link>
              </li>
              <li className="text-gold-500/60">/</li>
              <li className="text-white/75">{post.category}</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <Eyebrow tone="white">{post.category}</Eyebrow>
            <h1 className="font-display mt-5 text-[2.25rem] leading-[1.1] font-medium tracking-[-0.02em] text-white balance sm:text-5xl lg:text-[3.25rem]">
              {post.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 pretty">{post.excerpt}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem] text-white/55">
              <span className="font-medium text-gold-300">{post.author}</span>
              {post.author_role ? <span className="text-white/40">{post.author_role}</span> : null}
              <span className="text-white/25">·</span>
              <time dateTime={toISO(post.published_at)}>{formatDate(post.published_at)}</time>
              <span className="text-white/25">·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {post.reading_minutes} min read
              </span>
            </div>
          </div>
        </Container>
      </header>

      {/* Body */}
      <Section tone="light" className="py-14 sm:py-16 lg:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-8">
              <div className="prose-deedi" dangerouslySetInnerHTML={{ __html: post.content }} />

              {post.tags.length > 0 && (
                <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-sand-200 pt-8">
                  <span className="mr-2 text-[0.6875rem] font-semibold tracking-[0.14em] text-slate-400 uppercase">
                    Tags
                  </span>
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="border border-sand-200 px-3.5 py-1.5 text-xs text-slate-600 transition-colors hover:border-gold-400 hover:text-navy-900"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              <ShareRow url={url} title={post.title} />
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="space-y-8 lg:sticky lg:top-28">
                <div className="border border-sand-200 bg-sand-50 p-7">
                  <Eyebrow>Written by</Eyebrow>
                  <p className="font-display mt-4 text-xl text-navy-900">{post.author}</p>
                  {post.author_role ? (
                    <p className="mt-1 text-sm text-slate-500">{post.author_role}</p>
                  ) : null}
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    Part of the team at {site.name}, working across property management,
                    investment and art in Greater Manchester.
                  </p>
                  <div className="mt-5">
                    <TextLink href="/contact">Get in touch</TextLink>
                  </div>
                </div>

                <NewsletterInline />

                {related.length > 0 && (
                  <div>
                    <Eyebrow className="rule-gold">Keep reading</Eyebrow>
                    <ul className="mt-6 space-y-5">
                      {related.map((item) => (
                        <li key={item.id} className="group flex gap-4">
                          {item.cover_image ? (
                            <Link
                              href={`/blog/${item.slug}`}
                              className="relative size-20 shrink-0 overflow-hidden bg-navy-900"
                            >
                              <Image
                                src={item.cover_image}
                                alt=""
                                fill
                                sizes="80px"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </Link>
                          ) : null}
                          <div>
                            <p className="text-[0.625rem] tracking-[0.14em] text-gold-600 uppercase">
                              {formatShortDate(item.published_at)}
                            </p>
                            <h3 className="mt-1 text-sm leading-snug font-medium text-navy-900">
                              <Link href={`/blog/${item.slug}`} className="transition-colors hover:text-gold-600">
                                {item.title}
                              </Link>
                            </h3>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section tone="sand">
          <Container>
            <SectionHeading eyebrow="More from the journal" title="Related reading" />
            <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
              {related.map((item) => (
                <article key={item.id} className="reveal group flex flex-col">
                  <Link
                    href={`/blog/${item.slug}`}
                    className="img-zoom relative block aspect-[16/10] overflow-hidden bg-navy-900"
                  >
                    {item.cover_image ? (
                      <Image
                        src={item.cover_image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    ) : null}
                  </Link>
                  <div className="flex flex-1 flex-col pt-5">
                    <p className="text-[0.6875rem] tracking-[0.14em] text-gold-600 uppercase">
                      {item.category}
                    </p>
                    <h3 className="font-display mt-2.5 text-lg leading-snug text-navy-900">
                      <Link href={`/blog/${item.slug}`} className="transition-colors hover:text-gold-600">
                        {item.title}
                      </Link>
                    </h3>
                    <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">
                      {item.excerpt}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}

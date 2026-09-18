import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import {
  ButtonLink,
  Container,
  EmptyState,
  Eyebrow,
  Section,
  TextLink,
  cx,
} from "@/components/ui";
import { Clock } from "@/components/icons";
import { getPostCategories, getPosts, getPostTags } from "@/lib/queries";
import { formatShortDate } from "@/lib/format";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Journal — Property & Art Insight",
  description:
    "Yield data, compliance updates, market notes and art buying advice from the team at Deedi Ltd in Bolton and Greater Manchester.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "The Journal | Deedi Ltd",
    description: "Property market insight, landlord compliance and art buying advice.",
    images: ["/images/properties/bolton-aerial.jpeg"],
  },
};

export const revalidate = 120;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const category = first(params.category);
  const tag = first(params.tag);
  const search = first(params.search);

  const [posts, categories, tags] = await Promise.all([
    getPosts({ category, tag, search }),
    getPostCategories(),
    getPostTags(),
  ]);

  const filtered = Boolean(category || tag || search);
  const [lead, ...rest] = posts;

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "The Deedi Journal",
    url: `${site.url}/blog`,
    description: "Property market insight, landlord compliance and art buying advice.",
    publisher: { "@type": "Organization", name: site.legalName },
    blogPost: posts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${site.url}/blog/${post.slug}`,
      datePublished: post.published_at,
      author: { "@type": "Person", name: post.author },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      <PageHero
        eyebrow="The journal"
        title="Notes from the market."
        intro="What the numbers say, what the legislation means, and the occasional strong opinion about framing."
        image="/images/properties/bolton-high-street.jpeg"
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/blog", label: "Journal" },
        ]}
      />

      {/* Category nav */}
      <div className="sticky top-[68px] z-30 border-b border-sand-200 bg-white/95 backdrop-blur-md">
        <Container>
          <div className="rail flex gap-1 overflow-x-auto py-3">
            <Link
              href="/blog"
              className={cx(
                "shrink-0 px-4 py-2 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase transition-colors",
                !category ? "bg-navy-900 text-white" : "text-slate-500 hover:text-navy-900",
              )}
            >
              All posts
            </Link>
            {categories.map((item) => (
              <Link
                key={item.category}
                href={`/blog?category=${encodeURIComponent(item.category)}`}
                className={cx(
                  "shrink-0 px-4 py-2 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase transition-colors",
                  category === item.category
                    ? "bg-navy-900 text-white"
                    : "text-slate-500 hover:text-navy-900",
                )}
              >
                {item.category}
                <span className="ml-1.5 text-gold-500">{item.count}</span>
              </Link>
            ))}
          </div>
        </Container>
      </div>

      <Section tone="light">
        <Container>
          {posts.length === 0 ? (
            <EmptyState
              title="Nothing published here yet"
              message="Posts are written and published from the admin dashboard. Once the database is seeded you will find the full journal here."
              action={
                <ButtonLink href="/blog" tone="gold" arrow>
                  Back to all posts
                </ButtonLink>
              }
            />
          ) : (
            <>
              {tag ? (
                <p className="mb-8 text-sm text-slate-500">
                  Showing posts tagged{" "}
                  <span className="font-semibold text-navy-900">#{tag}</span> ·{" "}
                  <Link href="/blog" className="text-gold-600 underline underline-offset-4">
                    clear
                  </Link>
                </p>
              ) : null}

              {/* Lead article */}
              {lead && !filtered && (
                <article className="reveal group mb-16 grid gap-10 lg:grid-cols-2 lg:items-center">
                  <Link
                    href={`/blog/${lead.slug}`}
                    className="img-zoom relative block aspect-[16/11] overflow-hidden bg-navy-900"
                  >
                    {lead.cover_image ? (
                      <Image
                        src={lead.cover_image}
                        alt={lead.title}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                    ) : null}
                    <span className="absolute top-5 left-5 bg-gold-500 px-3 py-1.5 text-[0.625rem] font-bold tracking-[0.16em] text-white uppercase">
                      Featured
                    </span>
                  </Link>

                  <div>
                    <Eyebrow className="rule-gold">{lead.category}</Eyebrow>
                    <h2 className="font-display mt-5 text-3xl leading-[1.15] text-navy-900 balance sm:text-4xl">
                      <Link href={`/blog/${lead.slug}`} className="transition-colors hover:text-gold-600">
                        {lead.title}
                      </Link>
                    </h2>
                    <p className="mt-4 text-[1.0625rem] leading-relaxed text-slate-600 pretty">
                      {lead.excerpt}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-4 text-[0.8125rem] text-slate-500">
                      <span className="font-medium text-navy-800">{lead.author}</span>
                      <span className="text-sand-200">·</span>
                      <span>{formatShortDate(lead.published_at)}</span>
                      <span className="text-sand-200">·</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-gold-500" />
                        {lead.reading_minutes} min read
                      </span>
                    </div>
                    <div className="mt-7">
                      <ButtonLink href={`/blog/${lead.slug}`} tone="gold" arrow>
                        Read the article
                      </ButtonLink>
                    </div>
                  </div>
                </article>
              )}

              {/* Grid */}
              <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                {(filtered ? posts : rest).map((post) => (
                  <article key={post.id} className="reveal group flex flex-col">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="img-zoom relative block aspect-[16/10] overflow-hidden bg-navy-900"
                    >
                      {post.cover_image ? (
                        <Image
                          src={post.cover_image}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      ) : null}
                    </Link>

                    <div className="flex flex-1 flex-col pt-5">
                      <p className="flex flex-wrap items-center gap-3 text-[0.6875rem] tracking-[0.14em] text-gold-600 uppercase">
                        {post.category}
                        <span className="text-sand-200">/</span>
                        <span className="tracking-normal text-slate-400 normal-case">
                          {formatShortDate(post.published_at)}
                        </span>
                      </p>

                      <h2 className="font-display mt-3 text-xl leading-snug text-navy-900">
                        <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-gold-600">
                          {post.title}
                        </Link>
                      </h2>

                      <p className="mt-2.5 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
                        {post.excerpt}
                      </p>

                      <div className="mt-5 flex items-center justify-between border-t border-sand-200 pt-4">
                        <TextLink href={`/blog/${post.slug}`}>Read</TextLink>
                        <span className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock className="size-3.5" />
                          {post.reading_minutes} min
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Tag cloud */}
              {tags.length > 0 && (
                <div className="mt-20 border-t border-sand-200 pt-10">
                  <Eyebrow>Browse by tag</Eyebrow>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {tags.map((item) => (
                      <Link
                        key={item}
                        href={`/blog?tag=${encodeURIComponent(item)}`}
                        className={cx(
                          "border px-3.5 py-1.5 text-xs transition-colors",
                          tag === item
                            ? "border-gold-500 bg-gold-500 text-white"
                            : "border-sand-200 text-slate-600 hover:border-gold-400 hover:text-navy-900",
                        )}
                      >
                        #{item}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </Container>
      </Section>
    </>
  );
}

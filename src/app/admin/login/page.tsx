import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getSession } from "@/lib/auth";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const next = Array.isArray(params.next) ? params.next[0] : params.next;

  // Already signed in — go straight through.
  if (await getSession()) redirect(next?.startsWith("/") ? next : "/admin");

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Form side */}
      <div className="flex items-center justify-center bg-white px-6 py-16 sm:px-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="inline-block">
            <Image
              src="/images/brand/deedi-logo.png"
              alt={site.name}
              width={2125}
              height={740}
              priority
              className="h-9 w-auto"
            />
          </Link>

          <h1 className="font-display mt-10 text-3xl text-navy-900">Sign in</h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage properties, artwork, the journal and enquiries.
          </p>

          <div className="mt-8">
            <LoginForm next={next?.startsWith("/") ? next : "/admin"} />
          </div>

          <Link
            href="/"
            className="mt-10 inline-block border-t border-sand-200 pt-6 text-[0.75rem] font-semibold tracking-[0.13em] text-slate-400 uppercase transition-colors hover:text-gold-600"
          >
            ← Back to the website
          </Link>
        </div>
      </div>

      {/* Image side */}
      <div className="relative hidden lg:block">
        <Image
          src="/images/properties/bolton-aerial.jpeg"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/70 to-navy-950/50" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="eyebrow text-gold-300">Deedi administration</p>
          <p className="font-display mt-4 max-w-md text-3xl leading-tight text-white">
            Everything on the website is edited from here.
          </p>
        </div>
      </div>
    </div>
  );
}

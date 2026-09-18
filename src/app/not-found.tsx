import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-navy-950">
      <Image
        src="/images/properties/bolton-aerial.jpeg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-navy-950/70" />

      <Container className="relative py-24 text-center">
        <p className="font-display text-7xl text-gold-500 sm:text-8xl">404</p>
        <h1 className="font-display mx-auto mt-6 max-w-lg text-3xl leading-tight text-white balance sm:text-4xl">
          That page has been let, sold or was never here.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[1.0625rem] text-white/60">
          Try the property listings or the art collection — or tell us what you were looking for.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/properties" tone="gold" size="lg" arrow>
            Browse properties
          </ButtonLink>
          <ButtonLink href="/art" tone="outlineLight" size="lg">
            View art
          </ButtonLink>
          <ButtonLink href="/contact" tone="outlineLight" size="lg">
            Contact us
          </ButtonLink>
        </div>
        </Container>
      </section>
      <SiteFooter />
    </>
  );
}

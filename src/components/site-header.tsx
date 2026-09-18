"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site, whatsappLink } from "@/lib/site";
import { Close, Menu, Phone, WhatsApp } from "@/components/icons";
import { cx } from "@/components/ui";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Drives the drop shadow only — the bar itself is always solid.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Contact strip */}
      <div className="hidden bg-navy-950 text-white/70 lg:block">
        <div className="mx-auto flex max-w-[1560px] items-center justify-between px-8 py-2 text-[0.75rem]">
          <p className="tracking-wide">
            Property management, sales and lettings · Original art and interiors ·{" "}
            <span className="text-gold-300">Bolton &amp; Greater Manchester</span>
          </p>
          <div className="flex items-center gap-6">
            <a href={site.contact.phoneHref} className="flex items-center gap-2 transition-colors hover:text-gold-300">
              <Phone className="size-3.5" />
              {site.contact.phone}
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-gold-300"
            >
              <WhatsApp className="size-3.5" />
              WhatsApp us
            </a>
          </div>
        </div>
      </div>

      <header
        className={cx(
          "sticky top-0 z-50 border-b border-sand-200 bg-white/95 backdrop-blur-md transition-shadow duration-500",
          scrolled ? "shadow-md" : "shadow-sm",
        )}
      >
        <div className="relative mx-auto flex max-w-[1560px] items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="relative z-10 flex shrink-0 items-center" aria-label={`${site.name} home`}>
            <Image
              src="/images/brand/deedi-logo.png"
              alt={site.name}
              width={2125}
              height={740}
              priority
              className="h-8 w-auto sm:h-9"
            />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {nav.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    "relative py-1 text-[0.8125rem] font-medium tracking-[0.13em] uppercase transition-colors",
                    "text-navy-800 hover:text-gold-600",
                    active && "text-gold-600",
                  )}
                >
                  {item.label}
                  <span
                    className={cx(
                      "absolute -bottom-0.5 left-0 h-px bg-gold-500 transition-all duration-300",
                      active ? "w-full" : "w-0",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/contact"
              className="bg-gold-500 px-6 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.13em] text-white transition-colors hover:bg-gold-600"
            >
              Book a valuation
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="relative z-10 -mr-2 p-2 text-navy-900 lg:hidden"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={cx(
          // Above the chat widget (z-70) so its launcher cannot sit over the drawer.
          "fixed inset-0 z-[80] lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={cx(
            "absolute inset-0 bg-navy-950/60 backdrop-blur-sm transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cx(
            "surface-navy absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col transition-transform duration-500 ease-out",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <Image
              src="/images/brand/deedi-logo.png"
              alt={site.name}
              width={2125}
              height={740}
              className="h-7 w-auto"
            />
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="p-2 text-white">
              <Close className="size-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-8">
            <ul className="space-y-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-display tap-target flex items-center border-b border-white/5 py-3.5 text-2xl text-white transition-colors hover:text-gold-300 active:text-gold-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-3 border-t border-white/10 px-6 py-6">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 bg-[#25D366] px-5 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[0.13em] text-white"
            >
              <WhatsApp className="size-4" />
              Chat on WhatsApp
            </a>
            <a
              href={site.contact.phoneHref}
              className="flex items-center justify-center gap-2.5 border border-white/25 px-5 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[0.13em] text-white"
            >
              <Phone className="size-4" />
              {site.contact.phone}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

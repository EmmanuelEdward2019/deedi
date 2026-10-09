import Link from "next/link";
import { footerNav, site, whatsappLink } from "@/lib/site";
import { NewsletterForm } from "@/components/newsletter-form";
import { TrustpilotWidget } from "@/components/trustpilot";
import {
  Clock,
  Facebook,
  Instagram,
  LinkedIn,
  Mail,
  MapPin,
  Phone,
  WhatsApp,
  XSocial,
} from "@/components/icons";
import { GoldRule } from "@/components/ui";
import { BrandLogo } from "@/components/brand-logo";

const socials = [
  { href: site.social.instagram, label: "Instagram", Icon: Instagram },
  { href: site.social.facebook, label: "Facebook", Icon: Facebook },
  { href: site.social.linkedin, label: "LinkedIn", Icon: LinkedIn },
  { href: site.social.x, label: "X", Icon: XSocial },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="surface-navy">
      <GoldRule />

      {/* Closing CTA */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
          <p className="eyebrow text-gold-300">Your property. Our priority.</p>
          <h2 className="font-display mx-auto mt-5 max-w-3xl text-3xl leading-[1.15] font-medium text-white balance sm:text-4xl lg:text-[2.75rem]">
            Whether you are letting, selling, investing or looking for the right piece of art — start with a conversation.
          </h2>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="bg-gold-500 px-8 py-4 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-gold-600"
            >
              Get in touch
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 border border-white/25 px-8 py-4 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:border-gold-400 hover:text-gold-300"
            >
              <WhatsApp className="size-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand + contact */}
          <div className="lg:col-span-4">
            <BrandLogo
              statement
              className="gap-3.5"
              emblemClassName="h-20 w-auto"
              wordmarkClassName="h-12 w-auto"
            />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">{site.description}</p>

            <ul className="mt-8 space-y-3.5 text-sm text-white/70">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold-400" />
                <span>
                  {site.contact.address.street}
                  <br />
                  {site.contact.address.city}, {site.contact.address.postcode}
                </span>
              </li>
              <li>
                <a href={site.contact.phoneHref} className="flex gap-3 transition-colors hover:text-gold-300">
                  <Phone className="mt-0.5 size-4 shrink-0 text-gold-400" />
                  {site.contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.contact.email}`} className="flex gap-3 transition-colors hover:text-gold-300">
                  <Mail className="mt-0.5 size-4 shrink-0 text-gold-400" />
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.contact.infoEmail}`} className="flex gap-3 transition-colors hover:text-gold-300">
                  <Mail className="mt-0.5 size-4 shrink-0 text-gold-400" />
                  {site.contact.infoEmail}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-gold-400" />
                <span>
                  {site.contact.hours.map((h) => (
                    <span key={h.days} className="block">
                      {h.days} · {h.time}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </div>

          {/* Link columns */}
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-5">
            {Object.entries(footerNav).map(([heading, links]) => (
              <div key={heading}>
                <h3 className="eyebrow text-gold-300">{heading}</h3>
                <ul className="mt-5 space-y-2.5">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/65 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h3 className="eyebrow text-gold-300">Stay in touch</h3>
            <p className="mt-5 text-sm leading-relaxed text-white/60">
              New listings, new work and a short market note. Once a month, nothing else.
            </p>
            <NewsletterForm />
            <div className="mt-8 flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-10 items-center justify-center border border-white/15 text-white/70 transition-colors hover:border-gold-400 hover:text-gold-300"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
            <TrustpilotWidget variant="collector" theme="dark" className="mt-8" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {year} {site.legalName}. Registered in England &amp; Wales. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms
            </Link>
            <Link href="/admin" className="transition-colors hover:text-white">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

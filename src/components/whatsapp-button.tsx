"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site, whatsappLink } from "@/lib/site";
import { Close, WhatsApp } from "@/components/icons";
import { cx } from "@/components/ui";

const QUICK_TOPICS = [
  { label: "Book a property viewing", context: "booking a property viewing" },
  { label: "Get a rental valuation", context: "a rental valuation for my property" },
  { label: "Ask about an artwork", context: "an artwork in your collection" },
  { label: "Switch my management", context: "switching my property management to Deedi" },
];

/** Floating live-chat launcher that hands the conversation to WhatsApp. */
export function WhatsAppButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // The admin area has its own chrome — keep the widget on the public site.
  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed right-4 bottom-4 z-[70] flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {/* Panel */}
      <div
        className={cx(
          "w-[min(20rem,calc(100vw-2rem))] origin-bottom-right overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-navy-900/10 transition-all duration-300",
          open ? "scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0",
        )}
        role="dialog"
        aria-label="Chat with Deedi Ltd"
        aria-hidden={!open}
      >
        <div className="surface-navy px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="relative flex size-10 items-center justify-center rounded-full bg-[#25D366]">
              <WhatsApp className="size-5 text-white" />
              <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-navy-800 bg-emerald-400" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">{site.name}</p>
              <p className="text-[0.6875rem] text-emerald-300">Typically replies within an hour</p>
            </div>
          </div>
        </div>

        <div className="px-5 py-4">
          <div className="rounded-lg rounded-tl-none bg-sand-100 px-4 py-3 text-sm leading-relaxed text-navy-800">
            Hello 👋 What can we help you with today?
          </div>

          <div className="mt-3 space-y-2">
            {QUICK_TOPICS.map((topic) => (
              <a
                key={topic.label}
                href={whatsappLink(topic.context)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded border border-sand-200 px-3.5 py-2.5 text-left text-[0.8125rem] text-navy-800 transition-colors hover:border-gold-400 hover:bg-sand-50"
              >
                {topic.label}
              </a>
            ))}
          </div>

          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded bg-[#25D366] px-4 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#1eb855]"
          >
            <WhatsApp className="size-4" />
            Start the chat
          </a>
          <p className="mt-3 text-center text-[0.6875rem] text-slate-400">
            Opens WhatsApp · {site.contact.phone}
          </p>
        </div>
      </div>

      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close live chat" : "Open live chat"}
        aria-expanded={open}
        className={cx(
          "group relative flex items-center gap-3 rounded-full bg-[#25D366] py-3.5 pr-5 pl-4 text-white shadow-xl transition-all duration-500 hover:bg-[#1eb855] hover:shadow-2xl",
          mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
      >
        {open ? <Close className="size-6" /> : <WhatsApp className="size-6" />}
        <span className="text-[0.8125rem] font-semibold tracking-wide max-sm:hidden">
          {open ? "Close" : "Live chat"}
        </span>
        {!open && (
          <span className="absolute top-0 right-0 flex size-3">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-sunlight-400 opacity-75" />
            <span className="relative inline-flex size-3 rounded-full bg-sunlight-500" />
          </span>
        )}
      </button>
    </div>
  );
}

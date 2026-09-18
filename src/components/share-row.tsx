"use client";

import { useState } from "react";
import { Check, Facebook, LinkedIn, Mail, WhatsApp, XSocial } from "@/components/icons";

/** Share links for an article, plus copy-to-clipboard. */
export function ShareRow({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const targets = [
    { label: "X", Icon: XSocial, href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { label: "LinkedIn", Icon: LinkedIn, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { label: "Facebook", Icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "WhatsApp", Icon: WhatsApp, href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { label: "Email", Icon: Mail, href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}` },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard unavailable — the share links still work. */
    }
  }

  return (
    <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-sand-200 pt-8">
      <span className="mr-2 text-[0.6875rem] font-semibold tracking-[0.14em] text-slate-400 uppercase">
        Share
      </span>

      {targets.map(({ label, Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${label}`}
          className="flex size-10 items-center justify-center border border-sand-200 text-slate-500 transition-colors hover:border-gold-400 hover:text-gold-600"
        >
          <Icon className="size-4" />
        </a>
      ))}

      <button
        type="button"
        onClick={copy}
        className="ml-1 flex items-center gap-2 border border-sand-200 px-4 py-2.5 text-xs text-slate-600 transition-colors hover:border-gold-400 hover:text-navy-900"
      >
        {copied ? <Check className="size-3.5 text-emerald-600" /> : null}
        {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}

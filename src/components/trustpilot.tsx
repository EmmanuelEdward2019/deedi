"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { site } from "@/lib/site";
import { cx } from "@/components/ui";

declare global {
  interface Window {
    Trustpilot?: { loadFromElement: (element: HTMLElement, forceReload?: boolean) => void };
  }
}

/** Trustpilot's published TrustBox templates, with their recommended heights. */
const TEMPLATES = {
  /** "Review us on Trustpilot" button — included on every Trustpilot plan. */
  collector: { id: "56278e9abfbbba0bdcd568bc", height: "52px" },
  /** TrustScore, star rating and review count. */
  mini: { id: "53aa8807dec7e10d38f59f32", height: "150px" },
} as const;

/**
 * A Trustpilot TrustBox. Renders nothing until
 * NEXT_PUBLIC_TRUSTPILOT_BUSINESS_UNIT_ID is configured.
 */
export function TrustpilotWidget({
  variant,
  theme = "light",
  className,
}: {
  variant: keyof typeof TEMPLATES;
  theme?: "light" | "dark";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { businessUnitId, reviewUrl } = site.trustpilot;

  useEffect(() => {
    // The bootstrap script initialises every widget on the page once, when it
    // loads. Widgets mounted after that — on client-side navigation — have to
    // be initialised by hand.
    if (ref.current && window.Trustpilot) window.Trustpilot.loadFromElement(ref.current, true);
  }, []);

  if (!businessUnitId) return null;

  const template = TEMPLATES[variant];
  return (
    <>
      {/* next/script loads this once however many widgets are on the page. */}
      <Script
        src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
        strategy="lazyOnload"
      />
      <div
        ref={ref}
        className={cx("trustpilot-widget", className)}
        data-locale="en-GB"
        data-template-id={template.id}
        data-businessunit-id={businessUnitId}
        data-style-height={template.height}
        data-style-width="100%"
        data-theme={theme}
      >
        {/* Shown until the widget loads, and to anyone blocking scripts. */}
        <a href={reviewUrl} target="_blank" rel="noopener noreferrer">
          Trustpilot
        </a>
      </div>
    </>
  );
}

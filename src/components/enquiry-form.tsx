"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Check } from "@/components/icons";
import { Button, cx } from "@/components/ui";

export interface EnquiryFormProps {
  /** Pre-selected enquiry type, e.g. "property" or "art". */
  enquiryType?: string;
  /** Slug of the listing the enquiry relates to. */
  relatedRef?: string;
  /** Pre-filled subject line. */
  subject?: string;
  /** Pre-filled message body. */
  defaultMessage?: string;
  /** Show the enquiry-type picker (used on the standalone contact page). */
  showTypePicker?: boolean;
  tone?: "light" | "dark";
  submitLabel?: string;
}

const ENQUIRY_TYPES = [
  { value: "property", label: "Property enquiry" },
  { value: "management", label: "Property management" },
  { value: "investment", label: "Investment & sourcing" },
  { value: "art", label: "Art & commissions" },
  { value: "interiors", label: "Interior decoration" },
  { value: "general", label: "Something else" },
];

export function EnquiryForm({
  enquiryType = "general",
  relatedRef,
  subject,
  defaultMessage = "",
  showTypePicker = false,
  tone = "light",
  submitLabel = "Send enquiry",
}: EnquiryFormProps) {
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const dark = tone === "dark";
  const fieldClass = cx(
    "w-full border px-4 py-3 text-sm transition-colors focus:outline-none",
    dark
      ? "border-white/20 bg-white/5 text-white placeholder:text-white/35 focus:border-gold-400"
      : "border-sand-200 bg-white text-navy-900 placeholder:text-slate-400 focus:border-gold-500",
  );
  const labelClass = cx(
    "mb-1.5 block text-[0.6875rem] font-semibold tracking-[0.14em] uppercase",
    dark ? "text-white/60" : "text-slate-500",
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setState("sending");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source_page: pathname, related_ref: relatedRef ?? null }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? "Your enquiry could not be sent.");
      }

      setState("sent");
      form.reset();
    } catch (caught) {
      setError((caught as Error).message);
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div
        className={cx(
          "flex flex-col items-center px-6 py-14 text-center",
          dark ? "border border-gold-500/30 bg-white/5" : "border border-gold-500/40 bg-sand-50",
        )}
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-gold-500 text-white">
          <Check className="size-7" />
        </span>
        <h3 className={cx("font-display mt-5 text-2xl", dark ? "text-white" : "text-navy-900")}>
          Thank you — we have it.
        </h3>
        <p className={cx("mt-2 max-w-sm text-sm leading-relaxed", dark ? "text-white/60" : "text-slate-600")}>
          Your enquiry has landed in our dashboard and someone will come back to you within one
          working day. For anything urgent, use the live chat button.
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className={cx(
            "mt-6 text-[0.75rem] font-semibold tracking-[0.13em] uppercase underline underline-offset-4 transition-colors",
            dark ? "text-gold-300 hover:text-white" : "text-gold-600 hover:text-navy-900",
          )}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Your name *
          </label>
          <input id="name" name="name" required maxLength={120} className={fieldClass} placeholder="Jane Whitfield" />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            className={fieldClass}
            placeholder="jane@example.co.uk"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone
          </label>
          <input id="phone" name="phone" type="tel" maxLength={40} className={fieldClass} placeholder="07700 900000" />
        </div>
        <div>
          <label htmlFor="enquiry_type" className={labelClass}>
            Enquiry about
          </label>
          {showTypePicker ? (
            <select
              id="enquiry_type"
              name="enquiry_type"
              defaultValue={enquiryType}
              className={cx(fieldClass, "appearance-none")}
            >
              {ENQUIRY_TYPES.map((type) => (
                <option key={type.value} value={type.value} className="text-navy-900">
                  {type.label}
                </option>
              ))}
            </select>
          ) : (
            <>
              <input type="hidden" name="enquiry_type" value={enquiryType} />
              <input
                readOnly
                value={ENQUIRY_TYPES.find((t) => t.value === enquiryType)?.label ?? "Enquiry"}
                className={cx(fieldClass, "cursor-default opacity-70")}
              />
            </>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="subject" className={labelClass}>
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          maxLength={200}
          defaultValue={subject}
          className={fieldClass}
          placeholder="How can we help?"
        />
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={4000}
          defaultValue={defaultMessage}
          className={cx(fieldClass, "resize-y")}
          placeholder="Tell us a little about what you need…"
        />
      </div>

      {state === "error" && (
        <p className="border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <Button type="submit" tone="gold" disabled={state === "sending"} arrow={state !== "sending"}>
          {state === "sending" ? "Sending…" : submitLabel}
        </Button>
        <p className={cx("text-xs", dark ? "text-white/40" : "text-slate-400")}>
          We reply within one working day.
        </p>
      </div>
    </form>
  );
}

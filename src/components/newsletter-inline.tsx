"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

/** Compact newsletter capture used in article sidebars. */
export function NewsletterInline() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setState("sending");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "blog" }),
      });
      setState(response.ok ? "done" : "error");
      if (response.ok) setEmail("");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="surface-navy p-7">
      <p className="eyebrow text-gold-300">The monthly note</p>
      <h3 className="font-display mt-4 text-xl text-white">
        New listings, new work, one market note.
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-white/55">
        Once a month. No sales pitches, and you can leave any time.
      </p>

      {state === "done" ? (
        <p className="mt-5 border border-gold-500/40 bg-white/5 px-4 py-3 text-sm text-gold-300">
          You&apos;re on the list — thank you.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            aria-label="Email address"
            className="w-full border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-gold-400 focus:outline-none"
          />
          <Button type="submit" tone="gold" disabled={state === "sending"} className="w-full">
            {state === "sending" ? "Signing up…" : "Sign me up"}
          </Button>
          {state === "error" && (
            <p className="text-xs text-rose-300">Something went wrong. Please try again.</p>
          )}
        </form>
      )}
    </div>
  );
}

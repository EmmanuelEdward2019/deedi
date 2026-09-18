"use client";

import { useState } from "react";
import { ArrowRight } from "@/components/icons";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim()) return;

    setState("sending");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      setState(response.ok ? "done" : "error");
      if (response.ok) setEmail("");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="mt-5 border border-gold-500/40 bg-white/5 px-4 py-3 text-sm text-gold-300">
        You&apos;re on the list — thank you.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-5">
      <div className="flex border border-white/20 focus-within:border-gold-400">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          aria-label="Email address"
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          aria-label="Subscribe"
          className="flex items-center justify-center bg-gold-500 px-4 text-white transition-colors hover:bg-gold-600 disabled:opacity-60"
        >
          <ArrowRight className="size-4" />
        </button>
      </div>
      {state === "error" && (
        <p className="mt-2 text-xs text-rose-300">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}

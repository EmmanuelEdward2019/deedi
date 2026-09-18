"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "@/lib/actions";
import { Button } from "@/components/ui";

const initial: ActionState = {};

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next} />

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-[0.6875rem] font-semibold tracking-[0.14em] text-slate-500 uppercase"
        >
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          autoFocus
          placeholder="admin@deedi.co.uk"
          className="w-full border border-sand-200 px-4 py-3 text-sm text-navy-900 transition-colors focus:border-gold-500 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-[0.6875rem] font-semibold tracking-[0.14em] text-slate-500 uppercase"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••••"
          className="w-full border border-sand-200 px-4 py-3 text-sm text-navy-900 transition-colors focus:border-gold-500 focus:outline-none"
        />
      </div>

      {state.error && (
        <p className="border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.error}
        </p>
      )}

      <Button type="submit" tone="royal" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

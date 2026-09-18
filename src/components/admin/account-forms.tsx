"use client";

import { useActionState } from "react";
import type { AdminRole } from "@/lib/types";
import {
  changePasswordAction,
  updateOwnProfileAction,
  type ActionState,
} from "@/lib/actions";
import {
  AdminButton,
  FieldLabel,
  FormSection,
  inputClass,
} from "@/components/admin/admin-ui";
import { Check } from "@/components/icons";

const initial: ActionState = {};

function Notice({ state }: { state: ActionState }) {
  if (state.error) {
    return (
      <p className="border border-rose-300 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
        {state.error}
      </p>
    );
  }
  if (state.success) {
    return (
      <p className="flex items-center gap-2 border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
        <Check className="size-4 shrink-0" />
        {state.success}
      </p>
    );
  }
  return null;
}

export function ProfileForm({ name, email, role }: { name: string; email: string; role: AdminRole }) {
  const [state, action, pending] = useActionState(updateOwnProfileAction, initial);

  return (
    <form action={action}>
      <FormSection title="Your details">
        <Notice state={state} />

        <div>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <input id="name" name="name" required defaultValue={name} className={inputClass} />
        </div>

        <div>
          <FieldLabel htmlFor="account-email" hint="Ask an owner to change this">
            Email address
          </FieldLabel>
          <input
            id="account-email"
            value={email}
            readOnly
            className={`${inputClass} cursor-default bg-sand-50 text-slate-500`}
          />
        </div>

        <div>
          <FieldLabel>Role</FieldLabel>
          <p className="border border-sand-200 bg-sand-50 px-3.5 py-2.5 text-sm text-navy-900">
            {role === "owner" ? "Owner" : "Account manager"}
            <span className="ml-2 text-xs text-slate-500">
              {role === "owner"
                ? "— full access, including the team and deleting content"
                : "— can add and edit content and handle enquiries"}
            </span>
          </p>
        </div>

        <div className="border-t border-sand-200 pt-4">
          <AdminButton type="submit" tone="outline" disabled={pending}>
            {pending ? "Saving…" : "Save name"}
          </AdminButton>
        </div>
      </FormSection>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, initial);

  return (
    // Remounting on success clears the fields.
    <form action={action} key={state.success ?? "idle"}>
      <FormSection
        title="Change password"
        description="At least 10 characters, including a letter and a number."
      >
        <Notice state={state} />

        <div>
          <FieldLabel htmlFor="current_password">Current password</FieldLabel>
          <input
            id="current_password"
            name="current_password"
            type="password"
            required
            autoComplete="current-password"
            className={inputClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="password">New password</FieldLabel>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={10}
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
          <div>
            <FieldLabel htmlFor="confirm_password">Confirm new password</FieldLabel>
            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              required
              minLength={10}
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
        </div>

        <div className="border-t border-sand-200 pt-4">
          <AdminButton type="submit" tone="royal" disabled={pending}>
            {pending ? "Changing…" : "Change password"}
          </AdminButton>
        </div>
      </FormSection>
    </form>
  );
}

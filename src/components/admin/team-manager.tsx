"use client";

import { useActionState, useState } from "react";
import type { TeamMember } from "@/lib/queries";
import {
  createTeamMemberAction,
  deleteTeamMemberAction,
  resetMemberPasswordAction,
  updateTeamMemberAction,
  type ActionState,
} from "@/lib/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import {
  AdminButton,
  FieldLabel,
  FormSection,
  inputClass,
  selectClass,
} from "@/components/admin/admin-ui";
import { Badge, cx } from "@/components/ui";
import { Check, Key, Pencil, Plus, Users } from "@/components/icons";
import { formatDate, formatRelative } from "@/lib/format";

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

function RoleBadge({ role }: { role: string }) {
  return role === "owner" ? (
    <Badge tone="gold">Owner</Badge>
  ) : (
    <Badge tone="slate">Manager</Badge>
  );
}

/* ------------------------------------------------------------------ */

function AddMemberForm() {
  const [state, action, pending] = useActionState(createTeamMemberAction, initial);

  return (
    <form action={action} key={state.success ?? "idle"}>
      <FormSection
        title="Add a team member"
        description="They can sign in straight away with the password you set here."
      >
        <Notice state={state} />

        <div>
          <FieldLabel htmlFor="new-name">Name *</FieldLabel>
          <input
            id="new-name"
            name="name"
            required
            placeholder="Priya Raman"
            className={inputClass}
          />
        </div>

        <div>
          <FieldLabel htmlFor="new-email">Email *</FieldLabel>
          <input
            id="new-email"
            name="email"
            type="email"
            required
            autoComplete="off"
            placeholder="priya@deedi.co.uk"
            className={inputClass}
          />
        </div>

        <div>
          <FieldLabel htmlFor="new-role">Role</FieldLabel>
          <select id="new-role" name="role" defaultValue="manager" className={selectClass}>
            <option value="manager">Account manager</option>
            <option value="owner">Owner</option>
          </select>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Managers add and edit properties, artwork and journal posts, and handle enquiries.
            Only owners can delete content or manage the team.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="new-password" hint="Min 10 chars">
              Password *
            </FieldLabel>
            <input
              id="new-password"
              name="password"
              type="password"
              required
              minLength={10}
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
          <div>
            <FieldLabel htmlFor="new-confirm">Confirm *</FieldLabel>
            <input
              id="new-confirm"
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
          <AdminButton type="submit" tone="royal" disabled={pending} className="w-full">
            <Plus className="size-4" />
            {pending ? "Creating…" : "Create account"}
          </AdminButton>
        </div>
      </FormSection>
    </form>
  );
}

/* ------------------------------------------------------------------ */

function EditMember({ member, isSelf }: { member: TeamMember; isSelf: boolean }) {
  const [state, action, pending] = useActionState(updateTeamMemberAction, initial);

  return (
    <form action={action} className="space-y-3 border-t border-sand-200 pt-4">
      <input type="hidden" name="id" value={member.id} />
      <Notice state={state} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor={`name-${member.id}`}>Name</FieldLabel>
          <input
            id={`name-${member.id}`}
            name="name"
            defaultValue={member.name}
            required
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel htmlFor={`role-${member.id}`}>Role</FieldLabel>
          <select
            id={`role-${member.id}`}
            name="role"
            defaultValue={member.role}
            className={selectClass}
          >
            <option value="manager">Account manager</option>
            <option value="owner">Owner</option>
          </select>
        </div>
      </div>

      {isSelf && (
        <p className="text-xs text-amber-700">
          This is your own account — removing owner access will lock you out of this page.
        </p>
      )}

      <AdminButton type="submit" tone="outline" size="sm" disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </AdminButton>
    </form>
  );
}

function ResetPassword({ member }: { member: TeamMember }) {
  const [state, action, pending] = useActionState(resetMemberPasswordAction, initial);

  return (
    <form action={action} className="space-y-3 border-t border-sand-200 pt-4" key={state.success ?? "idle"}>
      <input type="hidden" name="id" value={member.id} />
      <Notice state={state} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor={`pw-${member.id}`} hint="Min 10 chars">
            New password
          </FieldLabel>
          <input
            id={`pw-${member.id}`}
            name="password"
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel htmlFor={`pwc-${member.id}`}>Confirm</FieldLabel>
          <input
            id={`pwc-${member.id}`}
            name="confirm_password"
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            className={inputClass}
          />
        </div>
      </div>

      <AdminButton type="submit" tone="outline" size="sm" disabled={pending}>
        <Key className="size-3.5" />
        {pending ? "Setting…" : "Set password"}
      </AdminButton>
    </form>
  );
}

/* ------------------------------------------------------------------ */

export function TeamManager({
  members,
  currentUserId,
}: {
  members: TeamMember[];
  currentUserId: number;
}) {
  const [panel, setPanel] = useState<{ id: number; kind: "edit" | "password" } | null>(null);
  const ownerCount = members.filter((m) => m.role === "owner").length;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-6">
          <AddMemberForm />
        </div>
      </div>

      <div className="lg:col-span-2">
        <ul className="space-y-3">
          {members.map((member) => {
            const isSelf = member.id === currentUserId;
            const lastOwner = member.role === "owner" && ownerCount === 1;
            const open = panel?.id === member.id ? panel.kind : null;

            return (
              <li key={member.id} className="border border-sand-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <span
                      className={cx(
                        "flex size-11 shrink-0 items-center justify-center text-xs font-bold text-white",
                        member.role === "owner" ? "bg-gold-500" : "bg-royal-700",
                      )}
                    >
                      {member.name
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </span>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-navy-900">{member.name}</p>
                        <RoleBadge role={member.role} />
                        {isSelf && (
                          <span className="text-[0.625rem] tracking-[0.12em] text-slate-400 uppercase">
                            You
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">{member.email}</p>
                      <p className="mt-1 text-[0.6875rem] text-slate-400">
                        {member.last_login_at
                          ? `Last signed in ${formatRelative(member.last_login_at)}`
                          : "Has not signed in yet"}
                        {" · added "}
                        {formatDate(member.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setPanel(open === "edit" ? null : { id: member.id, kind: "edit" })
                      }
                      className={cx(
                        "inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-xs font-semibold transition-colors",
                        open === "edit"
                          ? "border-royal-700 bg-royal-700 text-white"
                          : "border-sand-200 text-navy-800 hover:border-gold-400 hover:text-gold-600",
                      )}
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setPanel(open === "password" ? null : { id: member.id, kind: "password" })
                      }
                      className={cx(
                        "inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-xs font-semibold transition-colors",
                        open === "password"
                          ? "border-royal-700 bg-royal-700 text-white"
                          : "border-sand-200 text-navy-800 hover:border-gold-400 hover:text-gold-600",
                      )}
                    >
                      <Key className="size-3.5" />
                      Password
                    </button>

                    {!isSelf && !lastOwner && (
                      <form action={deleteTeamMemberAction}>
                        <input type="hidden" name="id" value={member.id} />
                        <DeleteButton label="" confirmLabel="Sure?" compact />
                      </form>
                    )}
                  </div>
                </div>

                {open === "edit" && <EditMember member={member} isSelf={isSelf} />}
                {open === "password" && <ResetPassword member={member} />}
              </li>
            );
          })}
        </ul>

        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-slate-500">
          <Users className="mt-px size-3.5 shrink-0" />
          There must always be at least one owner, and you cannot remove your own account here.
        </p>
      </div>
    </div>
  );
}

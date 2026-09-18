import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-ui";
import { PasswordForm, ProfileForm } from "@/components/admin/account-forms";
import { requireAdmin } from "@/lib/auth";
import { getTeamMemberById } from "@/lib/queries";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Your account" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await requireAdmin("/admin/account");
  const me = await getTeamMemberById(session.sub);

  return (
    <>
      <AdminHeader
        title="Your account"
        subtitle={
          me?.last_login_at
            ? `Signed in as ${session.email} · last sign-in ${formatDate(me.last_login_at)}`
            : `Signed in as ${session.email}`
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileForm
          name={me?.name ?? session.name}
          email={me?.email ?? session.email}
          role={me?.role ?? session.role}
        />
        <PasswordForm />
      </div>
    </>
  );
}

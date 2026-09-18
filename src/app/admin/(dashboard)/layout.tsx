import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { currentRole, requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Deedi Admin" },
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  // Read from the database so a role change takes effect immediately,
  // rather than when the old session cookie expires.
  const role = (await currentRole()) ?? session.role;

  return (
    <AdminShell session={session} role={role}>
      {children}
    </AdminShell>
  );
}

import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-ui";
import { TeamManager } from "@/components/admin/team-manager";
import { requireOwner } from "@/lib/auth";
import { getTeamMembers } from "@/lib/queries";

export const metadata: Metadata = { title: "Team" };
export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const session = await requireOwner("/admin/team");
  const members = await getTeamMembers();

  const managers = members.filter((m) => m.role === "manager").length;

  return (
    <>
      <AdminHeader
        title="Team"
        subtitle={`${members.length} ${members.length === 1 ? "account" : "accounts"} · ${managers} ${managers === 1 ? "manager" : "managers"}`}
      />
      <TeamManager members={members} currentUserId={session.sub} />
    </>
  );
}

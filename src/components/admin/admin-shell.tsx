"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/lib/actions";
import type { Session } from "@/lib/auth";
import type { AdminRole } from "@/lib/types";
import {
  Building,
  Close,
  Dashboard,
  Eye,
  FileText,
  Image as ImageIcon,
  Inbox,
  Logout,
  Menu,
  Key,
  Palette,
  Users,
} from "@/components/icons";
import { cx } from "@/components/ui";

const LINKS = [
  { href: "/admin", label: "Overview", Icon: Dashboard, exact: true },
  { href: "/admin/properties", label: "Properties", Icon: Building },
  { href: "/admin/art", label: "Artwork", Icon: Palette },
  { href: "/admin/blog", label: "Journal", Icon: FileText },
  { href: "/admin/gallery", label: "Gallery", Icon: ImageIcon },
  { href: "/admin/messages", label: "Enquiries", Icon: Inbox },
  // Team management is owner-only, so it is filtered out for managers below.
  { href: "/admin/team", label: "Team", Icon: Users, ownerOnly: true },
];

export function AdminShell({
  session,
  role,
  children,
}: {
  session: Session;
  role: AdminRole;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const initials = session.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const links = LINKS.filter((link) => !link.ownerOnly || role === "owner");

  const nav = (
    <nav className="space-y-1">
      {links.map(({ href, label, Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cx(
              "flex items-center gap-3 px-4 py-3 text-sm transition-colors",
              active
                ? "border-l-2 border-gold-500 bg-white/10 font-medium text-white"
                : "border-l-2 border-transparent text-white/55 hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon className="size-[18px]" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Sidebar — desktop */}
      <aside className="surface-navy fixed inset-y-0 left-0 z-40 hidden w-64 flex-col lg:flex">
        <div className="border-b border-white/10 px-6 py-6">
          <Link href="/">
            <Image
              src="/images/brand/deedi-logo.png"
              alt="Deedi Ltd"
              width={2125}
              height={740}
              className="h-7 w-auto"
            />
          </Link>
          <p className="mt-3 text-[0.625rem] tracking-[0.18em] text-white/35 uppercase">
            Administration
          </p>
        </div>

        <div className="flex-1 overflow-y-auto py-5">{nav}</div>

        <div className="border-t border-white/10 p-4">
          <Link
            href="/"
            target="_blank"
            className="mb-2 flex items-center gap-3 px-2 py-2.5 text-sm text-white/55 transition-colors hover:text-gold-300"
          >
            <Eye className="size-[18px]" />
            View website
          </Link>

          <Link
            href="/admin/account"
            className={cx(
              "mb-2 flex items-center gap-3 px-2 py-2.5 text-sm transition-colors",
              pathname === "/admin/account"
                ? "text-gold-300"
                : "text-white/55 hover:text-gold-300",
            )}
          >
            <Key className="size-[18px]" />
            Your account
          </Link>

          <div className="flex items-center gap-3 border-t border-white/10 px-2 pt-4">
            <span className="flex size-9 shrink-0 items-center justify-center bg-gold-500 text-xs font-bold text-white">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{session.name}</p>
              <p className="truncate text-[0.6875rem] text-white/40">
                {role === "owner" ? "Owner" : "Account manager"}
              </p>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                aria-label="Sign out"
                className="p-1.5 text-white/40 transition-colors hover:text-rose-300"
              >
                <Logout className="size-[18px]" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Top bar — mobile */}
      <header className="surface-navy sticky top-0 z-40 flex items-center justify-between px-4 py-3 lg:hidden">
        <Link href="/admin">
          <Image
            src="/images/brand/deedi-logo.png"
            alt="Deedi Ltd"
            width={2125}
            height={740}
            className="h-6 w-auto"
          />
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="p-2 text-white"
        >
          <Menu className="size-6" />
        </button>
      </header>

      {/* Drawer — mobile */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-950/60" onClick={() => setOpen(false)} />
          <div className="surface-navy absolute inset-y-0 left-0 flex w-72 flex-col">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <p className="text-[0.625rem] tracking-[0.18em] text-white/50 uppercase">
                Administration
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="p-1.5 text-white"
              >
                <Close className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">{nav}</div>
            <div className="border-t border-white/10 p-4">
              <Link
                href="/admin/account"
                onClick={() => setOpen(false)}
                className="mb-1 flex w-full items-center gap-3 px-2 py-2.5 text-sm text-white/60 transition-colors hover:text-gold-300"
              >
                <Key className="size-[18px]" />
                Your account
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 px-2 py-2.5 text-sm text-white/60 transition-colors hover:text-rose-300"
                >
                  <Logout className="size-[18px]" />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</div>
      </div>
    </div>
  );
}

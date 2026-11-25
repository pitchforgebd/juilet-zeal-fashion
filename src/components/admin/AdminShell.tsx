"use client";

import type { ReactNode } from "react";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { NotificationBell } from "@/components/admin/NotificationBell";
import { AdminMobileMenu } from "./AdminMobileMenu";
import { AdminNavList } from "./AdminNavList";
import { buildAdminNav, type AdminPermissions } from "./adminNav";

/**
 * The admin frame. From `md` up: a fixed sidebar beside the page. Below it:
 * a sticky top bar with a menu button that opens the same navigation in a
 * drawer (AdminMobileMenu), so phones get the full grouped menu instead of a
 * sideways strip of links.
 */
export function AdminShell({
  name,
  storeName,
  children,
  ...permissions
}: AdminPermissions & {
  /** The signed-in staff member. */
  name: string;
  /** The store's name from Settings → General. */
  storeName: string;
  children: ReactNode;
}) {
  const groups = buildAdminNav(permissions);

  return (
    <div className="min-h-screen bg-page md:grid md:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="hidden bg-ink text-white md:block print:hidden">
        <p className="px-4 py-4 text-lg font-semibold">{storeName}</p>
        <AdminNavList groups={groups} />
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-black/5 bg-card px-2 py-2 sm:px-4 md:static md:py-3 print:hidden">
          <div className="flex min-w-0 items-center gap-1">
            <AdminMobileMenu storeName={storeName} groups={groups} />
            <p className="truncate text-sm font-semibold text-ink md:hidden">
              {storeName}
            </p>
            <p className="hidden truncate text-sm font-semibold text-ink md:block">
              {name}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <NotificationBell />
            <LogoutButton />
          </div>
        </header>
        <main className="p-4 sm:p-6 print:p-0">{children}</main>
      </div>
    </div>
  );
}

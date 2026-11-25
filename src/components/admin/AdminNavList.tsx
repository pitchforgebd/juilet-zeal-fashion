"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { focusRing } from "@/components/ui/buttonStyles";
import { cn } from "@/lib/utils/cn";
import { isActiveAdminLink, type AdminNavGroup } from "./adminNav";

/** The grouped admin links — the desktop sidebar and the phone drawer. */
export function AdminNavList({
  groups,
  onNavigate,
}: {
  groups: AdminNavGroup[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="space-y-4 px-2 pb-4">
      {groups.map((group) => (
        <div key={group.label} className="space-y-1">
          <p className="px-3 pb-1 text-xs font-semibold tracking-wide text-white/40 uppercase">
            {group.label}
          </p>
          {group.links.map((link) => {
            const active = isActiveAdminLink(link.href, pathname);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm whitespace-nowrap transition-colors duration-fast ease-standard",
                  active ? "bg-white/15" : "hover:bg-white/10",
                  focusRing,
                )}
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

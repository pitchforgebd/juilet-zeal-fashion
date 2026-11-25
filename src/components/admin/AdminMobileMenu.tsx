"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { focusRing } from "@/components/ui/buttonStyles";
import { cn } from "@/lib/utils/cn";
import { AdminNavList } from "./AdminNavList";
import type { AdminNavGroup } from "./adminNav";

/**
 * Below `md` the sidebar is replaced by this: a menu button in the top bar
 * that opens the same grouped navigation in a slide-out drawer. Closes on
 * navigation, Escape or a tap outside; locks page scroll while open.
 * Portalled to <body>, like the storefront drawer, so nothing in the page
 * can become its containing block.
 */
export function AdminMobileMenu({
  storeName,
  groups,
}: {
  storeName: string;
  groups: AdminNavGroup[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="admin-drawer"
        onClick={() => setOpen(true)}
        className={cn(
          "grid size-10 place-items-center rounded-md text-ink hover:bg-page md:hidden",
          focusRing,
        )}
      >
        <span className="sr-only">Open menu</span>
        <Menu aria-hidden="true" className="size-5" />
      </button>
      {open
        ? createPortal(
            <div className="fixed inset-0 z-50 md:hidden">
              <button
                type="button"
                aria-label="Close menu"
                className="absolute inset-0 bg-ink/50"
                onClick={() => setOpen(false)}
              />
              <div
                id="admin-drawer"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="absolute inset-y-0 left-0 flex w-[min(100%,18rem)] flex-col bg-ink text-white"
              >
                <div className="flex items-center justify-between px-4 py-3">
                  <p id={titleId} className="text-lg font-semibold">
                    {storeName}
                  </p>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={() => setOpen(false)}
                    className={cn(
                      "grid size-10 place-items-center rounded-md hover:bg-white/10",
                      focusRing,
                    )}
                  >
                    <span className="sr-only">Close menu</span>
                    <X aria-hidden="true" className="size-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <AdminNavList groups={groups} onNavigate={() => setOpen(false)} />
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

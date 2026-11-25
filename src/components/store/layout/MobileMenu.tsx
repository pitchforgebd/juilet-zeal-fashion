"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/store/layout/Logo";
import { OfferPill } from "@/components/store/layout/OfferPill";
import type { CategoryNode } from "@/lib/catalog/categoryTree";
import { cn } from "@/lib/utils/cn";

const footerLinks = siteConfig.topBarLinks.filter((link) =>
  ["trackOrder", "help", "faq"].includes(link.id),
);

const rowLink =
  "flex h-12 flex-1 items-center text-[15px] text-ink transition-colors duration-fast ease-standard hover:text-mauve";

export function MobileMenu({ tree }: { tree: CategoryNode[] }) {
  const t = useTranslations("common");
  const nav = useTranslations("nav");
  const home = useTranslations("home");
  const links = useTranslations("links");
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
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
        className="inline-flex size-10 items-center justify-center rounded-[10px] text-ink transition-colors duration-fast ease-standard hover:bg-page lg:hidden"
        aria-expanded={open}
        aria-controls="mobile-drawer"
        onClick={() => setOpen(true)}
      >
        <span className="sr-only">{t("openMenu")}</span>
        <Menu aria-hidden="true" strokeWidth={1.5} className="size-[18px]" />
      </button>

      {/* Portalled to <body>: the sticky header's backdrop-blur makes it the
       * containing block for `position: fixed` children, which would clip
       * the drawer to the header's height. */}
      {open
        ? createPortal(
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-ink/50"
                aria-label={t("closeMenu")}
                onClick={() => setOpen(false)}
              />
              <nav
                id="mobile-drawer"
                aria-labelledby={titleId}
                className="absolute top-0 left-0 flex h-full w-[min(100%,21rem)] flex-col bg-card shadow-soft"
              >
                <div className="flex items-center justify-between border-b border-ink/8 px-4 py-3">
                  <p id={titleId} className="sr-only">
                    {t("menu")}
                  </p>
                  <Logo />
                  <button
                    ref={closeRef}
                    type="button"
                    className="inline-flex size-10 items-center justify-center rounded-[10px] text-ink transition-colors duration-fast ease-standard hover:bg-page"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">{t("closeMenu")}</span>
                    <X aria-hidden="true" strokeWidth={1.5} className="size-[18px]" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4">
                  <OfferPill label={home("offersLabel")} className="flex w-full" />
                  <ul className="mt-4">
                    <li className="flex border-b border-ink/8">
                      <Link href="/shop?sort=newest" className={rowLink}>
                        {nav("newIn")}
                      </Link>
                    </li>
                    {tree.map((node) => {
                      const isOpen = expanded === node.slug;
                      const panelId = `drawer-${node.slug}`;
                      return (
                        <li key={node.slug} className="border-b border-ink/8">
                          <div className="flex items-center">
                            <Link href={`/category/${node.slug}`} className={rowLink}>
                              {node.name}
                            </Link>
                            {node.children.length > 0 ? (
                              <button
                                type="button"
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onClick={() => setExpanded(isOpen ? null : node.slug)}
                                className="grid size-10 place-items-center rounded-[10px] text-muted transition-colors duration-fast ease-standard hover:bg-page hover:text-ink"
                              >
                                <span className="sr-only">
                                  {nav("expand", { name: node.name })}
                                </span>
                                <ChevronDown
                                  aria-hidden="true"
                                  className={cn(
                                    "size-4 transition-transform duration-base motion-reduce:transition-none",
                                    isOpen && "rotate-180",
                                  )}
                                />
                              </button>
                            ) : null}
                          </div>
                          {node.children.length > 0 && isOpen ? (
                            <ul id={panelId} className="mb-3 rounded-xl bg-page p-2">
                              {node.children.map((child) => (
                                <li key={child.slug}>
                                  <Link
                                    href={`/category/${child.slug}`}
                                    className="flex h-10 items-center rounded-[4px] px-3 text-sm text-ink transition-colors duration-fast ease-standard hover:bg-card"
                                  >
                                    {child.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <ul className="grid grid-cols-2 gap-2 border-t border-ink/8 bg-page px-4 py-4">
                  <li>
                    <Link href="/account" className="text-sm text-muted hover:text-ink">
                      {nav("myAccount")}
                    </Link>
                  </li>
                  {footerLinks.map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted hover:text-ink"
                      >
                        {links(link.id)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

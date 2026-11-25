"use client";

import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import { useCartCount, useCartHydrated } from "@/store/cart";
import { House, LayoutGrid, ShoppingBag, User } from "lucide-react";

const icons: Record<string, ReactNode> = {
  home: <House aria-hidden="true" strokeWidth={1.5} className="size-[18px]" />,
  categories: <LayoutGrid aria-hidden="true" strokeWidth={1.5} className="size-[18px]" />,
  cart: <ShoppingBag aria-hidden="true" strokeWidth={1.5} className="size-[18px]" />,
  account: <User aria-hidden="true" strokeWidth={1.5} className="size-[18px]" />,
};

export function MobileNav() {
  const pathname = usePathname();
  const cartCount = useCartCount();
  const hydrated = useCartHydrated();
  const t = useTranslations("common");

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/8 bg-card pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid grid-cols-4">
        {siteConfig.mobileNav.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex h-16 flex-col items-center justify-center gap-1 text-xs transition-colors duration-fast ease-standard ${
                  active ? "text-ink" : "text-muted"
                }`}
              >
                <span className="relative">
                  {icons[item.id]}
                  {item.id === "cart" && hydrated && cartCount > 0 ? (
                    <span className="absolute -top-1.5 -right-2.5 grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 text-[10px] leading-none text-white tabular-nums ring-2 ring-card">
                      {cartCount}
                    </span>
                  ) : null}
                </span>
                {t(item.id)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { summarizeCart } from "@/lib/catalog/cart-lines";
import { useCartCatalog } from "@/lib/catalog/useCartCatalog";
import { formatTaka } from "@/lib/utils/currency";
import { ShoppingBag } from "lucide-react";
import { useCartHydrated, useCartStore } from "@/store/cart";
import { useUiStore } from "@/store/ui";

export function CartButton() {
  const t = useTranslations("common");
  const hydrated = useCartHydrated();
  const lines = useCartStore((state) => state.lines);
  const couponDiscount = useCartStore((state) => state.couponDiscount);
  const openCart = useUiStore((state) => state.openCart);
  const { catalog } = useCartCatalog(lines);
  const summary = summarizeCart(lines, couponDiscount, catalog);
  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  // Only show a price once every line has one — never a misleading ৳0 while
  // a product is still loading or being retried. Dead lines (deleted
  // products) are already dropped by CartHydration.
  const priced = hydrated && count > 0 && summary.resolved.length === lines.length;
  const label = priced
    ? `${t("cart")}, ${count}, ${formatTaka(summary.merchandise)}`
    : hydrated && count > 0
      ? `${t("cart")}, ${count}`
      : t("cart");

  const [bump, setBump] = useState(false);
  const previousCount = useRef(count);
  useEffect(() => {
    if (hydrated && count > previousCount.current) {
      setBump(true);
      const timer = window.setTimeout(() => setBump(false), 400);
      previousCount.current = count;
      return () => window.clearTimeout(timer);
    }
    previousCount.current = count;
  }, [count, hydrated]);

  return (
    <button
      type="button"
      aria-label={label}
      onClick={openCart}
      className="inline-flex h-10 shrink-0 items-center gap-3 rounded-[10px] px-2 text-ink transition-colors duration-fast ease-standard hover:bg-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span className="relative">
        <ShoppingBag aria-hidden="true" strokeWidth={1.5} className="size-[18px]" />
        {hydrated && count > 0 ? (
          <span
            aria-hidden="true"
            className={`absolute -top-1.5 -right-2 grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 text-[10px] leading-none text-white tabular-nums ring-2 ring-card ${bump ? "animate-bump" : ""}`}
          >
            {count}
          </span>
        ) : null}
      </span>
      {priced ? (
        <span className="hidden text-sm tabular-nums sm:block">
          {formatTaka(summary.merchandise)}
        </span>
      ) : null}
    </button>
  );
}

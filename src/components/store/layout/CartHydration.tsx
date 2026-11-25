"use client";

import { useEffect } from "react";
import { deadCartLines } from "@/lib/catalog/cart-lines";
import { useCartCatalog } from "@/lib/catalog/useCartCatalog";
import { useCartHydrated, useCartStore } from "@/store/cart";

/**
 * Mounted once by StoreShell: restores the saved cart, then drops lines that
 * can never be bought again (product deleted, or its variant removed) so the
 * cart badge, drawer and checkout never count something that has no price.
 */
export function CartHydration() {
  const hydrated = useCartHydrated();
  const lines = useCartStore((state) => state.lines);
  const { catalog, gone } = useCartCatalog(lines);

  useEffect(() => {
    void Promise.resolve(useCartStore.persist.rehydrate()).finally(() => {
      useCartStore.getState().setHasHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    const { removeLine } = useCartStore.getState();
    for (const line of deadCartLines(lines, catalog, gone)) {
      removeLine(line.slug, line.variantId);
    }
  }, [hydrated, lines, catalog, gone]);

  return null;
}

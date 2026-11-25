"use client";

import { useEffect, useMemo, useState } from "react";
import { PRODUCT_RETRY_MS, productCache } from "@/lib/catalog/productCache";
import type { Product } from "@/types/catalog";

type FetchResult = Product | "gone" | "error";

/** 404 means the product no longer exists; anything else is a failure worth
 * retrying (server error, offline) — never mistaken for a deleted product. */
async function fetchProduct(slug: string): Promise<FetchResult> {
  try {
    const response = await fetch(`/api/v1/products/${slug}`);
    if (response.status === 404) {
      return "gone";
    }
    if (!response.ok) {
      return "error";
    }
    const body: unknown = await response.json();
    const record = typeof body === "object" && body !== null ? body : {};
    return "data" in record && record.data ? (record.data as Product) : "gone";
  } catch {
    return "error";
  }
}

/** Resolves a list of product slugs against the real database via
 * `/api/v1/products/[slug]`. Shared by the cart (`useCartCatalog`) and by
 * Wishlist/Compare/Recently-Viewed, which only ever persist a slug list
 * client-side and need the real product behind each one.
 *
 * `loading` is derived on render (any slug not yet attempted), not set from
 * an effect — so the very first paint already knows it's loading and the
 * cart/checkout never flash an "empty" state while products are in flight.
 * `gone` lists slugs the API confirmed are deleted (callers may drop them);
 * failed requests are retried every few seconds instead. Results live in a
 * tab-wide cache (see productCache.ts). */
export function useResolvedProducts(slugs: string[]): {
  catalog: Map<string, Product>;
  loading: boolean;
  gone: string[];
} {
  const [version, setVersion] = useState(0);
  const slugKey = Array.from(new Set(slugs)).sort().join(",");

  useEffect(() => {
    const wanted = slugKey ? slugKey.split(",") : [];
    const stale = productCache.stale(wanted);
    let cancelled = false;
    let retry: number | undefined;
    const scheduleRetry = () => {
      if (productCache.failed(wanted).length > 0) {
        retry = window.setTimeout(
          () => setVersion((current) => current + 1),
          PRODUCT_RETRY_MS + 50,
        );
      }
    };
    if (stale.length === 0) {
      scheduleRetry();
    } else {
      Promise.all(
        stale.map(async (slug) => {
          const result = await fetchProduct(slug);
          if (result === "error") {
            productCache.fail(slug);
          } else {
            productCache.set(slug, result === "gone" ? null : result);
          }
        }),
      ).then(() => {
        if (!cancelled) {
          setVersion((current) => current + 1);
        }
      });
    }
    return () => {
      cancelled = true;
      window.clearTimeout(retry);
    };
  }, [slugKey, version]);

  return useMemo(() => {
    const wanted = slugKey ? slugKey.split(",") : [];
    return {
      catalog: productCache.catalog(wanted),
      loading: productCache.pending(wanted).length > 0,
      gone: productCache.gone(wanted),
    };
    // `version` bumps after each fetch so the memo re-reads the cache.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugKey, version]);
}

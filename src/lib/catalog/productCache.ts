import type { Product } from "@/types/catalog";

/** How long a fetched product counts as fresh before it's re-fetched in the
 * background. Stale entries are still shown meanwhile; checkout totals never
 * come from here anyway (they're re-quoted by the server). */
export const PRODUCT_CACHE_TTL_MS = 60_000;

/** How soon a failed request (server error, offline) is tried again. */
export const PRODUCT_RETRY_MS = 10_000;

type Entry = {
  /** `null` when the product is gone (the API answered 404), or when a
   * request failed before anything was ever loaded for it. */
  product: Product | null;
  fetchedAt: number;
  /** The last request failed (not a 404) — retry soon, never treat as gone. */
  failed: boolean;
};

/**
 * A tab-wide cache of products resolved by slug. Module-level on purpose:
 * the header cart button, the cart drawer, the cart page and checkout all
 * resolve the same cart lines, so navigating cart → checkout reuses what's
 * already loaded instead of starting from an empty map.
 *
 * It tells two kinds of miss apart: a product that is *gone* (deleted — safe
 * to drop from a cart) and a request that *failed* (server error or offline —
 * the product may well exist, so it's retried after `retryMs`).
 */
export function createProductCache(
  ttlMs = PRODUCT_CACHE_TTL_MS,
  retryMs = PRODUCT_RETRY_MS,
) {
  const entries = new Map<string, Entry>();
  return {
    /** A successful answer: the product, or `null` when it no longer exists. */
    set(slug: string, product: Product | null, now = Date.now()) {
      entries.set(slug, { product, fetchedAt: now, failed: false });
    },
    /** A failed request. Keeps whatever was loaded before, so a hiccup never
     * blanks out a product the shopper already saw. */
    fail(slug: string, now = Date.now()) {
      entries.set(slug, {
        product: entries.get(slug)?.product ?? null,
        fetchedAt: now,
        failed: true,
      });
    },
    /** Slugs that have never been attempted — the caller is still loading these. */
    pending(slugs: string[]): string[] {
      return slugs.filter((slug) => !entries.has(slug));
    },
    /** Slugs to fetch: never attempted, failed longer than `retryMs` ago, or
     * loaded longer than the TTL ago. */
    stale(slugs: string[], now = Date.now()): string[] {
      return slugs.filter((slug) => {
        const entry = entries.get(slug);
        if (!entry) {
          return true;
        }
        return now - entry.fetchedAt > (entry.failed ? retryMs : ttlMs);
      });
    },
    /** Slugs whose last request failed — the caller should retry them. */
    failed(slugs: string[]): string[] {
      return slugs.filter((slug) => entries.get(slug)?.failed === true);
    },
    /** Slugs the API confirmed no longer exist. */
    gone(slugs: string[]): string[] {
      return slugs.filter((slug) => {
        const entry = entries.get(slug);
        return entry !== undefined && !entry.failed && entry.product === null;
      });
    },
    catalog(slugs: string[]): Map<string, Product> {
      const found = new Map<string, Product>();
      for (const slug of slugs) {
        const product = entries.get(slug)?.product;
        if (product) {
          found.set(slug, product);
        }
      }
      return found;
    },
  };
}

export const productCache = createProductCache();

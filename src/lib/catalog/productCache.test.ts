import { describe, expect, it } from "vitest";
import { createProductCache } from "@/lib/catalog/productCache";
import { products } from "@/lib/mock/catalog";

const tee = products.find((product) => product.slug === "cotton-crew-tshirt");
if (!tee) {
  throw new Error("fixture product cotton-crew-tshirt missing from mock catalog");
}

describe("productCache", () => {
  it("treats never-fetched slugs as pending and stale", () => {
    const cache = createProductCache(1000, 100);
    expect(cache.pending(["a", "b"])).toEqual(["a", "b"]);
    expect(cache.stale(["a", "b"], 0)).toEqual(["a", "b"]);
  });

  it("returns cached products in the catalog and stops reporting them pending", () => {
    const cache = createProductCache(1000, 100);
    cache.set(tee.slug, tee, 0);
    expect(cache.pending([tee.slug])).toEqual([]);
    expect(cache.catalog([tee.slug]).get(tee.slug)).toBe(tee);
  });

  it("marks entries stale only after the TTL, but keeps serving them", () => {
    const cache = createProductCache(1000, 100);
    cache.set(tee.slug, tee, 0);
    expect(cache.stale([tee.slug], 1000)).toEqual([]);
    expect(cache.stale([tee.slug], 1001)).toEqual([tee.slug]);
    expect(cache.catalog([tee.slug]).size).toBe(1);
  });

  it("reports a deleted product as gone, not pending and not in the catalog", () => {
    const cache = createProductCache(1000, 100);
    cache.set("deleted-product", null, 0);
    expect(cache.pending(["deleted-product"])).toEqual([]);
    expect(cache.gone(["deleted-product"])).toEqual(["deleted-product"]);
    expect(cache.catalog(["deleted-product"]).size).toBe(0);
  });

  it("never reports a failed request as gone, and retries it after the retry window", () => {
    const cache = createProductCache(1000, 100);
    cache.fail(tee.slug, 0);
    expect(cache.pending([tee.slug])).toEqual([]);
    expect(cache.gone([tee.slug])).toEqual([]);
    expect(cache.failed([tee.slug])).toEqual([tee.slug]);
    expect(cache.stale([tee.slug], 100)).toEqual([]);
    expect(cache.stale([tee.slug], 101)).toEqual([tee.slug]);
  });

  it("keeps a product it already had when a later refresh fails", () => {
    const cache = createProductCache(1000, 100);
    cache.set(tee.slug, tee, 0);
    cache.fail(tee.slug, 2000);
    expect(cache.catalog([tee.slug]).get(tee.slug)).toBe(tee);
    expect(cache.failed([tee.slug])).toEqual([tee.slug]);
  });

  it("clears the failure once a retry succeeds", () => {
    const cache = createProductCache(1000, 100);
    cache.fail(tee.slug, 0);
    cache.set(tee.slug, tee, 200);
    expect(cache.failed([tee.slug])).toEqual([]);
    expect(cache.catalog([tee.slug]).get(tee.slug)).toBe(tee);
  });
});

import { describe, expect, it } from "vitest";
import { deadCartLines } from "@/lib/catalog/cart-lines";
import { products } from "@/lib/mock/catalog";

const tee = products.find((product) => product.slug === "cotton-crew-tshirt");
if (!tee) {
  throw new Error("fixture product cotton-crew-tshirt missing from mock catalog");
}
const teeVariant = tee.variants[0]!.id;
const catalog = new Map([[tee.slug, tee]]);

describe("deadCartLines", () => {
  it("drops lines for products the API reported gone", () => {
    const lines = [
      { slug: tee.slug, variantId: teeVariant, qty: 1 },
      { slug: "kids-school-bag", variantId: "p6-default", qty: 1 },
    ];
    expect(deadCartLines(lines, catalog, ["kids-school-bag"])).toEqual([lines[1]]);
  });

  it("drops lines whose saved variant no longer exists on the product", () => {
    const line = { slug: tee.slug, variantId: "variant-that-was-deleted", qty: 2 };
    expect(deadCartLines([line], catalog, [])).toEqual([line]);
  });

  it("keeps lines whose product hasn't loaded yet or failed to load", () => {
    const line = { slug: "pearl-drop-earrings", variantId: "p2-default", qty: 1 };
    expect(deadCartLines([line], catalog, [])).toEqual([]);
  });

  it("keeps a valid line", () => {
    expect(
      deadCartLines([{ slug: tee.slug, variantId: teeVariant, qty: 1 }], catalog, []),
    ).toEqual([]);
  });
});

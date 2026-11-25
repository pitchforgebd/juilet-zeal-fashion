import { describe, expect, it } from "vitest";
import { buildCategoryTree, leafCategories } from "@/lib/catalog/categoryTree";

const flat = [
  { slug: "women", name: "Women", parentSlug: null },
  { slug: "women-dresses", name: "Dresses", parentSlug: "women" },
  { slug: "men", name: "Men", parentSlug: null },
  { slug: "women-tops", name: "Tops", parentSlug: "women" },
  { slug: "sale", name: "Sale", parentSlug: null },
  { slug: "orphan", name: "Orphan", parentSlug: "hidden-parent" },
];

describe("buildCategoryTree", () => {
  it("nests children under their parent, keeping list order", () => {
    expect(buildCategoryTree(flat)).toEqual([
      {
        slug: "women",
        name: "Women",
        children: [
          { slug: "women-dresses", name: "Dresses" },
          { slug: "women-tops", name: "Tops" },
        ],
      },
      { slug: "men", name: "Men", children: [] },
      { slug: "sale", name: "Sale", children: [] },
    ]);
  });

  it("drops children whose parent isn't in the list", () => {
    const slugs = buildCategoryTree(flat).flatMap((node) => [
      node.slug,
      ...node.children.map((child) => child.slug),
    ]);
    expect(slugs).not.toContain("orphan");
  });

  it("returns an empty tree for no categories", () => {
    expect(buildCategoryTree([])).toEqual([]);
  });
});

describe("leafCategories", () => {
  it("keeps sub-categories and childless top-level categories", () => {
    expect(leafCategories(flat).map((category) => category.slug)).toEqual([
      "women-dresses",
      "men",
      "women-tops",
      "sale",
      "orphan",
    ]);
  });
});

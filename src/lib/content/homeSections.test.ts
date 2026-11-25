import { describe, expect, it } from "vitest";
import { HOME_SECTIONS, mergeHomeSections } from "@/lib/content/homeSections";

const row = (key: string, enabled = true) => ({ key, enabled, target: "" });

describe("mergeHomeSections", () => {
  it("returns every section, switched on, in the default order when nothing is saved", () => {
    const merged = mergeHomeSections([]);
    expect(merged.map((section) => section.key)).toEqual(HOME_SECTIONS.map((s) => s.key));
    expect(merged.every((section) => section.enabled)).toBe(true);
  });

  it("keeps the saved order and on/off state", () => {
    const merged = mergeHomeSections([
      row("flash"),
      row("hero"),
      row("trust", false),
      row("categories"),
      row("featured"),
      row("offers"),
      row("testimonials"),
    ]);
    expect(merged.slice(0, 3).map((s) => [s.key, s.enabled])).toEqual([
      ["flash", true],
      ["hero", true],
      ["trust", false],
    ]);
    expect(merged.map((s) => s.sortOrder)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it("drops saved rows for blocks the homepage no longer has", () => {
    const keys = mergeHomeSections([row("blog"), row("hero"), row("instagram")]).map(
      (s) => s.key,
    );
    expect(keys).not.toContain("blog");
    expect(keys).not.toContain("instagram");
    expect(keys[0]).toBe("hero");
  });

  it("appends sections added since the last save", () => {
    const keys = mergeHomeSections([row("hero"), row("categories")]).map((s) => s.key);
    expect(keys).toEqual([
      "hero",
      "categories",
      "trust",
      "featured",
      "flash",
      "offers",
      "testimonials",
    ]);
  });

  it("always uses the current section names, never a stale saved title", () => {
    const [offers] = mergeHomeSections([{ ...row("offers"), title: "Offers" } as never]);
    expect(offers?.title).toBe("Collection showcases");
  });
});

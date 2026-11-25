/**
 * The homepage blocks the storefront actually renders
 * (src/app/[locale]/(store)/page.tsx), in their default order. Admin →
 * Content → Homepage reorders and switches these; nothing else is offered,
 * so every admin control has a visible effect.
 */
export const HOME_SECTIONS = [
  { key: "hero", title: "Hero slider" },
  { key: "trust", title: "Trust strip" },
  { key: "categories", title: "Shop by category" },
  { key: "featured", title: "Signature edit (new arrivals, best sellers, on sale)" },
  { key: "flash", title: "Flash sale" },
  { key: "offers", title: "Collection showcases" },
  { key: "testimonials", title: "Testimonials" },
] as const;

export type HomeSectionKey = (typeof HOME_SECTIONS)[number]["key"];

export type HomeSectionRow = {
  key: string;
  title: string;
  enabled: boolean;
  sortOrder: number;
  target: string;
};

export function isHomeSectionKey(key: string): key is HomeSectionKey {
  return HOME_SECTIONS.some((section) => section.key === key);
}

/**
 * Saved rows → the sections to show and edit: saved order and on/off kept,
 * rows for blocks that no longer exist dropped, names always taken from
 * HOME_SECTIONS (so a renamed block never shows a stale title), and any
 * block added since the last save appended, switched on.
 */
export function mergeHomeSections(
  saved: { key: string; enabled: boolean; target: string }[],
): HomeSectionRow[] {
  const titles = new Map<string, string>(HOME_SECTIONS.map((s) => [s.key, s.title]));
  const kept = saved.filter((row) => titles.has(row.key));
  const present = new Set(kept.map((row) => row.key));
  const added = HOME_SECTIONS.filter((section) => !present.has(section.key)).map(
    (section) => ({ key: section.key, enabled: true, target: "" }),
  );
  return [...kept, ...added].map((row, index) => ({
    key: row.key,
    title: titles.get(row.key) ?? row.key,
    enabled: row.enabled,
    sortOrder: index,
    target: row.target,
  }));
}

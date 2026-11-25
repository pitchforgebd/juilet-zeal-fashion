export type FlatCategory = {
  slug: string;
  name: string;
  parentSlug: string | null;
};

export type CategoryNode = {
  slug: string;
  name: string;
  children: { slug: string; name: string }[];
};

/**
 * Turns the flat, sort-ordered category list into top-level entries with
 * their direct children (the storefront menu only goes one level deep).
 * Children whose parent is missing or inactive are dropped rather than
 * promoted, so a hidden parent hides its whole branch.
 */
export function buildCategoryTree(categories: FlatCategory[]): CategoryNode[] {
  const roots = categories
    .filter((category) => category.parentSlug === null)
    .map((category) => ({
      slug: category.slug,
      name: category.name,
      children: [] as { slug: string; name: string }[],
    }));
  const bySlug = new Map(roots.map((root) => [root.slug, root]));
  for (const category of categories) {
    if (category.parentSlug !== null) {
      bySlug
        .get(category.parentSlug)
        ?.children.push({ slug: category.slug, name: category.name });
    }
  }
  return roots;
}

/** Sub-categories only — the "product type" level shown as homepage tiles. */
export function leafCategories<T extends FlatCategory>(categories: T[]): T[] {
  const parents = new Set(
    categories.map((category) => category.parentSlug).filter(Boolean),
  );
  return categories.filter((category) => !parents.has(category.slug));
}

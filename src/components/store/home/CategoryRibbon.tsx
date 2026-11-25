import { Link } from "@/i18n/navigation";
import { focusRing } from "@/components/ui/buttonStyles";
import { ProductMedia } from "@/components/store/product/ProductMedia";
import { cn } from "@/lib/utils/cn";

type RibbonCategory = {
  slug: string;
  name: string;
  hue: number;
  imageUrl: string | null;
};

/**
 * "Shop by category": arch-topped tiles — the arch is the brand's one
 * signature shape, shared only with the hero frame. Scrolls sideways on
 * phones, a grid above. Hover changes the border, nothing moves.
 */
export function CategoryRibbon({ categories }: { categories: RibbonCategory[] }) {
  if (categories.length === 0) {
    return null;
  }
  return (
    <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-8">
      {categories.slice(0, 8).map((category) => (
        <li key={category.slug} className="w-28 shrink-0 snap-start sm:w-auto">
          <Link
            href={`/category/${category.slug}`}
            className={cn("group block text-center", focusRing)}
          >
            <span className="block overflow-hidden rounded-t-full rounded-b-xl border border-ink/8 bg-peach transition-colors duration-fast ease-standard group-hover:border-ink/25">
              <ProductMedia
                hue={category.hue}
                name={category.name}
                image={
                  category.imageUrl
                    ? { url: category.imageUrl, alt: category.name }
                    : null
                }
                className="aspect-3/4"
              />
            </span>
            <span className="mt-3 block text-sm text-ink transition-colors duration-fast ease-standard group-hover:text-mauve">
              {category.name}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion";
import { ctaArrow, ctaPrimary } from "@/components/store/home/cta";
import { ProductCard } from "@/components/store/product/ProductCard";
import { TrackedList } from "@/components/store/tracking/TrackedList";
import { cn } from "@/lib/utils/cn";
import type { Product } from "@/types/catalog";

type ShowcaseProps = {
  slug: string;
  name: string;
  description: string;
  /** The category's own photo from admin; the banner stays plain without one. */
  imageUrl: string | null;
  products: Product[];
  /** Banner on the right instead of the left (Noora's `.show.rev`). */
  reverse?: boolean;
};

/**
 * One top-level category: a tall banner (its photo when there is one)
 * beside three of its products.
 */
export async function CategoryShowcase({
  slug,
  name,
  description,
  imageUrl,
  products,
  reverse = false,
}: ShowcaseProps) {
  const t = await getTranslations("home");
  const items = products.slice(0, 3);
  return (
    <Reveal
      className={cn(
        "grid gap-6 lg:gap-8",
        reverse ? "lg:grid-cols-[2fr_1fr]" : "lg:grid-cols-[1fr_2fr]",
      )}
    >
      <Link
        href={`/category/${slug}`}
        className={cn(
          "relative isolate flex min-h-80 flex-col justify-end overflow-hidden rounded-[20px] border border-white/8 bg-[#151213] bg-cover bg-center p-8 text-white sm:p-10 lg:min-h-128",
          reverse && "lg:order-2",
        )}
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      >
        {imageUrl ? (
          // Darkens only the bottom of the photo, where the copy sits.
          <span
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-linear-to-t from-black/70 via-black/20 to-transparent"
          />
        ) : null}
        <span className="font-heading text-4xl leading-none font-normal tracking-[-0.02em] sm:text-5xl">
          {name}
        </span>
        <span className="mt-3 max-w-xs text-[15px] leading-6 text-white/70">
          {description}
        </span>
        <span className={cn(ctaPrimary, "mt-6 self-start")}>
          {t("shopCategory", { name })}
          <ArrowRight aria-hidden="true" strokeWidth={1.5} className={ctaArrow} />
        </span>
      </Link>
      <TrackedList listName={`Home: ${slug}`} products={items}>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6">
          {items.map((product, index) => (
            // Two columns on phones: the third card would sit alone on a
            // row, so it only appears once the grid has three columns.
            <div
              key={product.slug}
              className={index === 2 ? "hidden sm:block" : undefined}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </TrackedList>
    </Reveal>
  );
}

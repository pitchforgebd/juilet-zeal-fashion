import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { discountPercent, displayPrice, productImage } from "@/lib/catalog/pricing";
import { Stagger, StaggerItem } from "@/components/motion";
import { ProductMedia } from "@/components/store/product/ProductMedia";
import { PriceBlock } from "@/components/store/product/PriceBlock";
import { QuickAdd } from "@/components/store/product/QuickAdd";
import { cn } from "@/lib/utils/cn";
import type { Product } from "@/types/catalog";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations("product");
  const price = displayPrice(product);
  const discount = price.regular ? discountPercent(price.regular, price.current) : 0;
  const soldOut = product.variants.every((variant) => variant.stock <= 0);

  return (
    <article className="group flex h-full flex-col">
      <div className="relative overflow-hidden rounded-theme border border-ink/8 bg-peach transition-colors duration-fast ease-standard group-hover:border-ink/20">
        <Link href={`/product/${product.slug}`} className="block">
          {/* One quiet tag at most: sold out wins over new. Sold out is
           * visual only — QuickAdd's own label already says "Out of stock"
           * to assistive tech, so it would just be read twice. */}
          {soldOut ? (
            <span
              aria-hidden="true"
              className="absolute inset-s-3 top-3 z-10 rounded-md bg-card px-2 py-0.5 text-xs text-ink"
            >
              {t("out")}
            </span>
          ) : product.isNew ? (
            <span className="absolute inset-s-3 top-3 z-10 rounded-md bg-card px-2 py-0.5 text-xs text-ink">
              {t("badgeNew")}
            </span>
          ) : null}
          <ProductMedia
            hue={product.imageHue}
            name={product.name}
            image={productImage(product)}
            className="aspect-4/5"
            imgClassName={cn(soldOut && "opacity-60")}
          />
        </Link>
        {/* Fades in over the photo on hover or keyboard focus (Noora's
         * `.quick`); always visible on touch-sized screens, which have no
         * hover. 16px card radius − 8px inset = 8px button radius. */}
        <div className="absolute inset-x-2 bottom-2 z-10 transition-[opacity,transform] duration-base ease-standard lg:translate-y-1 lg:opacity-0 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 motion-reduce:transition-none">
          <QuickAdd product={product} />
        </div>
      </div>
      <div className="flex flex-1 flex-col pt-3">
        {product.brandName ? (
          <p className="text-xs text-muted">{product.brandName}</p>
        ) : null}
        <h3 className="mt-1 mb-2 line-clamp-2 text-[15px] leading-[1.4] text-ink">
          <Link
            href={`/product/${product.slug}`}
            className="transition-colors duration-fast ease-standard hover:text-mauve"
          >
            {product.name}
          </Link>
        </h3>
        <PriceBlock current={price.current} regular={price.regular} discount={discount} />
      </div>
    </article>
  );
}

const gridClass =
  "grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4";

type ProductGridProps = {
  products: Product[];
  /** Stagger the cards in as the grid scrolls into view. */
  reveal?: boolean;
};

export function ProductGrid({ products, reveal = false }: ProductGridProps) {
  if (!reveal) {
    return (
      <div className={gridClass}>
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    );
  }
  return (
    <Stagger className={gridClass} amount={0.05}>
      {products.map((product) => (
        <StaggerItem key={product.slug}>
          <ProductCard product={product} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}

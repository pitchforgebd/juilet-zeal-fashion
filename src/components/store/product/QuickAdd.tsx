"use client";

import { useTranslations } from "next-intl";
import { defaultVariant } from "@/lib/catalog/pricing";
import { useAddToCart } from "@/hooks/useAddToCart";
import type { Product } from "@/types/catalog";

type QuickAddProps = {
  product: Product;
};

export function QuickAdd({ product }: QuickAddProps) {
  const addToCart = useAddToCart();
  const t = useTranslations("product");
  const variant = defaultVariant(product);
  const disabled = variant.stock <= 0;

  return (
    <button
      type="button"
      onClick={() =>
        void addToCart(product, { slug: product.slug, variantId: variant.id, qty: 1 })
      }
      disabled={disabled}
      className="h-10 w-full rounded-lg bg-ink text-sm font-medium text-white transition-[background-color,transform] duration-fast ease-standard hover:bg-black active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-ink/60 disabled:active:scale-100"
    >
      {disabled ? t("out") : t("quickAdd")}
    </button>
  );
}

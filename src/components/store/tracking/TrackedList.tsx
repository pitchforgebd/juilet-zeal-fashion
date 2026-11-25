import type { ReactNode } from "react";
import { defaultVariant } from "@/lib/catalog/pricing";
import { productTrackItem } from "@/lib/tracking/ecommerce";
import { SelectItemTracker } from "@/components/store/tracking/SelectItemTracker";
import { TrackOnce } from "@/components/store/tracking/TrackOnce";
import type { Product } from "@/types/catalog";

/**
 * Wraps a rendered product list so it reports GA4's `view_item_list` once
 * when it mounts and `select_item` when a shopper opens a product from it
 * (DATA_LAYER_ENABLE.md §২). `listName` becomes `item_list_name`, so keep it
 * stable — reports group by it.
 */
export function TrackedList({
  listName,
  products,
  children,
}: {
  listName: string;
  products: Product[];
  children: ReactNode;
}) {
  const listed = products.map((product) => ({
    slug: product.slug,
    item: productTrackItem(product, defaultVariant(product)),
  }));
  return (
    <SelectItemTracker listName={listName} products={listed}>
      <TrackOnce
        name="ViewItemList"
        data={{ listName, items: listed.map((entry) => entry.item) }}
      />
      {children}
    </SelectItemTracker>
  );
}

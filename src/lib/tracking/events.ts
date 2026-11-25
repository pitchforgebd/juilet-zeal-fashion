import { readConsent, track } from "@/lib/tracking/browser";
import { purchaseCustomer } from "@/lib/tracking/customer";
import { purchaseItems, type TrackItem } from "@/lib/tracking/ecommerce";
import type { Order } from "@/types/catalog";

const trackedKey = "unibaazar:tracked-orders";
const itemsKey = "unibaazar:purchase-items";

type RememberedItems = Record<string, TrackItem[]>;

function readRemembered(): RememberedItems {
  try {
    const raw = window.localStorage.getItem(itemsKey);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as RememberedItems)
      : {};
  } catch {
    return {};
  }
}

/**
 * Called at checkout with the fully-described items (brand, categories,
 * variant) so the purchase event can report them — possibly on a later page
 * load, after a payment-gateway round trip. Keeps the last 20 orders.
 */
export function rememberPurchaseItems(orderId: string, items: TrackItem[]): void {
  try {
    const kept = Object.entries(readRemembered()).slice(-19);
    window.localStorage.setItem(
      itemsKey,
      JSON.stringify(Object.fromEntries([...kept, [orderId, items]])),
    );
  } catch {
    // Storage full or blocked: purchase still fires, just without categories.
  }
}

function alreadyTracked(id: string): boolean {
  try {
    const raw = window.localStorage.getItem(trackedKey);
    const ids: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(ids) && ids.includes(id)) {
      return true;
    }
    const next = [id, ...(Array.isArray(ids) ? ids : [])].slice(0, 50);
    window.localStorage.setItem(trackedKey, JSON.stringify(next));
    return false;
  } catch {
    return false;
  }
}

/** Reloading the order page must not report the sale a second time. */
export async function trackPurchase(order: Order): Promise<void> {
  if (typeof window === "undefined" || alreadyTracked(order.id)) {
    return;
  }
  // Personal details only reach the data layer if marketing wasn't turned down.
  const customer =
    readConsent()?.marketing === false ? undefined : await purchaseCustomer(order);
  track(
    "Purchase",
    {
      transactionId: order.id,
      value: order.total,
      shipping: order.deliveryCharge,
      coupon: order.couponCode,
      paymentType: order.paymentMethod,
      customer,
      items: purchaseItems(order.items, readRemembered()[order.id]),
    },
    order.id,
  );
  window.dispatchEvent(
    new CustomEvent("unibaazar:purchase", {
      detail: { id: order.id, total: order.total },
    }),
  );
}

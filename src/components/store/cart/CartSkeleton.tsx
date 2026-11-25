import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Placeholder for the cart and checkout while the saved cart is still being
 * read from storage and its products resolved — shown instead of the
 * "Your cart is empty" state, which would otherwise flash first.
 */
export function CartSkeleton() {
  const t = useTranslations("common");
  return (
    <div
      role="status"
      aria-live="polite"
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"
    >
      <span className="sr-only">{t("loading")}</span>
      <div className="space-y-3">
        {[0, 1].map((row) => (
          <div key={row} className="flex gap-4 rounded-theme bg-card p-4 shadow-soft">
            <Skeleton className="size-20 shrink-0 rounded-theme" />
            <div className="flex-1 space-y-2 py-1">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-8 w-28" />
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-3 rounded-theme bg-card p-5 shadow-soft">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-11 w-full rounded-full" />
      </div>
    </div>
  );
}

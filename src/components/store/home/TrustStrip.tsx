import {
  Banknote,
  PackageSearch,
  RefreshCcw,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";

/**
 * Four plain facts about ordering, in a white card that overlaps the bottom
 * of the hero (the Noora layout). Every line here is a real store policy or
 * feature — no ratings or counts that can't be checked.
 */
export function TrustStrip() {
  const t = useTranslations("home");
  const items: { icon: LucideIcon; title: string; text: string }[] = [
    { icon: Truck, title: t("trustDeliveryTitle"), text: t("trustDeliveryText") },
    { icon: Banknote, title: t("trustCodTitle"), text: t("trustCodText") },
    { icon: RefreshCcw, title: t("trustExchangeTitle"), text: t("trustExchangeText") },
    { icon: PackageSearch, title: t("trustTrackingTitle"), text: t("trustTrackingText") },
  ];

  return (
    <ul className="grid grid-cols-2 rounded-theme border border-ink/8 bg-card shadow-[0_8px_24px_rgba(0,0,0,0.06)] lg:grid-cols-4">
      {items.map(({ icon: Icon, title, text }, index) => (
        <li
          key={title}
          className={cn(
            "flex items-start gap-3 border-ink/8 p-4 sm:p-6",
            index % 2 === 1 && "border-s",
            index >= 2 && "border-t lg:border-t-0",
            index > 0 && "lg:border-s",
          )}
        >
          <Icon
            aria-hidden="true"
            strokeWidth={1.5}
            className="mt-0.5 size-[18px] shrink-0 text-muted"
          />
          <div>
            <h3 className="text-[15px] font-medium text-ink">{title}</h3>
            <p className="mt-1 text-sm leading-5 text-muted">{text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

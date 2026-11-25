import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ctaArrow, ctaPrimary } from "@/components/store/home/cta";
import { FlashCountdown } from "@/components/store/home/FlashCountdown";
import { cn } from "@/lib/utils/cn";

/** The flash-sale box: what's on, the live countdown, one call to action. */
export async function FlashBanner({ endsAt }: { endsAt: string }) {
  const t = await getTranslations("home");
  return (
    <div className="grid items-center gap-8 rounded-[20px] border border-white/8 bg-[#151213] px-6 py-10 text-white sm:px-10 lg:grid-cols-[1fr_auto_auto] lg:gap-12 lg:px-12">
      <div>
        <h2 className="font-heading text-[1.75rem] leading-[1.15] font-normal tracking-[-0.01em] sm:text-4xl sm:tracking-[-0.02em]">
          {t("flashSaleTitle")}
        </h2>
        <p className="mt-2 max-w-sm text-[15px] leading-6 text-white/65">
          {t("flashSaleText")}
        </p>
      </div>
      <FlashCountdown endsAt={endsAt} tone="onDark" />
      <Link href="/flash-deals" className={cn(ctaPrimary, "justify-self-start")}>
        {t("viewAllDeals")}
        <ArrowRight aria-hidden="true" strokeWidth={1.5} className={ctaArrow} />
      </Link>
    </div>
  );
}

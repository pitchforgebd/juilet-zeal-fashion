import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

export type QrPaymentConfig = {
  imageUrl: string;
  /** e.g. "bKash merchant · 01XXXXXXXXX" */
  account: string;
  note: string;
};

/**
 * Shown under the payment choices when the shopper picks QR: the store's
 * code, who it pays, the exact amount, then the two fields the shopper fills
 * in after paying (rendered by CheckoutForm, which owns their validation).
 */
export function QrPaymentPanel({
  config,
  amount,
  fields,
}: {
  config: QrPaymentConfig;
  amount: string;
  fields: ReactNode;
}) {
  const t = useTranslations("checkout");
  return (
    <div className="mt-4 grid gap-6 rounded-xl border border-ink/8 bg-page p-4 sm:grid-cols-[176px_1fr] sm:p-6">
      <div className="text-center">
        {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded image, any host */}
        <img
          src={config.imageUrl}
          alt={t("qrImageAlt")}
          width={176}
          height={176}
          className="mx-auto size-44 rounded-lg border border-ink/8 bg-white object-contain p-2"
        />
        {config.account ? (
          <p className="mt-2 text-sm text-muted">{config.account}</p>
        ) : null}
      </div>
      <div>
        <p className="text-sm text-muted">{t("qrAmountLabel")}</p>
        <p className="mt-1 text-2xl font-medium text-ink tabular-nums">{amount}</p>
        <ol className="mt-4 list-decimal space-y-1 ps-5 text-sm text-foreground">
          <li>{t("qrStepScan")}</li>
          <li>{t("qrStepPay")}</li>
          <li>{t("qrStepSubmit")}</li>
        </ol>
        {config.note ? <p className="mt-3 text-sm text-muted">{config.note}</p> : null}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">{fields}</div>
      </div>
    </div>
  );
}

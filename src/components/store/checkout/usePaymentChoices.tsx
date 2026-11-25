import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Banknote, QrCode, ShieldCheck } from "lucide-react";
import type { PaymentMethod } from "@/types/catalog";

export type PaymentChoice = {
  value: PaymentMethod;
  label: string;
  hint: string;
  icon: ReactNode;
};

const iconClass = "size-5";

/**
 * The checkout payment choices, each switched on independently by the
 * admin, so any combination (or all three) can show:
 * - cash on delivery (Admin → Settings → Checkout);
 * - pay online — submits as `card`, which the server routes to the
 *   SSLCommerz gateway, whose hosted page offers bKash, Nagad, Rocket and
 *   cards (on once its keys are saved in Admin → Settings → Integrations);
 * - pay by QR code — the shopper pays the store's QR and submits their
 *   number and transaction ID for an admin to verify (Admin → Settings →
 *   Checkout).
 */
export function usePaymentChoices({
  cod,
  online,
  qr,
}: {
  cod: boolean;
  online: boolean;
  qr: boolean;
}): PaymentChoice[] {
  const t = useTranslations("checkout");
  const choices: PaymentChoice[] = [];
  if (cod) {
    choices.push({
      value: "cod",
      label: t("paymentCod"),
      hint: t("paymentCodHint"),
      icon: <Banknote className={iconClass} />,
    });
  }
  if (online) {
    choices.push({
      value: "card",
      label: t("paymentOnline"),
      hint: t("paymentOnlineHint"),
      icon: <ShieldCheck className={iconClass} />,
    });
  }
  if (qr) {
    choices.push({
      value: "qr",
      label: t("paymentQr"),
      hint: t("paymentQrHint"),
      icon: <QrCode className={iconClass} />,
    });
  }
  return choices;
}

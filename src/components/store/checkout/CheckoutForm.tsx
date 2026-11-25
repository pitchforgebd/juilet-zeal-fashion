"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MapPin, Truck } from "lucide-react";
import { CaptchaField } from "@/components/store/auth/CaptchaField";
import { CartSkeleton } from "@/components/store/cart/CartSkeleton";
import { Button } from "@/components/ui/Button";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { summarizeCart } from "@/lib/catalog/cart-lines";
import { useCartCatalog } from "@/lib/catalog/useCartCatalog";
import { useCheckoutQuote, type CheckoutQuote } from "@/lib/catalog/useCheckoutQuote";
import { TrackOnce } from "@/components/store/tracking/TrackOnce";
import { track } from "@/lib/tracking/browser";
import { cartTrackItems } from "@/lib/tracking/cart";
import { rememberPurchaseItems } from "@/lib/tracking/events";
import { readAdIdentifiers } from "@/lib/tracking/fbclid";
import { readUtm } from "@/lib/tracking/utm";
import { isStoredOrder, savePlacedOrder } from "@/lib/orders/session";
import { formatTaka } from "@/lib/utils/currency";
import {
  checkoutSchema,
  normalizeBdPhone,
  type CheckoutInput,
} from "@/lib/validation/customer";
import { translatedError } from "@/lib/validation/messages";
import { useCartHydrated, useCartStore } from "@/store/cart";
import { CheckoutSummary } from "./CheckoutSummary";
import { ChoiceCard, choiceRadioClass } from "./ChoiceCard";
import { QrPaymentPanel, type QrPaymentConfig } from "./QrPaymentPanel";
import { usePaymentChoices } from "./usePaymentChoices";

const iconClass = "size-5";

export function CheckoutForm({
  codEnabled = true,
  onlineEnabled = false,
  qr = null,
}: {
  codEnabled?: boolean;
  onlineEnabled?: boolean;
  /** QR payment details when it's switched on, otherwise null. */
  qr?: QrPaymentConfig | null;
}) {
  const router = useRouter();
  const t = useTranslations("checkout");
  const shop = useTranslations("shop");
  const v = useTranslations("validation");
  const payments = usePaymentChoices({
    cod: codEnabled,
    online: onlineEnabled,
    qr: qr !== null,
  });
  const lines = useCartStore((state) => state.lines);
  const couponCode = useCartStore((state) => state.couponCode);
  const couponDiscount = useCartStore((state) => state.couponDiscount);
  const reservationToken = useCartStore((state) => state.reservationToken);
  const clear = useCartStore((state) => state.clear);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      qrPayerNumber: "",
      qrTransactionId: "",
      area: "inside-dhaka",
      paymentMethod: payments[0]?.value ?? "cod",
    },
  });

  const area = watch("area");
  const paymentMethod = watch("paymentMethod");
  const hydrated = useCartHydrated();
  const { catalog, loading } = useCartCatalog(lines);
  // Line items (name/qty/unit price) come from the already-loaded product
  // catalog — no round trip needed for those. Subtotal/discount/delivery/
  // total come from the live quote below instead, the same endpoint that
  // will actually be re-quoted at order placement, so this page can never
  // show a total the server then charges something different for.
  const summary = summarizeCart(lines, couponDiscount, catalog);
  const quoteState = useCheckoutQuote(lines, couponCode, area, reservationToken);
  const liveQuote = quoteState.byArea[area];

  const chargeLabel = (quote: CheckoutQuote | undefined) =>
    quote
      ? quote.deliveryCharge === 0
        ? t("deliveryFree")
        : formatTaka(quote.deliveryCharge)
      : "…";

  // Same guard as the cart page: before the saved cart is read from
  // storage and its products resolved, zero resolved lines isn't "empty".
  if (!hydrated || (summary.resolved.length === 0 && loading)) {
    return <CartSkeleton />;
  }

  if (summary.resolved.length === 0) {
    return (
      <div className="rounded-theme bg-card p-8 text-center shadow-soft">
        <p className="font-heading font-semibold text-ink">{t("emptyCart")}</p>
        <Link href="/shop" className={buttonStyles({ className: "mt-4" })}>
          {shop("browseProducts")}
        </Link>
      </div>
    );
  }

  async function placeOrder(values: CheckoutInput) {
    setFormError(null);
    const phone = normalizeBdPhone(values.phone);
    if (!phone) {
      setFormError("Enter a valid Bangladeshi mobile number");
      return;
    }
    const items = cartTrackItems(summary.resolved);
    const coupon = useCartStore.getState().couponCode ?? undefined;
    track("AddShippingInfo", { items, coupon, shippingTier: values.area });
    track("AddPaymentInfo", { items, coupon, paymentType: values.paymentMethod });
    const state = useCartStore.getState();
    const response = await fetch("/api/v1/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...values,
        phone,
        lines: state.lines,
        couponCode: state.couponCode || undefined,
        reservationToken: state.reservationToken,
        ...readUtm(),
        ...readAdIdentifiers(),
      }),
    });
    const body: unknown = await response.json().catch(() => null);
    const record = typeof body === "object" && body !== null ? body : {};
    if (!response.ok) {
      const message =
        "error" in record && typeof record.error === "string"
          ? record.error
          : t("errorPlaceOrder");
      setFormError(message);
      return;
    }
    const order = "data" in record ? record.data : null;
    if (!isStoredOrder(order)) {
      setFormError(t("errorPlaceOrder"));
      return;
    }
    savePlacedOrder(order);
    rememberPurchaseItems(order.id, items);
    clear();
    // COD and QR are complete once placed (QR waits for an admin to
    // verify the transaction ID); only the gateway needs a redirect.
    if (values.paymentMethod === "cod" || values.paymentMethod === "qr") {
      router.push(`/order-success/${order.id}`);
      return;
    }
    const gateway = await fetch("/api/v1/payments/initiate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ orderNumber: order.id, phone }),
    });
    const gatewayBody: unknown = await gateway.json().catch(() => null);
    const gatewayRecord =
      typeof gatewayBody === "object" && gatewayBody !== null ? gatewayBody : {};
    const gatewayData = "data" in gatewayRecord ? gatewayRecord.data : null;
    const redirectUrl =
      gateway.ok &&
      typeof gatewayData === "object" &&
      gatewayData !== null &&
      "redirectUrl" in gatewayData &&
      typeof gatewayData.redirectUrl === "string"
        ? gatewayData.redirectUrl
        : null;
    if (redirectUrl) {
      window.location.href = redirectUrl;
      return;
    }
    router.push(`/order-success/${order.id}`);
  }

  return (
    <form
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"
      onSubmit={handleSubmit(placeOrder)}
      noValidate
    >
      <div className="space-y-6 rounded-theme bg-card p-4 shadow-soft sm:p-6">
        <section className="space-y-4">
          <h2 className="font-heading text-lg font-semibold text-ink">
            {t("deliveryDetailsHeading")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label={t("fieldName")}
              autoComplete="name"
              required
              error={translatedError(v, errors.name?.message)}
              {...register("name")}
            />
            <Input
              label={t("fieldPhone")}
              inputMode="tel"
              autoComplete="tel"
              required
              placeholder={t("phonePlaceholder")}
              error={translatedError(v, errors.phone?.message)}
              {...register("phone")}
            />
          </div>
          <Textarea
            label={t("fieldAddress")}
            autoComplete="street-address"
            required
            rows={4}
            error={translatedError(v, errors.address?.message)}
            {...register("address")}
          />
        </section>
        <fieldset className="space-y-2">
          <legend className="font-heading text-lg font-semibold text-ink">
            {t("deliveryAreaLegend")}
          </legend>
          <div className="grid gap-2 sm:grid-cols-2">
            <ChoiceCard
              control={
                <input
                  type="radio"
                  value="inside-dhaka"
                  className={choiceRadioClass}
                  {...register("area")}
                />
              }
              icon={<MapPin className={iconClass} />}
              title={t("areaInsideDhaka")}
              trailing={chargeLabel(quoteState.byArea["inside-dhaka"])}
            />
            <ChoiceCard
              control={
                <input
                  type="radio"
                  value="outside-dhaka"
                  className={choiceRadioClass}
                  {...register("area")}
                />
              }
              icon={<Truck className={iconClass} />}
              title={t("areaOutsideDhaka")}
              trailing={chargeLabel(quoteState.byArea["outside-dhaka"])}
            />
          </div>
        </fieldset>
        <fieldset className="space-y-2">
          <legend className="font-heading text-lg font-semibold text-ink">
            {t("paymentMethodLegend")}
          </legend>
          {payments.length === 0 ? (
            <p role="alert" className="rounded-theme bg-peach p-4 text-sm text-ink">
              {t("paymentUnavailable")}
            </p>
          ) : null}
          <div className="grid gap-2 sm:grid-cols-2">
            {payments.map((method) => (
              <ChoiceCard
                key={method.value}
                control={
                  <input
                    type="radio"
                    value={method.value}
                    className={choiceRadioClass}
                    {...register("paymentMethod")}
                  />
                }
                icon={method.icon}
                title={method.label}
                description={method.hint}
              />
            ))}
          </div>
          {qr && paymentMethod === "qr" ? (
            <QrPaymentPanel
              config={qr}
              amount={liveQuote ? formatTaka(liveQuote.total) : "…"}
              fields={
                <>
                  <Input
                    label={t("qrPayerNumberLabel")}
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    placeholder={t("phonePlaceholder")}
                    error={translatedError(v, errors.qrPayerNumber?.message)}
                    {...register("qrPayerNumber")}
                  />
                  <Input
                    label={t("qrTransactionIdLabel")}
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    required
                    error={translatedError(v, errors.qrTransactionId?.message)}
                    {...register("qrTransactionId")}
                  />
                </>
              }
            />
          ) : null}
        </fieldset>
        <CaptchaField onToken={(token) => setValue("captchaToken", token)} />
        {formError ? (
          <div role="alert">
            <FieldError>{formError}</FieldError>
          </div>
        ) : null}
      </div>
      <TrackOnce
        name="InitiateCheckout"
        data={{
          items: cartTrackItems(summary.resolved),
          coupon: couponCode ?? undefined,
        }}
      />
      <CheckoutSummary
        items={summary.resolved}
        subtotal={formatTaka(liveQuote?.subtotal ?? summary.subtotal)}
        discount={formatTaka(liveQuote?.discount ?? summary.discount)}
        delivery={chargeLabel(liveQuote)}
        total={liveQuote ? formatTaka(liveQuote.total) : "…"}
        error={quoteState.error}
      >
        <Button
          type="submit"
          size="lg"
          className="mt-4 w-full"
          isLoading={isSubmitting}
          loadingLabel={t("submitting")}
          disabled={
            isSubmitting ||
            quoteState.loading ||
            !liveQuote ||
            !!quoteState.error ||
            payments.length === 0
          }
        >
          {t("submit")}
        </Button>
      </CheckoutSummary>
    </form>
  );
}

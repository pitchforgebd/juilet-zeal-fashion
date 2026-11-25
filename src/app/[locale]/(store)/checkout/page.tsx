import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { PageTitle } from "@/components/store/common/PageTitle";
import { CheckoutForm } from "@/components/store/checkout/CheckoutForm";
import { isOnlinePaymentConfigured } from "@/lib/payment/sslcommerz";
import { loadCheckout } from "@/server/settings/store";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("checkout");
  return { title: t("metaTitle") };
}

export default async function CheckoutPage() {
  const [checkout, onlineEnabled] = await Promise.all([
    loadCheckout(),
    isOnlinePaymentConfigured(),
  ]);
  const t = await getTranslations("checkout");
  const common = await getTranslations("common");
  const cart = await getTranslations("cart");
  return (
    <>
      <PageTitle
        title={t("pageTitle")}
        subtitle={checkout.guest ? t("subtitleGuest") : t("subtitleSignIn")}
        crumbs={[
          { href: "/", label: common("home") },
          { href: "/cart", label: cart("crumb") },
          { label: t("crumb") },
        ]}
      />
      <Container className="py-6">
        <CheckoutForm
          codEnabled={checkout.cod}
          onlineEnabled={onlineEnabled}
          qr={
            // Never offer QR without a code to scan, even if switched on.
            checkout.qrEnabled && checkout.qrImage
              ? {
                  imageUrl: checkout.qrImage,
                  account: checkout.qrAccount,
                  note: checkout.qrNote,
                }
              : null
          }
        />
      </Container>
    </>
  );
}

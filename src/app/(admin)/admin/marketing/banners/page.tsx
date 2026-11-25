import type { Metadata } from "next";
import { MarketingDenied } from "@/components/admin/marketing/MarketingDenied";
import { MarketingNav } from "@/components/admin/marketing/MarketingNav";
import { SliderBoard } from "@/components/admin/marketing/SliderBoard";
import { catalogAccess } from "@/server/admin/access";
import { listSliders } from "@/server/admin/marketing";

export const metadata: Metadata = { title: "Hero slider" };

/**
 * The homepage hero slides. (This route used to also edit "banners", but no
 * placement of those is rendered on the storefront any more, so the editor
 * was removed rather than left as a control with no effect — see
 * docs/decisions/0040-admin-storefront-parity.md.)
 */
export default async function HeroSliderPage() {
  const session = await catalogAccess();
  if (!session) {
    return <MarketingDenied />;
  }
  const sliders = await listSliders();
  return (
    <div className="space-y-4">
      <MarketingNav />
      <SliderBoard sliders={sliders} />
    </div>
  );
}

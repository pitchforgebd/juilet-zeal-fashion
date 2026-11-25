import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { formatTaka } from "@/lib/utils/currency";
import { Container } from "@/components/ui/Container";
import { LanguageToggle } from "@/components/store/layout/LanguageToggle";

export async function TopBar({
  freeFrom = siteConfig.freeShippingThreshold,
  color = "#0C0B0B",
}: {
  freeFrom?: number;
  color?: string;
}) {
  const t = await getTranslations("common");
  const links = await getTranslations("links");
  const nav = await getTranslations("nav");
  const quick = siteConfig.topBarLinks.filter((link) =>
    ["trackOrder", "help"].includes(link.id),
  );

  return (
    <div className="text-white" style={{ backgroundColor: color }}>
      <Container className="flex h-9 items-center justify-between gap-4 text-[13px]">
        <nav className="hidden items-center gap-4 lg:flex" aria-label={nav("quickLinks")}>
          {quick.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="whitespace-nowrap text-white/70 transition-colors duration-fast ease-standard hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {links(link.id)}
            </Link>
          ))}
        </nav>
        <p className="min-w-0 flex-1 truncate text-center text-white lg:flex-none">
          {t("freeDelivery", { amount: formatTaka(freeFrom) })}
        </p>
        <div className="flex items-center gap-3">
          <LanguageToggle />
        </div>
      </Container>
    </div>
  );
}

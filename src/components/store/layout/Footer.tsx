import type { ReactNode } from "react";
import { Clock, Mail, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { siteConfig, type SiteLink, type SocialName } from "@/config/site";
import { Container } from "@/components/ui/Container";
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from "@/components/store/layout/icons";
import { Logo } from "@/components/store/layout/Logo";
import { menuLinks } from "@/server/cms/public";

const socialIcons: Record<SocialName, ReactNode> = {
  Facebook: <FacebookIcon />,
  Instagram: <InstagramIcon />,
  YouTube: <YouTubeIcon />,
  WhatsApp: <WhatsAppIcon />,
};

const footerLink =
  "text-sm text-white/70 transition-colors duration-fast ease-standard hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const footerHeading = "text-sm font-medium text-white";

const contactIcon = "mt-0.5 size-4 shrink-0 text-white/50";

function FooterLinks({ title, links }: { title: string; links: SiteLink[] }) {
  return (
    <div>
      <h2 className={footerHeading}>{title}</h2>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.id}>
            <Link href={link.href} className={footerLink}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function Footer({
  name = siteConfig.name,
  description = siteConfig.description,
  logoUrl = "",
  phone = siteConfig.contact.phoneDisplay,
  email = siteConfig.contact.email,
  address = siteConfig.contact.address,
  hours = "",
  social = siteConfig.socialLinks,
}: {
  name?: string;
  description?: string;
  logoUrl?: string;
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
  social?: { label: SocialName; href: string }[];
}) {
  const year = new Date().getFullYear();
  const t = await getTranslations("footer");
  const links = await getTranslations("links");
  // Admin → Content → Menus ("footer-service" and "footer") drive these two
  // columns; without a menu they fall back to the built-in links. A link
  // whose label is still a built-in page's default English label is shown
  // translated (so the Bengali storefront isn't English); a label the admin
  // typed themselves is shown as typed.
  const builtIn = [...siteConfig.customerServiceLinks, ...siteConfig.usefulLinks];
  const translatedLabel = (link: { label: string; href: string }) => {
    const match = builtIn.find(
      (item) =>
        item.href === link.href &&
        item.label.trim().toLowerCase() === link.label.trim().toLowerCase(),
    );
    return match ? links(match.id) : link.label;
  };
  const column = (menu: { label: string; href: string }[], fallback: SiteLink[]) =>
    (menu.length > 0 ? menu : fallback).map((link, index) => ({
      id: `${index}-${link.href}`,
      href: link.href,
      label: translatedLabel(link),
    }));
  const [serviceMenu, usefulMenu] = await Promise.all([
    menuLinks("footer-service"),
    menuLinks("footer"),
  ]);
  const customerLinks = column(serviceMenu, siteConfig.customerServiceLinks);
  const useful = column(usefulMenu, siteConfig.usefulLinks);
  const checkout = await getTranslations("checkout");
  const payments = [checkout("paymentCod"), ...siteConfig.paymentMethods];

  return (
    <footer className="mt-auto">
      <div className="bg-[#151213] text-white">
        <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:py-20">
          <div>
            <Logo name={name} logoUrl={logoUrl} tone="light" />
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/70">{description}</p>
            <ul className="mt-6 flex gap-2">
              {social.map((link) => {
                const className =
                  "grid size-10 place-items-center rounded-[10px] border border-white/10 text-white/70 transition-colors duration-fast ease-standard hover:border-white/25 hover:text-white";
                return (
                  <li key={link.label}>
                    {link.href && link.href !== "#" ? (
                      <a href={link.href} className={className} title={link.label}>
                        {socialIcons[link.label]}
                        <span className="sr-only">{link.label}</span>
                      </a>
                    ) : (
                      <span className={className} title={link.label}>
                        {socialIcons[link.label]}
                        <span className="sr-only">{link.label}</span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <FooterLinks title={t("customerService")} links={customerLinks} />
          <FooterLinks title={t("usefulLinks")} links={useful} />

          <div>
            <h2 className={footerHeading}>{t("contact")}</h2>
            <a
              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
              className="mt-4 block font-heading text-2xl text-white tabular-nums transition-colors duration-fast ease-standard hover:text-white/80"
            >
              {phone}
            </a>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin aria-hidden="true" strokeWidth={1.5} className={contactIcon} />
                {address}
              </li>
              {hours ? (
                <li className="flex items-start gap-2">
                  <Clock aria-hidden="true" strokeWidth={1.5} className={contactIcon} />
                  {hours}
                </li>
              ) : null}
              <li>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-start gap-2 transition-colors duration-fast ease-standard hover:text-white"
                >
                  <Mail aria-hidden="true" strokeWidth={1.5} className={contactIcon} />
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </Container>

        <Container className="flex flex-col gap-2 border-t border-white/8 py-6 text-[13px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {name}. {t("rights")}
          </span>
          <span>
            {t("accept")}: {payments.join(" · ")}
          </span>
        </Container>
      </div>
    </footer>
  );
}

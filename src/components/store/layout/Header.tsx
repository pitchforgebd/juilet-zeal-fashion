import { User } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { CartButton } from "@/components/store/layout/CartButton";
import { CategoryNav } from "@/components/store/layout/CategoryNav";
import { Logo } from "@/components/store/layout/Logo";
import { MobileMenu } from "@/components/store/layout/MobileMenu";
import { SearchBar } from "@/components/store/layout/SearchBar";
import type { CategoryNode } from "@/lib/catalog/categoryTree";

export async function Header({
  name,
  logoUrl,
  tree = [],
}: {
  name?: string;
  logoUrl?: string;
  tree?: CategoryNode[];
}) {
  const nav = await getTranslations("nav");
  const home = await getTranslations("home");

  return (
    <header className="sticky top-0 z-40 border-b border-ink/8 bg-card">
      <Container className="py-3">
        <div className="flex items-center gap-3 lg:grid lg:grid-cols-[auto_1fr_auto] lg:gap-12">
          <div className="flex items-center gap-2">
            <MobileMenu tree={tree} />
            <Logo name={name} logoUrl={logoUrl} />
          </div>
          <div className="hidden w-full max-w-xl justify-self-center md:block">
            <SearchBar id="site-search-desktop" />
          </div>
          <div className="ms-auto flex items-center gap-1 lg:ms-0">
            <Link
              href="/account"
              className="hidden h-10 items-center gap-2 rounded-[10px] px-2 text-ink transition-colors duration-fast ease-standard hover:bg-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:inline-flex"
            >
              <User aria-hidden="true" strokeWidth={1.5} className="size-[18px]" />
              <span className="hidden text-sm xl:inline">{nav("myAccount")}</span>
            </Link>
            <CartButton />
          </div>
        </div>
        <div className="mt-3 md:hidden">
          <SearchBar id="site-search-mobile" />
        </div>
      </Container>
      <CategoryNav
        tree={tree}
        label={nav("categories")}
        newInLabel={nav("newIn")}
        allLabel={nav("viewAll")}
        offersLabel={home("offersLabel")}
      />
    </header>
  );
}

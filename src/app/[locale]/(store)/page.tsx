import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/store/common/SectionHeading";
import { CategoryRibbon } from "@/components/store/home/CategoryRibbon";
import { CategoryShowcase } from "@/components/store/home/CategoryShowcase";
import { EditTabs } from "@/components/store/home/EditTabs";
import { FlashBanner } from "@/components/store/home/FlashBanner";
import { HeroSlider } from "@/components/store/home/HeroSlider";
import { TestimonialCarousel } from "@/components/store/home/TestimonialCarousel";
import { TrustStrip } from "@/components/store/home/TrustStrip";
import { ProductGrid } from "@/components/store/product/ProductCard";
import { TrackedList } from "@/components/store/tracking/TrackedList";
import { leafCategories } from "@/lib/catalog/categoryTree";
import { isHomeSectionKey, type HomeSectionKey } from "@/lib/content/homeSections";
import { prisma } from "@/lib/db";
import { localeAlternates } from "@/lib/seo/alternates";
import { absoluteUrl } from "@/lib/seo/urls";
import { listHomeSections, publishedTestimonials } from "@/server/admin/content";
import { publicBanners } from "@/server/cms/public";
import { listStoreCategories, listStoreProducts } from "@/server/catalog/products";

// If Next can statically render this page, this bounds how stale featured
// products, banners, and flash-sale state can get (the page may still
// render dynamically on every request instead — see the build output).
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      canonical: absoluteUrl("/"),
      languages: localeAlternates("/"),
    },
  };
}

// Landing rhythm: every block carries half the section gap above and below,
// so any two neighbours sit 80px apart on phones and 96px from `sm` up —
// whatever order the admin puts them in.
const block = "py-10 sm:py-12";

/**
 * The landing page, after the Noora concept: hero, trust box, categories,
 * tabbed signature edit, flash sale, collection showcases, testimonials.
 * Admin → Content → Homepage sets their order and which ones show
 * (`listHomeSections`, src/lib/content/homeSections.ts).
 */
export default async function HomePage() {
  const t = await getTranslations("home");
  const [sections, quotes, { slides }, categories, products, topCategories, nextFlash] =
    await Promise.all([
      listHomeSections(),
      publishedTestimonials(),
      publicBanners(),
      listStoreCategories(),
      listStoreProducts(),
      prisma.category.findMany({
        where: { isActive: true, parentId: null },
        orderBy: { sortOrder: "asc" },
        select: { slug: true, name: true, description: true, imageUrl: true },
      }),
      prisma.flashSale.findFirst({
        where: {
          isActive: true,
          startsAt: { lte: new Date() },
          endsAt: { gte: new Date() },
        },
        orderBy: { endsAt: "asc" },
        select: { endsAt: true },
      }),
    ]);

  const childrenOf = (slug: string) =>
    new Set([
      slug,
      ...categories
        .filter((category) => category.parentSlug === slug)
        .map((category) => category.slug),
    ]);
  const newest = [...products]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 8);
  const best = products.filter((product) => product.bestSeller).slice(0, 8);
  const onSale = products
    .filter((product) => product.variants.some((variant) => variant.salePrice !== null))
    .slice(0, 8);
  // Two showcase rows, for the first top-level categories that can fill a
  // banner + three-product row — a half-empty showcase looks broken.
  const showcases = topCategories
    .map((category) => {
      const slugs = childrenOf(category.slug);
      return {
        category,
        items: products.filter((product) => slugs.has(product.categorySlug)),
      };
    })
    .filter(({ items }) => items.length >= 3)
    .slice(0, 2);
  const editTabs = [
    // `list` is the stable GA4 item_list_name — English on purpose, so the
    // Bengali storefront doesn't split reports into two lists.
    { id: "new", list: "Home: New Arrivals", label: t("tabNew"), items: newest },
    { id: "best", list: "Home: Best Sellers", label: t("tabBest"), items: best },
    { id: "sale", list: "Home: On Sale", label: t("tabSale"), items: onSale },
  ].filter((tab) => tab.items.length > 0);

  const blocks: Record<HomeSectionKey, ReactNode> = {
    // No Reveal on the hero: it's the LCP element and must paint at full
    // opacity straight from the server.
    hero: (
      <HeroSlider
        slides={slides.map((slide) => ({
          id: slide.id,
          title: slide.title,
          subtitle: slide.subtitle,
          href: slide.href,
          imageUrl: slide.imageUrl,
          imageHue: slide.imageHue,
        }))}
      />
    ),
    trust: <TrustStrip />,
    categories: (
      <Container className={block}>
        <Reveal>
          <SectionHeading title={t("categoriesTitle")} />
          <CategoryRibbon categories={leafCategories(categories)} />
        </Reveal>
      </Container>
    ),
    featured:
      editTabs.length > 0 ? (
        <Container className={block}>
          <EditTabs
            title={t("featuredTitle")}
            tabs={editTabs.map((tab) => ({
              id: tab.id,
              label: tab.label,
              content: (
                <TrackedList listName={tab.list} products={tab.items}>
                  <ProductGrid products={tab.items} />
                </TrackedList>
              ),
            }))}
          />
        </Container>
      ) : null,
    flash: nextFlash ? (
      <Container className={block}>
        <Reveal>
          <FlashBanner endsAt={nextFlash.endsAt.toISOString()} />
        </Reveal>
      </Container>
    ) : null,
    offers:
      showcases.length > 0 ? (
        <Container className={`${block} space-y-20 sm:space-y-24`}>
          {showcases.map(({ category, items }, index) => (
            <CategoryShowcase
              key={category.slug}
              slug={category.slug}
              name={category.name}
              description={category.description}
              imageUrl={category.imageUrl}
              products={items}
              reverse={index % 2 === 1}
            />
          ))}
        </Container>
      ) : null,
    testimonials:
      quotes.length > 0 ? (
        <section className="my-10 border-y border-ink/8 bg-card sm:my-12">
          <Container className="py-16 sm:py-20">
            <Reveal>
              <SectionHeading title={t("testimonialsTitle")} />
              <TestimonialCarousel items={quotes} />
            </Reveal>
          </Container>
        </section>
      ) : null,
  };
  const shown = sections.flatMap((row) =>
    row.enabled && isHomeSectionKey(row.key) && blocks[row.key] ? [row.key] : [],
  );

  return (
    <>
      {shown.map((key, index) =>
        key === "trust" ? (
          // Noora's trust box overlaps the bottom of the hero — only when
          // the hero is directly above it; anywhere else it's a normal block.
          <Container
            key={key}
            className={
              shown[index - 1] === "hero" ? "relative z-10 -mt-10 pb-10 sm:pb-12" : block
            }
          >
            {blocks.trust}
          </Container>
        ) : (
          <Fragment key={key}>{blocks[key]}</Fragment>
        ),
      )}
    </>
  );
}

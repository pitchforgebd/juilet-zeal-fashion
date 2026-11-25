"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { revealVariants, usePrefersReducedMotion } from "@/components/motion";
import { ctaArrow, ctaPrimary, ctaSecondary } from "@/components/store/home/cta";
import { cn } from "@/lib/utils/cn";

export type HeroSlide = {
  id: string;
  title: string;
  subtitle: string | null;
  href: string;
  imageUrl: string | null;
  imageHue: number | null;
};

const arrowButton =
  "grid size-10 place-items-center rounded-[10px] border border-white/20 text-white/80 transition-colors duration-fast ease-standard hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/**
 * Full-bleed campaign slider: each slide's photo (Admin → Banners) fills
 * the hero behind the copy, and changing slide crossfades the photo and
 * swaps the text. A slide without a photo shows the plain warm-black
 * surface. The dark fade on the text side keeps white copy readable over
 * any photo.
 */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const t = useTranslations("home");
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  // The first slide paints fully visible straight from the server (it's the
  // LCP element — never SSR it at opacity 0); only slides shown after that
  // animate in.
  const [advanced, setAdvanced] = useState(false);
  // Autoplay pauses while the pointer is over the hero or focus is inside
  // it (§4.2), so nobody has the slide swapped out from under them.
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length <= 1 || paused) {
      return;
    }
    const timer = window.setInterval(() => {
      setAdvanced(true);
      setIndex((current) => (current + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [slides.length, paused]);

  if (slides.length === 0) {
    return null;
  }

  const current = Math.min(index, slides.length - 1);
  const slide = slides[current];
  const go = (next: number) => {
    setAdvanced(true);
    setIndex((next + slides.length) % slides.length);
  };

  return (
    <section
      aria-roledescription="carousel"
      className="relative isolate overflow-hidden bg-[#151213] text-white"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
    >
      {/* Every slide's photo stays mounted and stacked, so a slide change is
       * an opacity crossfade between already-loaded images. */}
      {slides.map((item, itemIndex) =>
        item.imageUrl ? (
          <div
            key={item.id}
            role="img"
            aria-label={item.title}
            aria-hidden={itemIndex !== current}
            className={cn(
              "absolute inset-0 -z-20 bg-cover bg-center transition-opacity duration-page ease-standard motion-reduce:transition-none",
              itemIndex === current ? "opacity-100" : "opacity-0",
            )}
            style={{ backgroundImage: `url(${item.imageUrl})` }}
          />
        ) : null,
      )}
      {slide.imageUrl ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-r from-black/70 via-black/35 to-black/10 rtl:bg-linear-to-l"
        />
      ) : null}

      <div className="mx-auto flex w-full max-w-container flex-col justify-center px-4 pt-20 pb-32 lg:min-h-[clamp(560px,74vh,720px)] lg:pt-24 lg:pb-36">
        <motion.div
          key={slide.id}
          variants={revealVariants("up", reduced)}
          initial={advanced ? "hidden" : false}
          animate="visible"
          className="max-w-2xl"
        >
          <p className="text-sm text-white/70">{t("heroEyebrow")}</p>
          <h2 className="mt-4 max-w-[18ch] font-heading text-[2.5rem] leading-[1.05] font-normal tracking-[-0.02em] text-balance sm:text-[3.5rem] lg:text-[4.25rem] lg:tracking-[-0.03em]">
            {slide.title}
          </h2>
          {slide.subtitle ? (
            <p className="mt-6 max-w-[34rem] text-lg leading-[1.6] text-white/80">
              {slide.subtitle}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={slide.href} className={ctaPrimary}>
              {t("shopNow")}
              <ArrowRight aria-hidden="true" strokeWidth={1.5} className={ctaArrow} />
            </Link>
            <Link href="/shop?sort=newest" className={ctaSecondary}>
              {t("heroSecondary")}
            </Link>
          </div>
        </motion.div>
      </div>

      {slides.length > 1 ? (
        <div className="absolute inset-x-0 bottom-16 mx-auto flex w-full max-w-container items-center gap-4 px-4 lg:bottom-20">
          <div className="flex gap-1">
            {slides.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                aria-label={t("showSlide", { number: itemIndex + 1 })}
                aria-pressed={itemIndex === current}
                onClick={() => go(itemIndex)}
                className="grid h-6 min-w-6 place-items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "block h-0.5 w-6 rounded-full transition-colors duration-base ease-standard",
                    itemIndex === current ? "bg-white" : "bg-white/30",
                  )}
                />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label={t("prevSlide")}
              onClick={() => go(current - 1)}
              className={arrowButton}
            >
              <ArrowLeft
                aria-hidden="true"
                strokeWidth={1.5}
                className="size-4 rtl:rotate-180"
              />
            </button>
            <button
              type="button"
              aria-label={t("nextSlide")}
              onClick={() => go(current + 1)}
              className={arrowButton}
            >
              <ArrowRight
                aria-hidden="true"
                strokeWidth={1.5}
                className="size-4 rtl:rotate-180"
              />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

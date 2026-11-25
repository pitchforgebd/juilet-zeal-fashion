/**
 * Homepage calls to action on the dark (ink) surfaces — hero, flash sale,
 * collection banners. Primary is an off-white from the warm ramp with ink
 * text; secondary is a hairline outline. Same 10px control radius as every
 * other button, no gradient, no glow; hover only changes the fill.
 */
export const ctaPrimary =
  "group inline-flex h-12 items-center gap-2 rounded-[10px] bg-[#F3EEEC] px-5 text-[15px] font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-colors duration-fast ease-standard hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export const ctaSecondary =
  "inline-flex h-12 items-center rounded-[10px] border border-white/20 px-5 text-[15px] font-medium text-white transition-colors duration-fast ease-standard hover:border-white/40 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/** The arrow inside a primary CTA: nudges 2px on hover, nothing more. */
export const ctaArrow =
  "size-4 transition-transform duration-fast ease-standard group-hover:translate-x-0.5 motion-reduce:transition-none rtl:rotate-180";

import type { Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Space-separated r/g/b custom properties (set per request from the
        // active theme preset — see src/lib/theme/styleTag.ts) so these
        // still support opacity modifiers like `bg-primary/10`. Never
        // hardcode a literal color for these names elsewhere — the whole
        // point of Phase 4's design system is that a preset switch (no
        // rebuild) re-skins everything that uses them.
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "primary-dark": "rgb(var(--color-primary-dark) / <alpha-value>)",
        peach: "rgb(var(--color-primary-light) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        page: "rgb(var(--color-page) / <alpha-value>)",
        card: "rgb(var(--color-card) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        // Juliet's Zeal's one accent: the Offers button and discount figures.
        // White on it is 5.9:1, and it reads at 5.5:1 as text on the page.
        mauve: "#9C4A5E",
        // Functional, not brand — intentionally not theme-preset-driven.
        success: "#1F7A0F",
        whatsapp: "#25D366",
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "10px",
        theme: "var(--radius-theme)",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0, 0, 0, 0.06)",
      },
      maxWidth: {
        container: "1320px",
      },
      fontFamily: {
        sans: ["var(--font-jost)", "var(--font-noto-bengali)", "sans-serif"],
        // Headings only. --font-heading is set per theme preset (see
        // src/app/[locale]/layout.tsx): Jost for Juliet, Poppins for most
        // other presets, Playfair Display for Luxe.
        heading: ["var(--font-heading)", "var(--font-noto-bengali)", "sans-serif"],
      },
      transitionDuration: {
        // Master plan §4.4's motion tokens — components/motion and any
        // plain CSS transition should use these instead of ad hoc values.
        fast: "120ms",
        base: "200ms",
        slow: "320ms",
        page: "450ms",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.2, 0, 0, 1)",
        emphasized: "cubic-bezier(0.3, 0, 0.1, 1)",
      },
      keyframes: {
        "toast-in": {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        bump: {
          "0%": { transform: "scale(1)" },
          "35%": { transform: "scale(1.35)" },
          "60%": { transform: "scale(0.92)" },
          "100%": { transform: "scale(1)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        // One slow light sweep across the Offers button (OfferPill.tsx) —
        // the only looping motion on the storefront, and motion-safe only.
        // It crosses in the first ~15% of the cycle, then rests.
        shine: {
          "0%": { transform: "translateX(0)" },
          "15%, 100%": { transform: "translateX(400%)" },
        },
      },
      animation: {
        "toast-in": "toast-in 0.25s ease-out",
        bump: "bump 0.4s ease-out",
        "pop-in": "pop-in 0.2s ease-out",
        shine: "shine 7s cubic-bezier(0.2, 0, 0, 1) infinite",
      },
    },
  },
} satisfies Config;

export default config;

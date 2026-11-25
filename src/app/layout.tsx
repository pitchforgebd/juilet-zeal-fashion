import type { ReactNode } from "react";

/**
 * Pass-through root layout. The real document shells (<html>/<body>) live in
 * src/app/[locale]/layout.tsx (storefront) and src/app/(admin)/layout.tsx.
 * Next.js still needs a layout at the very top so the top-level
 * not-found.tsx — rendered when no locale can be resolved — has one;
 * without it, compiling that page fails with "not-found.tsx doesn't have a
 * root layout". This is the same pattern next-intl's App Router guide uses.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}

# 0040 — Every admin control must change something on the storefront

## Context

After the Juliet's Zeal storefront redesign, several admin screens still
edited things the storefront no longer reads. Staff would change a setting,
save, and see nothing happen:

- Content → Homepage offered drag-to-reorder and 12 on/off switches (Blog,
  Videos, Instagram, Recent, Best sellers…) for a homepage with a fixed order
  and 7 blocks, plus a "featured category" picker nothing used.
- Marketing → Banners edited banner placements (`home`, `category`, `popup`,
  `exit`). Only `home` was ever rendered, as side banners, and those were
  removed in the redesign. The same page also hosts the hero-slider editor.
- Theme → Font offered "Poppins"; the brand face is Jost.
- Social → "Homepage Instagram post URLs" — the Instagram block is gone.
- Content → Menus saved menus only exposed via `/api/v1/menus`; the footer
  used hard-coded links.

## Decision

Make each control either work or disappear:

- **Homepage sections** — one list of rendered blocks
  (`src/lib/content/homeSections.ts`), used by both admin and the homepage.
  The homepage renders blocks in the saved order with the saved switches;
  stored rows for removed blocks are ignored; names always come from code.
  Each block carries half the section gap top and bottom so any order keeps
  the rhythm; the trust box only overlaps the hero when directly below it.
- **Banners** — the banner editor and its actions/server functions/schema
  were deleted. The route stays as "Hero slider" (it still edits slides). The
  `banner` table, seed data and public `/api/v1/banners` are untouched, so it
  can come back with a placement the storefront really renders.
- **Theme font** — the `poppins` value is kept (saved settings stay valid) but
  labelled "Jost (brand)".
- **Instagram posts** — field removed from the form; the stored value is
  still submitted unchanged.
- **Menus** — the footer's "Customer service" and "Useful links" columns read
  the `footer-service` and `footer` menus, falling back to the built-in links
  when a menu is empty. Links to built-in pages keep their translated label.
  The editor offers only those two locations (header and mobile menus are
  built from categories).

## Consequences

- No migration. Existing `homeSection` rows keep working; stale keys are
  simply skipped.
- Menu labels typed in admin are single-language; only links to the built-in
  pages are translated.

import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { OfferPill } from "@/components/store/layout/OfferPill";
import type { CategoryNode } from "@/lib/catalog/categoryTree";

const topLink =
  "flex h-12 items-center gap-1 px-3 text-[15px] text-ink transition-colors duration-fast ease-standard group-hover:text-mauve group-focus-within:text-mauve focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

// 12px panel radius − 8px padding = 4px row radius.
const menuRow =
  "flex h-9 items-center rounded-[4px] px-3 text-sm transition-colors duration-fast ease-standard hover:bg-page focus-visible:bg-page focus-visible:outline-none";

/**
 * Desktop category menu: top-level categories with a hover/focus dropdown
 * of their sub-categories (pure CSS — `group-hover` and
 * `group-focus-within` — so it works without JS and from the keyboard).
 */
export function CategoryNav({
  tree,
  label,
  newInLabel,
  allLabel,
  offersLabel,
}: {
  tree: CategoryNode[];
  label: string;
  newInLabel: string;
  allLabel: string;
  offersLabel: string;
}) {
  return (
    <nav aria-label={label} className="hidden border-t border-ink/8 lg:block">
      <Container className="flex items-center gap-4">
        <ul className="-ms-3 flex items-center gap-1">
          <li className="group relative">
            <Link href="/shop?sort=newest" className={topLink}>
              {newInLabel}
            </Link>
          </li>
          {tree.map((node) => (
            <li key={node.slug} className="group relative">
              <Link href={`/category/${node.slug}`} className={topLink}>
                {node.name}
                {node.children.length > 0 ? (
                  <ChevronDown
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="size-4 text-muted transition-transform duration-base ease-standard group-hover:rotate-180 group-focus-within:rotate-180 motion-reduce:transition-none"
                  />
                ) : null}
              </Link>
              {node.children.length > 0 ? (
                <div className="invisible absolute top-full left-0 z-20 min-w-56 translate-y-1 rounded-xl border border-ink/8 bg-card p-2 opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-[opacity,transform,visibility] duration-base ease-standard group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none">
                  <ul>
                    {node.children.map((child) => (
                      <li key={child.slug}>
                        <Link
                          href={`/category/${child.slug}`}
                          className={`${menuRow} text-ink`}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                    <li className="mt-2 border-t border-ink/8 pt-2">
                      <Link
                        href={`/category/${node.slug}`}
                        className={`${menuRow} text-muted hover:text-ink`}
                      >
                        {allLabel} {node.name}
                      </Link>
                    </li>
                  </ul>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
        <OfferPill label={offersLabel} className="ms-auto" />
      </Container>
    </nav>
  );
}

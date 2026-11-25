import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

type SectionHeadingProps = {
  title: string;
  href?: string;
  action?: string;
  /** Extra controls on the right (e.g. tabs), instead of the link. */
  aside?: ReactNode;
};

export function SectionHeading({ title, href, action, aside }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
      <h2 className="font-heading text-[1.75rem] leading-[1.15] font-normal tracking-[-0.01em] text-ink sm:text-4xl sm:tracking-[-0.02em]">
        {title}
      </h2>
      {aside ??
        (href && action ? (
          <Link
            href={href}
            className="group inline-flex shrink-0 items-center gap-2 text-[15px] font-medium text-ink transition-colors duration-fast ease-standard hover:text-mauve"
          >
            {action}
            <ArrowRight
              aria-hidden="true"
              strokeWidth={1.5}
              className="size-4 transition-transform duration-fast ease-standard group-hover:translate-x-0.5 motion-reduce:transition-none rtl:rotate-180"
            />
          </Link>
        ) : null)}
    </div>
  );
}

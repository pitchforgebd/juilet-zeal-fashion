import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

type LogoProps = {
  className?: string;
  name?: string;
  logoUrl?: string;
  /** Light wordmark for black surfaces (footer, drawers on ink). */
  tone?: "dark" | "light";
};

export function Logo({
  className,
  name = siteConfig.name,
  logoUrl = "",
  tone = "dark",
}: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={name}
      className={cn("inline-flex shrink-0 items-center gap-3", className)}
    >
      {logoUrl ? (
        <span
          aria-hidden="true"
          className="h-10 w-10 bg-cover bg-center"
          style={{ backgroundImage: `url("${logoUrl.replace(/"/g, "")}")` }}
        />
      ) : null}
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading text-lg font-medium tracking-[0.22em] uppercase sm:text-xl",
            tone === "light" ? "text-white" : "text-ink",
          )}
        >
          {name}
        </span>
        <span
          className={cn(
            "mt-1 text-[11px] tracking-[0.2em] uppercase",
            tone === "light" ? "text-white/60" : "text-muted",
          )}
        >
          Fashion House
        </span>
      </span>
    </Link>
  );
}

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";

/**
 * The "Offers" button in the header nav and mobile drawer. It stands out by
 * being the only rose-filled control in the chrome (white on #9C4A5E is
 * 5.9:1), plus one slow light pass every few seconds — the only looping
 * motion on the storefront, and only for motion-safe users.
 */
export function OfferPill({ label, className }: { label: string; className?: string }) {
  return (
    <Link
      href="/offers"
      className={cn(
        "relative isolate inline-flex h-9 items-center justify-center overflow-hidden rounded-[10px] bg-mauve px-4 text-sm font-medium text-white transition-colors duration-fast ease-standard hover:bg-[#86394C]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 -left-1/3 -z-10 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 motion-safe:animate-shine motion-safe:opacity-100"
      />
      {label}
    </Link>
  );
}

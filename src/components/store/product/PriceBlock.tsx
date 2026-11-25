import { formatTaka } from "@/lib/utils/currency";

type PriceBlockProps = {
  current: number;
  regular: number | null;
  /** Percent off, shown in the accent as the card's one highlighted figure. */
  discount?: number;
};

export function PriceBlock({ current, regular, discount = 0 }: PriceBlockProps) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-2 tabular-nums">
      <span className="text-base font-medium text-ink">{formatTaka(current)}</span>
      {regular ? (
        <span className="text-sm text-muted line-through">{formatTaka(regular)}</span>
      ) : null}
      {discount > 0 ? <span className="text-sm text-mauve">−{discount}%</span> : null}
    </p>
  );
}

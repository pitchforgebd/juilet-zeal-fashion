"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { Product } from "@/types/catalog";

type SearchBarProps = {
  id: string;
  initialQuery?: string;
};

export function SearchBar({ id, initialQuery = "" }: SearchBarProps) {
  const router = useRouter();
  const t = useTranslations("common");
  const [term, setTerm] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  useEffect(() => {
    const trimmed = term.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/v1/search?q=${encodeURIComponent(trimmed)}`, {
        signal: controller.signal,
      })
        .then((response) => (response.ok ? response.json() : null))
        .then((body: unknown) => {
          const record = typeof body === "object" && body !== null ? body : {};
          const data = "data" in record ? record.data : null;
          setSuggestions(Array.isArray(data) ? data : []);
        })
        .catch(() => undefined);
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [term]);

  return (
    <div className="relative">
      <form
        action="/search"
        method="get"
        role="search"
        className="flex w-full items-center overflow-hidden rounded-[10px] border border-ink/10 bg-page p-1 transition-colors duration-fast ease-standard focus-within:border-ink/30 focus-within:bg-card"
      >
        <label htmlFor={id} className="sr-only">
          {t("searchLabel")}
        </label>
        <input
          id={id}
          name="q"
          type="search"
          value={term}
          placeholder={t("searchPlaceholder")}
          autoComplete="off"
          enterKeyHint="search"
          onChange={(event) => {
            setTerm(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="h-9 w-full min-w-0 bg-transparent px-3 text-[15px] text-foreground outline-none placeholder:text-muted"
        />
        <button
          type="submit"
          className="h-9 shrink-0 rounded-[6px] bg-ink px-4 text-sm font-medium text-white transition-colors duration-fast ease-standard hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {t("searchButton")}
        </button>
      </form>
      {open && suggestions.length > 0 ? (
        <ul
          role="listbox"
          aria-label={t("suggestions")}
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-ink/8 bg-card p-2 shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
        >
          {suggestions.map((product) => (
            <li key={product.slug}>
              <button
                type="button"
                className="flex h-9 w-full items-center rounded-[4px] px-3 text-left text-sm transition-colors duration-fast ease-standard hover:bg-page"
                onClick={() => {
                  setOpen(false);
                  router.push(`/product/${product.slug}`);
                }}
              >
                {product.name}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

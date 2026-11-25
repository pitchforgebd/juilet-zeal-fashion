"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { SectionHeading } from "@/components/store/common/SectionHeading";
import { cn } from "@/lib/utils/cn";

export type EditTab = { id: string; label: string; content: ReactNode };

/**
 * The pill tab switcher for the homepage's "signature edit" (Noora's
 * New Arrivals / Best Sellers / On Sale). Panels are rendered on the
 * server and passed in; this only toggles which one is mounted. Arrow keys move
 * between tabs, per the WAI-ARIA tabs pattern.
 */
export function EditTabs({ tabs, title }: { tabs: EditTab[]; title: string }) {
  const baseId = useId();
  const [active, setActive] = useState(tabs[0]?.id ?? "");

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (delta === 0) {
      return;
    }
    event.preventDefault();
    const next = tabs[(index + delta + tabs.length) % tabs.length];
    if (next) {
      setActive(next.id);
      document.getElementById(`${baseId}-tab-${next.id}`)?.focus();
    }
  };

  const tabList = (
    <div
      role="tablist"
      className="inline-flex gap-1 rounded-[10px] border border-ink/8 bg-card p-1"
    >
      {tabs.map((tab, index) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            id={`${baseId}-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`${baseId}-panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => setActive(tab.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              "h-8 rounded-md px-3 text-sm transition-colors duration-fast ease-standard sm:px-4",
              selected ? "bg-ink text-white" : "text-muted hover:text-ink",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      <SectionHeading title={title} aside={tabList} />
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`${baseId}-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={tab.id !== active}
        >
          {/* Only the visible panel's list is mounted, so its tracking
           * (view_item_list) fires for what the shopper actually sees. */}
          {tab.id === active ? tab.content : null}
        </div>
      ))}
    </>
  );
}

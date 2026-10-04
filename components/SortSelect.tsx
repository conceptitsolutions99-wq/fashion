"use client";

import { usePathname, useRouter } from "next/navigation";

import { SORT_OPTIONS, type SortKey } from "@/lib/catalog";
import type { ShopParams } from "@/lib/shop-url";

export default function SortSelect({ current }: { current: ShopParams }) {
  const router = useRouter();
  const pathname = usePathname();
  const active = (current.sort ?? "featured") as SortKey;

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-xs tracking-wide text-ink-500 uppercase">
        Sort by
      </label>
      <select
        id="sort-select"
        value={active}
        onChange={(event) => {
          const value = event.target.value;
          const params = new URLSearchParams();
          for (const [k, v] of Object.entries(current)) {
            if (v) params.set(k, v);
          }
          if (value === "featured") params.delete("sort");
          else params.set("sort", value);
          const qs = params.toString();
          router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
        }}
        className="rounded-full border border-ink-200 bg-white px-4 py-2 pr-8 text-sm text-ink-800 outline-none transition hover:border-ink-950 focus:border-ink-950"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.key} value={opt.key}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

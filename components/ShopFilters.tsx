"use client";

import Link from "next/link";
import { useState } from "react";

import { buildShopHref, type ShopParams } from "@/lib/shop-url";

export interface FilterOption {
  key: string;
  label: string;
  count: number;
}

interface Props {
  current: ShopParams;
  genderOptions: FilterOption[];
  categoryOptions: FilterOption[];
  sizeOptions: FilterOption[];
  priceOptions: FilterOption[];
  activeCount: number;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-ink-100 py-5 first:pt-0">
      <h3 className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-ink-950 uppercase">
        {title}
      </h3>
      {children}
    </div>
  );
}

function FilterLink({
  href,
  active,
  label,
  count,
  variant = "list",
}: {
  href: string;
  active: boolean;
  label: string;
  count?: number;
  variant?: "list" | "chip";
}) {
  if (variant === "chip") {
    return (
      <Link
        href={href}
        aria-current={active ? "true" : undefined}
        className={`inline-flex h-9 min-w-9 items-center justify-center rounded-full border px-3 text-sm transition ${
          active
            ? "border-ink-950 bg-ink-950 text-white"
            : "border-ink-200 bg-white text-ink-700 hover:border-ink-950"
        }`}
      >
        {label}
      </Link>
    );
  }

  return (
    <li>
      <Link
        href={href}
        aria-current={active ? "true" : undefined}
        className={`flex items-center justify-between gap-2 py-1.5 text-sm transition ${
          active ? "font-semibold text-ink-950" : "text-ink-600 hover:text-ink-950"
        }`}
      >
        <span className="flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full transition ${
              active ? "bg-brand-600" : "bg-transparent"
            }`}
            aria-hidden="true"
          />
          {label}
        </span>
        {typeof count === "number" && (
          <span className={active ? "text-ink-400" : "text-ink-300"}>{count}</span>
        )}
      </Link>
    </li>
  );
}

export default function ShopFilters({
  current,
  genderOptions,
  categoryOptions,
  sizeOptions,
  priceOptions,
  activeCount,
}: Props) {
  const [open, setOpen] = useState(false);

  const body = (
    <div className="text-left">
      <div className="flex items-center justify-between pb-4">
        <span className="text-sm font-semibold text-ink-950">
          Filters{activeCount > 0 ? ` (${activeCount})` : ""}
        </span>
        <div className="flex items-center gap-3">
          {activeCount > 0 && (
            <Link href="/shop" className="text-xs text-brand-600 underline hover:text-brand-700">
              Clear all
            </Link>
          )}
          <button
            type="button"
            className="text-ink-500 hover:text-ink-950 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close filters"
          >
            ✕
          </button>
        </div>
      </div>

      <Section title="Shop">
        <ul>
          {genderOptions.map((opt) => (
            <FilterLink
              key={opt.key}
              href={buildShopHref(current, { gender: opt.key || undefined })}
              active={(current.gender ?? "") === opt.key}
              label={opt.label}
              count={opt.count}
            />
          ))}
        </ul>
      </Section>

      {categoryOptions.length > 0 && (
        <Section title="Category">
          <ul>
            <FilterLink
              href={buildShopHref(current, { category: undefined })}
              active={!current.category}
              label="All categories"
              count={categoryOptions.reduce((n, c) => n + c.count, 0)}
            />
            {categoryOptions.map((opt) => (
              <FilterLink
                key={opt.key}
                href={buildShopHref(current, { category: opt.key })}
                active={current.category === opt.key}
                label={opt.label}
                count={opt.count}
              />
            ))}
          </ul>
        </Section>
      )}

      {sizeOptions.length > 0 && (
        <Section title="Size">
          <div className="flex flex-wrap gap-2">
            <FilterLink
              href={buildShopHref(current, { size: undefined })}
              active={!current.size}
              label="All"
              variant="chip"
            />
            {sizeOptions.map((opt) => (
              <FilterLink
                key={opt.key}
                href={buildShopHref(current, { size: opt.key })}
                active={current.size === opt.key}
                label={opt.label}
                variant="chip"
              />
            ))}
          </div>
        </Section>
      )}

      <Section title="Price">
        <ul>
          <FilterLink
            href={buildShopHref(current, { price: undefined })}
            active={!current.price}
            label="All prices"
          />
          {priceOptions.map((opt) => (
            <FilterLink
              key={opt.key}
              href={buildShopHref(current, { price: opt.key })}
              active={current.price === opt.key}
              label={opt.label}
            />
          ))}
        </ul>
      </Section>
    </div>
  );

  return (
    <>
      {/* mobile trigger */}
      <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-800 transition hover:border-ink-950"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
            <path
              d="M4 7h16M7 12h10M10 17h4"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
          Filters {activeCount > 0 && `(${activeCount})`}
        </button>
        {activeCount > 0 && (
          <Link href="/shop" className="text-xs text-brand-600 underline">
            Clear all
          </Link>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[86%] max-w-sm overflow-y-auto bg-white p-5 shadow-2xl">
            {body}
          </div>
        </div>
      )}

      <aside className="hidden w-60 shrink-0 lg:block">
        <div className="sticky top-36">{body}</div>
      </aside>
    </>
  );
}

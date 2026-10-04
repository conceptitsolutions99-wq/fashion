"use client";

import Link from "next/link";
import { useState } from "react";

import QuantityStepper from "@/components/QuantityStepper";
import { useCart } from "@/components/CartProvider";
import { MAX_QTY_PER_LINE } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ProductPurchase({ product }: { product: Product }) {
  const { add } = useCart();
  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : "");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    if (!size) {
      setError("Please choose a size");
      return;
    }
    setError(null);
    add({ product, size, color, qty });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* colour */}
      <div>
        <p className="mb-2.5 text-[11px] font-semibold tracking-[0.18em] text-ink-950 uppercase">
          Colour: <span className="font-normal text-ink-500">{color}</span>
        </p>
        <div className="flex flex-wrap gap-2.5">
          {product.colors.map((c) => {
            const active = c.name === color;
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(c.name)}
                aria-pressed={active}
                aria-label={`Colour ${c.name}`}
                title={c.name}
                className={`h-9 w-9 rounded-full border-2 transition ${
                  active
                    ? "border-ink-950 ring-2 ring-ink-950/15 ring-offset-2"
                    : "border-ink-200 hover:border-ink-400"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            );
          })}
        </div>
      </div>

      {/* size */}
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-950 uppercase">
            Size {!size && <span className="font-normal text-brand-600">— select required</span>}
          </p>
          <Link
            href="/info/size-guide"
            className="text-xs text-ink-500 underline underline-offset-4 transition hover:text-ink-950"
          >
            Size guide
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => {
            const active = s === size;
            return (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSize(s);
                  setError(null);
                }}
                aria-pressed={active}
                className={`h-11 min-w-12 rounded-full border px-3.5 text-sm transition ${
                  active
                    ? "border-ink-950 bg-ink-950 text-white"
                    : "border-ink-200 bg-white text-ink-800 hover:border-ink-950"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
        {error && (
          <p className="mt-2.5 text-sm text-brand-600" role="alert">
            {error}
          </p>
        )}
      </div>

      {/* qty + add */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <QuantityStepper value={qty} onChange={setQty} max={MAX_QTY_PER_LINE} />
        <button
          type="button"
          onClick={handleAdd}
          className={`h-12 flex-1 rounded-full px-8 text-sm font-semibold tracking-[0.16em] uppercase transition ${
            justAdded
              ? "bg-emerald-600 text-white"
              : "bg-ink-950 text-white hover:bg-brand-600"
          }`}
        >
          {justAdded ? "Added to bag ✓" : `Add to bag — ${formatPrice(product.price * qty)}`}
        </button>
      </div>

      <button
        type="button"
        className="h-12 rounded-full border border-ink-950 px-8 text-sm font-semibold tracking-[0.16em] text-ink-950 uppercase transition hover:bg-ink-950 hover:text-white"
        onClick={() => {
          if (!size) {
            setError("Please choose a size");
            return;
          }
          add({ product, size, color, qty });
          window.location.href = "/checkout";
        }}
      >
        Buy it now
      </button>

      {/* reassurance */}
      <ul className="grid gap-3 border-t border-ink-100 pt-5 text-sm text-ink-600 sm:grid-cols-2">
        {[
          ["Free shipping", "on orders over $100"],
          ["Free returns", "within 30 days"],
          ["Secure checkout", "encrypted payment"],
          ["In stock", "ships within 24h"],
        ].map(([title, sub]) => (
          <li key={title} className="flex items-start gap-2.5">
            <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600">
              <path
                d="m5 12.5 4.2 4.2L19 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>
              <span className="font-medium text-ink-900">{title}</span>{" "}
              <span className="text-ink-500">— {sub}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

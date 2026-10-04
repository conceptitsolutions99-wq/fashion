"use client";

import Image from "next/image";
import Link from "next/link";

import ProductGrid from "@/components/ProductGrid";
import QuantityStepper from "@/components/QuantityStepper";
import { useCart } from "@/components/CartProvider";
import { FREE_SHIPPING_THRESHOLD, MAX_QTY_PER_LINE, lineKey } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function CartView({ suggestions }: { suggestions: Product[] }) {
  const { summary, hydrated, setQty, remove } = useCart();

  if (!hydrated) {
    return (
      <div className="container-page py-24 text-center text-sm text-ink-500">
        Loading your bag…
      </div>
    );
  }

  if (summary.lines.length === 0) {
    return (
      <div className="container-page">
        <div className="mx-auto max-w-xl rounded-3xl border border-ink-100 bg-ink-50 px-6 py-20 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white text-2xl">
            🛍️
          </span>
          <h1 className="mt-6 font-display text-3xl font-semibold text-ink-950">
            Your bag is empty
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm text-ink-500">
            Nothing here yet — but the new season drop is waiting. Let&rsquo;s fix that.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/shop?sort=newest"
              className="rounded-full bg-ink-950 px-7 py-3.5 text-xs font-semibold tracking-[0.16em] text-white uppercase transition hover:bg-brand-600"
            >
              Shop new in
            </Link>
            <Link
              href="/shop"
              className="rounded-full border border-ink-950 px-7 py-3.5 text-xs font-semibold tracking-[0.16em] text-ink-950 uppercase transition hover:bg-ink-950 hover:text-white"
            >
              Browse all
            </Link>
          </div>
        </div>

        {suggestions.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-6 font-display text-2xl font-semibold text-ink-950 md:text-3xl">
              Popular right now
            </h2>
            <ProductGrid products={suggestions} />
          </section>
        )}
      </div>
    );
  }

  const progress = Math.min(
    100,
    Math.round((summary.subtotal / FREE_SHIPPING_THRESHOLD) * 100),
  );

  return (
    <div className="container-page py-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.24em] text-brand-600 uppercase">
            Step 1 of 3
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink-950 md:text-5xl">
            Your bag
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            {summary.itemCount} {summary.itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        <Link
          href="/shop"
          className="text-sm font-medium text-ink-700 underline underline-offset-4 transition hover:text-brand-600"
        >
          Continue shopping
        </Link>
      </div>

      {/* free shipping progress */}
      <div className="mb-8 rounded-2xl border border-ink-100 bg-ink-50 px-5 py-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-700">
            {summary.freeShippingUnlocked ? (
              <span className="font-medium text-emerald-700">
                🎉 You&rsquo;ve unlocked free shipping
              </span>
            ) : (
              <>
                Add{" "}
                <strong className="font-semibold text-ink-950">
                  {formatPrice(summary.amountUntilFreeShipping)}
                </strong>{" "}
                more for free shipping
              </>
            )}
          </span>
          <span className="hidden text-xs text-ink-400 sm:block">
            {formatPrice(summary.subtotal)} / {formatPrice(FREE_SHIPPING_THRESHOLD)}
          </span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              summary.freeShippingUnlocked ? "bg-emerald-500" : "bg-brand-600"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        {/* line items */}
        <ul className="divide-y divide-ink-100 border-y border-ink-100">
          {summary.lines.map((line) => {
            const key = lineKey(line.productId, line.size, line.color);
            return (
              <li key={key} className="flex gap-4 py-6 sm:gap-6">
                <Link
                  href={`/product/${line.product.slug}`}
                  className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-xl bg-ink-100 sm:w-32"
                >
                  <Image
                    src={line.product.image}
                    alt={line.product.imageAlt}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/product/${line.product.slug}`}
                        className="text-[15px] font-medium text-ink-950 transition hover:text-brand-700"
                      >
                        {line.product.name}
                      </Link>
                      <p className="mt-1 text-xs text-ink-500">
                        Size {line.size} · Colour {line.color}
                      </p>
                      <p className="text-xs text-ink-400">
                        {formatPrice(line.product.price)} each
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[15px] font-semibold text-ink-950">
                        {formatPrice(line.lineTotal)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <QuantityStepper
                      size="sm"
                      value={line.qty}
                      min={0}
                      max={MAX_QTY_PER_LINE}
                      onChange={(next) => setQty(key, next)}
                      label={`Quantity for ${line.product.name}`}
                    />
                    <button
                      type="button"
                      onClick={() => remove(key)}
                      className="text-xs text-ink-500 underline underline-offset-4 transition hover:text-brand-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* summary */}
        <aside className="lg:sticky lg:top-36 lg:self-start">
          <div className="rounded-3xl border border-ink-100 bg-ink-50 p-6">
            <h2 className="text-[11px] font-semibold tracking-[0.18em] text-ink-950 uppercase">
              Order summary
            </h2>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-ink-600">Subtotal</dt>
                <dd className="font-medium text-ink-950">{formatPrice(summary.subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-ink-600">Shipping</dt>
                <dd className="font-medium text-ink-950">
                  {summary.freeShippingUnlocked ? "Free" : formatPrice(summary.shipping)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-ink-600">Estimated tax (8%)</dt>
                <dd className="font-medium text-ink-950">{formatPrice(summary.tax)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-ink-200 pt-4 text-base">
                <dt className="font-semibold text-ink-950">Total</dt>
                <dd className="font-semibold text-ink-950">{formatPrice(summary.total)}</dd>
              </div>
            </dl>

            <Link
              href="/checkout"
              className="mt-6 block rounded-full bg-ink-950 px-6 py-4 text-center text-xs font-semibold tracking-[0.16em] text-white uppercase transition hover:bg-brand-600"
            >
              Checkout securely
            </Link>

            <p className="mt-3 text-center text-[11px] text-ink-400">
              Taxes included · Free returns within 30 days
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {["Visa", "Mastercard", "Amex", "PayPal"].map((c) => (
                <span
                  key={c}
                  className="rounded border border-ink-200 bg-white px-2 py-0.5 text-[10px] text-ink-500"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <ul className="mt-5 space-y-2.5 text-xs text-ink-500">
            <li className="flex gap-2">
              <span className="text-brand-600">✓</span> Items reserved for 30 minutes
            </li>
            <li className="flex gap-2">
              <span className="text-brand-600">✓</span> Promo codes apply at checkout
            </li>
            <li className="flex gap-2">
              <span className="text-brand-600">✓</span> Your bag is saved on this device
            </li>
          </ul>
        </aside>
      </div>

      {suggestions.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-display text-2xl font-semibold text-ink-950 md:text-3xl">
            Complete the look
          </h2>
          <ProductGrid products={suggestions} />
        </section>
      )}
    </div>
  );
}

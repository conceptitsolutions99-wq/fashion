"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { formatPrice } from "@/lib/format";
import { loadOrder, type Order } from "@/lib/orders";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function etaDate(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export default function OrderConfirmation() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setOrder(loadOrder());
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="container-page py-24 text-center text-sm text-ink-500">
        Loading your order…
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-lg rounded-3xl border border-ink-100 bg-ink-50 px-6 py-20 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white text-2xl">
            🔎
          </span>
          <h1 className="mt-6 font-display text-3xl font-semibold text-ink-950">
            No recent order found
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm text-ink-500">
            Orders are stored on the device where they were placed. If you just checked out on
            another device, look out for the confirmation email instead.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/shop"
              className="rounded-full bg-ink-950 px-7 py-3.5 text-xs font-semibold tracking-[0.16em] text-white uppercase transition hover:bg-brand-600"
            >
              Continue shopping
            </Link>
            <Link
              href="/info/contact"
              className="rounded-full border border-ink-950 px-7 py-3.5 text-xs font-semibold tracking-[0.16em] text-ink-950 uppercase transition hover:bg-ink-950 hover:text-white"
            >
              Contact support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { shipping, totals, items } = order;
  const express = order.delivery === "express";

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-3xl text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-600 text-2xl text-white">
          ✓
        </span>
        <p className="mt-6 text-[11px] font-semibold tracking-[0.24em] text-brand-600 uppercase">
          Order confirmed
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink-950 md:text-5xl">
          Thank you, {shipping.firstName}!
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-ink-600">
          Your order <strong className="font-semibold text-ink-950">{order.id}</strong> is in.
          A confirmation has been sent to{" "}
          <strong className="font-semibold text-ink-950">{order.email}</strong> — check your
          spam folder if it hasn&rsquo;t landed within a few minutes.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          {
            label: "Order number",
            value: order.id,
            sub: `Placed ${formatDate(order.placedAt)}`,
          },
          {
            label: "Estimated delivery",
            value: express ? "1–2 business days" : "3–5 business days",
            sub: `Arriving by ${etaDate(order.placedAt, express ? 2 : 5)}`,
          },
          {
            label: "Payment",
            value:
              order.payment.method === "card"
                ? `Card •••• ${order.payment.cardLast4}`
                : order.payment.method === "paypal"
                  ? "PayPal"
                  : "Cash on delivery",
            sub: `Total ${formatPrice(totals.total)}`,
          },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-ink-100 bg-ink-50 p-5">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-ink-400 uppercase">
              {card.label}
            </p>
            <p className="mt-2 text-lg font-semibold text-ink-950">{card.value}</p>
            <p className="mt-1 text-xs text-ink-500">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-3xl border border-ink-100 p-6">
          <h2 className="text-[11px] font-semibold tracking-[0.18em] text-ink-950 uppercase">
            Your items
          </h2>
          <ul className="mt-5 divide-y divide-ink-100">
            {items.map((item) => (
              <li
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex gap-4 py-4 first:pt-0 last:pb-0"
              >
                <Link
                  href={`/product/${item.slug}`}
                  className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-ink-100"
                >
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink-950">{item.name}</p>
                  <p className="mt-0.5 text-xs text-ink-500">
                    {item.size} · {item.color} · Qty {item.qty}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-medium text-ink-950">{formatPrice(item.lineTotal)}</p>
              </li>
            ))}
          </ul>

          <div className="mt-5 space-y-2 border-t border-ink-100 pt-5 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-600">Subtotal</span>
              <span className="font-medium text-ink-950">{formatPrice(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-600">
                Shipping ({express ? "express" : "standard"})
              </span>
              <span className="font-medium text-ink-950">
                {totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-600">Tax</span>
              <span className="font-medium text-ink-950">{formatPrice(totals.tax)}</span>
            </div>
            <div className="flex justify-between border-t border-ink-100 pt-3 text-base">
              <span className="font-semibold text-ink-950">Total</span>
              <span className="font-semibold text-ink-950">{formatPrice(totals.total)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-ink-100 bg-ink-50 p-6">
          <h2 className="text-[11px] font-semibold tracking-[0.18em] text-ink-950 uppercase">
            Shipping to
          </h2>
          <address className="mt-4 text-sm leading-relaxed text-ink-700 not-italic">
            {shipping.firstName} {shipping.lastName}
            <br />
            {shipping.address}
            {shipping.apartment && (
              <>
                <br />
                {shipping.apartment}
              </>
            )}
            <br />
            {shipping.city}, {shipping.region} {shipping.postalCode}
            <br />
            {shipping.country}
            {shipping.phone && (
              <>
                <br />
                {shipping.phone}
              </>
            )}
          </address>

          <div className="mt-6 rounded-xl bg-white p-4 text-xs text-ink-600">
            <p className="font-semibold text-ink-950">What happens next?</p>
            <ol className="mt-2 space-y-1.5">
              <li>1. We pick and pack your order within 24 hours.</li>
              <li>2. You&rsquo;ll get a tracking link by email.</li>
              <li>3. Delivery {express ? "in 1–2 days" : "in 3–5 days"}.</li>
            </ol>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/shop"
              className="rounded-full bg-ink-950 px-6 py-3.5 text-center text-xs font-semibold tracking-[0.16em] text-white uppercase transition hover:bg-brand-600"
            >
              Continue shopping
            </Link>
            <Link
              href="/info/shipping"
              className="rounded-full border border-ink-950 px-6 py-3.5 text-center text-xs font-semibold tracking-[0.16em] text-ink-950 uppercase transition hover:bg-ink-950 hover:text-white"
            >
              Track my order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

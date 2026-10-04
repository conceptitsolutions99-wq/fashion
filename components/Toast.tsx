"use client";

import Link from "next/link";

import { useCart } from "@/components/CartProvider";

export default function Toast() {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:bottom-6"
      role="status"
      aria-live="polite"
    >
      <div
        key={toast.id}
        className="yf-toast pointer-events-auto flex items-center gap-4 rounded-full border border-white/10 bg-ink-950/95 py-2.5 pl-5 pr-2.5 text-sm text-white shadow-xl backdrop-blur"
      >
        <span className="max-w-[50vw] truncate sm:max-w-md">{toast.message}</span>
        {toast.href && toast.label && (
          <Link
            href={toast.href}
            className="shrink-0 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase text-ink-950 transition hover:bg-brand-500 hover:text-white"
          >
            {toast.label}
          </Link>
        )}
      </div>
    </div>
  );
}

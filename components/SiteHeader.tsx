"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useCart } from "@/components/CartProvider";

const NAV = [
  { href: "/shop?sort=newest", label: "New In", match: "/shop" },
  { href: "/shop?gender=men", label: "Men", match: "/shop" },
  { href: "/shop?gender=women", label: "Women", match: "/shop" },
  { href: "/shop?sale=1", label: "Sale", match: "/shop" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { summary, hydrated } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const count = hydrated ? summary.itemCount : 0;

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-ink-950 text-center text-[11px] tracking-[0.18em] text-ink-100 uppercase">
        <div className="container-page py-2">
          Free shipping over $100 · 30-day returns · New season styles just landed
        </div>
      </div>

      <div className="border-b border-ink-100 bg-white/90 backdrop-blur-md">
        <div className="container-page relative flex h-16 items-center justify-between gap-4 md:h-20">
          {/* left: desktop nav / mobile menu button */}
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative text-[13px] font-medium tracking-[0.12em] text-ink-700 uppercase transition-colors hover:text-ink-950 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-ink-950 after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="-ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-900 transition hover:bg-ink-100 lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="relative block h-3.5 w-5">
              <span
                className={`absolute left-0 block h-px w-full bg-current transition-all duration-300 ${
                  menuOpen ? "top-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-px w-full bg-current transition-all duration-300 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-full bg-current transition-all duration-300 ${
                  menuOpen ? "top-1/2 -rotate-45" : "top-full"
                }`}
              />
            </span>
          </button>

          {/* center: wordmark */}
          <Link
            href="/"
            className="group flex items-baseline gap-1.5 whitespace-nowrap"
            aria-label="Your Fashionista — home"
          >
            <span className="font-display text-2xl leading-none font-semibold tracking-tight text-ink-950 md:text-[28px]">
              your
            </span>
            <span className="font-display text-2xl leading-none font-semibold tracking-tight text-brand-600 italic md:text-[28px]">
              fashionista
            </span>
          </Link>

          {/* right: actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-800 transition hover:bg-ink-100"
              aria-label="Search"
              aria-expanded={searchOpen}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <path
                  d="m21 21-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <Link
              href="/cart"
              className="relative inline-flex h-10 items-center gap-2 rounded-full px-3 text-ink-800 transition hover:bg-ink-100"
              aria-label={`Shopping bag, ${count} item${count === 1 ? "" : "s"}`}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M4.5 8h15l-1.2 11.2a2 2 0 0 1-2 1.8H7.7a2 2 0 0 1-2-1.8L4.5 8Zm3.4 0V6.7a4.1 4.1 0 0 1 8.2 0V8"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="hidden text-[13px] font-medium tracking-wide sm:inline">Bag</span>
              {count > 0 && (
                <span className="absolute -top-0.5 right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-semibold text-white">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* search drawer */}
        {searchOpen && (
          <div className="border-t border-ink-100 bg-white">
            <div className="container-page py-4">
              <form
                action="/shop"
                method="GET"
                className="flex items-center gap-3 rounded-full border border-ink-200 bg-ink-50 px-5 py-3 transition focus-within:border-ink-950 focus-within:bg-white"
                onSubmit={() => {
                  // let the native GET navigation happen; close the drawer after
                  setTimeout(() => setSearchOpen(false), 0);
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 text-ink-500" aria-hidden="true">
                  <path
                    d="m21 21-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  type="search"
                  name="q"
                  autoFocus
                  placeholder="Search dresses, denim, sneakers…"
                  className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400"
                  aria-label="Search products"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-ink-950 px-4 py-1.5 text-xs font-semibold tracking-wider text-white uppercase transition hover:bg-brand-600"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* mobile menu */}
      {menuOpen && (
        <div className="border-b border-ink-100 bg-white lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile">
            {[
              { href: "/", label: "Home" },
              ...NAV,
              { href: "/shop", label: "Shop All" },
              { href: "/cart", label: "Shopping Bag" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-medium text-ink-800 transition hover:bg-ink-50"
              >
                {item.label}
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-ink-400" aria-hidden="true">
                  <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
              className="mt-2 rounded-xl bg-ink-950 px-3 py-3 text-left text-[15px] font-medium text-white"
            >
              Search the store
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

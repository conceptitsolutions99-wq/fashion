import Link from "next/link";

import NewsletterForm from "@/components/NewsletterForm";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/shop?gender=women", label: "Women" },
      { href: "/shop?gender=men", label: "Men" },
      { href: "/shop?sort=newest", label: "New In" },
      { href: "/shop?sale=1", label: "Sale" },
      { href: "/shop", label: "All Products" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/info/shipping", label: "Shipping & Delivery" },
      { href: "/info/returns", label: "Returns & Exchanges" },
      { href: "/info/size-guide", label: "Size Guide" },
      { href: "/info/contact", label: "Contact Us" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/info/about", label: "About Us" },
      { href: "/info/stores", label: "Store Locator" },
      { href: "/info/careers", label: "Careers" },
      { href: "/info/sustainability", label: "Sustainability" },
    ],
  },
];

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "TikTok", href: "https://tiktok.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
];

export default function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink-950 text-ink-100">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Link href="/" className="flex items-baseline gap-1.5">
              <span className="font-display text-3xl font-semibold tracking-tight text-white">
                your
              </span>
              <span className="font-display text-3xl font-semibold tracking-tight text-brand-400 italic">
                fashionista
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-300">
              Considered clothing for men and women — quality fabrics, honest pricing and fits
              that work in real life. Designed in studio, shipped worldwide.
            </p>

            <div className="mt-8 max-w-md">
              <p className="text-xs font-semibold tracking-[0.18em] text-white uppercase">
                Get 10% off your first order
              </p>
              <p className="mt-2 mb-3 text-sm text-ink-400">
                New drops, restocks and members-only offers. No spam, unsubscribe anytime.
              </p>
              <NewsletterForm variant="dark" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-semibold tracking-[0.18em] text-white uppercase">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-ink-300 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay", "Klarna"].map((card) => (
              <span
                key={card}
                className="rounded-md border border-white/15 px-2.5 py-1 text-[11px] font-medium tracking-wide text-ink-300"
              >
                {card}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-5">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-[0.14em] text-ink-300 uppercase transition hover:text-white"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Your Fashionista. All rights reserved.</p>
          <p className="flex gap-4">
            <Link href="/info/returns" className="transition hover:text-white">
              Privacy
            </Link>
            <Link href="/info/shipping" className="transition hover:text-white">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

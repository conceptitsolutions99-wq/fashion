import Image from "next/image";
import Link from "next/link";

import ProductGrid from "@/components/ProductGrid";
import RatingStars from "@/components/RatingStars";
import { featuredProducts } from "@/lib/catalog";
import { PRODUCTS, categoryLabel } from "@/lib/products";

const VALUES = [
  ["Free shipping", "On every order over $100"],
  ["30-day returns", "Free exchanges, no fuss"],
  ["Secure checkout", "Encrypted card payments"],
  ["Real people", "Support 7 days a week"],
];

const TESTIMONIALS = [
  {
    quote:
      "The camel coat is the nicest thing in my wardrobe. The fit is exactly as described and it arrived in two days.",
    name: "Amelia R.",
    detail: "Verified buyer · Camel Wool-Blend Coat",
  },
  {
    quote:
      "I've reordered the Oxford shirt three times. Collar holds up after washing, which is more than I can say for others.",
    name: "Daniel K.",
    detail: "Verified buyer · Oxford Button-Down Shirt",
  },
  {
    quote:
      "Ordered three dresses for a holiday and returned one — refunded within 48 hours. Genuinely painless.",
    name: "Priya S.",
    detail: "Verified buyer · Scarlet Wrap Midi Dress",
  },
];

export default function HomePage() {
  const trending = featuredProducts(8);
  const newArrivals = PRODUCTS.filter((p) => p.isNew).slice(0, 4);
  const popularCategories = ["dresses", "denim", "knitwear", "outerwear", "tailoring", "shoes"];

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="container-page pt-6 md:pt-10">
        <div className="grid items-stretch gap-5 lg:grid-cols-2">
          <div className="flex flex-col justify-center rounded-3xl bg-ink-950 px-7 py-12 text-white sm:px-10 md:py-16 lg:px-14">
            <p className="text-[11px] font-semibold tracking-[0.28em] text-brand-400 uppercase">
              Autumn / Winter 2026
            </p>
            <h1 className="mt-5 font-display text-[42px] leading-[1.03] font-semibold tracking-tight sm:text-6xl">
              Dress like you
              <br />
              already <span className="text-brand-400 italic">do</span>.
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-300">
              Considered clothing for men and women — quality fabrics, honest pricing and fits
              that work in real life. New season pieces landing every week.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/shop?gender=women"
                className="rounded-full bg-white px-7 py-3.5 text-xs font-semibold tracking-[0.16em] text-ink-950 uppercase transition hover:bg-brand-500 hover:text-white"
              >
                Shop women
              </Link>
              <Link
                href="/shop?gender=men"
                className="rounded-full border border-white/30 px-7 py-3.5 text-xs font-semibold tracking-[0.16em] text-white uppercase transition hover:border-white hover:bg-white hover:text-ink-950"
              >
                Shop men
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-7">
              {[
                ["4.8/5", "12,400 reviews"],
                ["120+", "new styles"],
                ["30 days", "free returns"],
              ].map(([stat, label]) => (
                <div key={label}>
                  <dt className="font-display text-2xl font-semibold text-white">{stat}</dt>
                  <dd className="mt-1 text-[11px] tracking-wide text-ink-400 uppercase">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-3xl bg-ink-100 sm:min-h-[520px] lg:min-h-[620px]">
            <Image
              src="/editorial/hero-main.jpg"
              alt="Model wearing a red dress from the new season collection"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top"
            />
            <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
              <Link
                href="/product/meadow-floral-midi-dress"
                className="flex items-center gap-4 rounded-2xl bg-white/92 p-3 pr-5 shadow-lg backdrop-blur transition hover:bg-white"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-ink-100">
                  <Image
                    src="/products/w-dress-floral.jpg"
                    alt="Meadow Floral Midi Dress"
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold tracking-[0.18em] text-brand-600 uppercase">
                    Featured this week
                  </p>
                  <p className="truncate text-sm font-medium text-ink-950">
                    Meadow Floral Midi Dress
                  </p>
                </div>
                <span className="ml-auto shrink-0 text-sm font-semibold text-ink-950">$89</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- values */}
      <section className="mt-16 border-y border-ink-100 bg-ink-50">
        <div className="container-page grid gap-6 py-7 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(([title, detail]) => (
            <div key={title} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink-950 text-[11px] font-bold text-white">
                ✓
              </span>
              <div>
                <p className="text-sm font-semibold text-ink-950">{title}</p>
                <p className="text-xs text-ink-500">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- categories */}
      <section className="container-page mt-20">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.24em] text-brand-600 uppercase">
              Shop by category
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-950 md:text-4xl">
              Two rails. Endless outfits.
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden shrink-0 text-sm font-medium text-ink-700 underline underline-offset-4 transition hover:text-brand-600 sm:block"
          >
            Shop everything
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {[
            {
              href: "/shop?gender=women",
              title: "Women",
              copy: "Dresses, knitwear, denim & more",
              image: "/editorial/cat-women.jpg",
              alt: "Woman wearing a black hat and tailored outfit",
            },
            {
              href: "/shop?gender=men",
              title: "Men",
              copy: "Shirts, outerwear, tailoring & more",
              image: "/editorial/cat-men.jpg",
              alt: "Man in a tan jacket and blue jeans",
            },
          ].map((tile) => (
            <Link
              key={tile.title}
              href={tile.href}
              className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink-100 sm:aspect-[16/11]"
            >
              <Image
                src={tile.image}
                alt={tile.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/25 to-transparent" />
              <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4 text-white">
                <div>
                  <h3 className="font-display text-3xl font-semibold">{tile.title}</h3>
                  <p className="mt-1 text-sm text-ink-200">{tile.copy}</p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink-950 transition group-hover:bg-brand-500 group-hover:text-white">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2.5">
          {popularCategories.map((slug) => (
            <Link
              key={slug}
              href={`/shop?category=${slug}`}
              className="rounded-full border border-ink-200 px-4 py-2 text-sm text-ink-700 transition hover:border-ink-950 hover:bg-ink-950 hover:text-white"
            >
              {categoryLabel(slug)}
            </Link>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- trending */}
      <section className="container-page mt-24">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.24em] text-brand-600 uppercase">
              Trending now
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-950 md:text-4xl">
              The pieces everyone&rsquo;s adding
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden shrink-0 text-sm font-medium text-ink-700 underline underline-offset-4 transition hover:text-brand-600 sm:block"
          >
            View all
          </Link>
        </div>
        <ProductGrid products={trending} priorityCount={4} />
      </section>

      {/* ---------------------------------------------------------- story */}
      <section className="container-page mt-24">
        <div className="grid items-center gap-8 rounded-3xl bg-ink-50 p-6 md:grid-cols-2 md:p-10">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink-100">
            <Image
              src="/editorial/store.jpg"
              alt="Racks of clothing inside the Your Fashionista store"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="md:pl-6">
            <p className="text-[11px] font-semibold tracking-[0.24em] text-brand-600 uppercase">
              Our story
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-950 md:text-4xl">
              Built on better basics
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
              Your Fashionista started with one frustration: clothes that look great in the photo
              and fall apart by the third wash. We work with mills directly, test every fit on
              real bodies, and price everything without the markup theatre.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-ink-700">
              {[
                "Fabric-first design — natural fibres wherever possible",
                "Fit tested on 40+ body types before production",
                "Small batches, restocked based on what you actually buy",
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="text-brand-600">—</span>
                  {line}
                </li>
              ))}
            </ul>
            <Link
              href="/info/about"
              className="mt-8 inline-block rounded-full bg-ink-950 px-7 py-3.5 text-xs font-semibold tracking-[0.16em] text-white uppercase transition hover:bg-brand-600"
            >
              Read our story
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ new arrivals */}
      <section className="container-page mt-24">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.24em] text-brand-600 uppercase">
              Just landed
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-950 md:text-4xl">
              New this week
            </h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="hidden shrink-0 text-sm font-medium text-ink-700 underline underline-offset-4 transition hover:text-brand-600 sm:block"
          >
            All new in
          </Link>
        </div>
        <ProductGrid products={newArrivals} />
      </section>

      {/* ----------------------------------------------------- testimonials */}
      <section className="container-page mt-24">
        <div className="rounded-3xl bg-ink-950 px-6 py-12 text-white sm:px-10 md:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold tracking-[0.24em] text-brand-400 uppercase">
              Loved by 12,400 shoppers
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Don&rsquo;t take our word for it
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col justify-between gap-6 rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <RatingStars rating={5} className="text-brand-400" />
                <blockquote className="text-sm leading-relaxed text-ink-100">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="mt-0.5 text-xs text-ink-400">{t.detail}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

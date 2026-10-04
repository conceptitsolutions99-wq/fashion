import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import ProductGrid from "@/components/ProductGrid";
import ProductPurchase from "@/components/ProductPurchase";
import RatingStars from "@/components/RatingStars";
import { allProducts, getProduct, relatedProducts } from "@/lib/catalog";
import { categoryLabel } from "@/lib/products";
import { formatPrice } from "@/lib/format";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return allProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image, alt: product.imageAlt }],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = relatedProducts(product, 4);
  const onSale = typeof product.compareAtPrice === "number";
  const saveAmount = onSale
    ? (product.compareAtPrice as number) - product.price
    : 0;

  return (
    <div className="container-page pt-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-ink-400">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="transition hover:text-ink-900">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/shop?gender=${product.gender}`}
              className="transition hover:text-ink-900"
            >
              {product.gender === "men" ? "Men" : "Women"}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/shop?gender=${product.gender}&category=${product.category}`}
              className="transition hover:text-ink-900"
            >
              {categoryLabel(product.category)}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-ink-700">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        {/* gallery */}
        <div className="lg:sticky lg:top-36 lg:self-start">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-ink-100">
            <Image
              src={product.image}
              alt={product.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
            {product.isNew && (
              <span className="absolute top-4 left-4 rounded-full bg-white px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.16em] text-ink-950 uppercase shadow-sm">
                New in
              </span>
            )}
          </div>

          <div className="mt-4 hidden items-center gap-3 rounded-2xl bg-ink-50 px-5 py-4 text-xs text-ink-600 lg:flex">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-base">
              📦
            </span>
            <span>
              <strong className="font-semibold text-ink-900">Free shipping over $100.</strong>{" "}
              Order before 3pm for next-day dispatch.
            </span>
          </div>
        </div>

        {/* info */}
        <div>
          <p className="text-[11px] font-semibold tracking-[0.22em] text-brand-600 uppercase">
            {product.gender === "men" ? "Men" : "Women"} · {categoryLabel(product.category)}
          </p>

          <h1 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-ink-950 md:text-[42px]">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <RatingStars rating={product.rating} reviews={product.reviews} />
            <span className="text-xs text-ink-400">SKU {product.id.toUpperCase()}</span>
          </div>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span
              className={`text-3xl font-semibold ${onSale ? "text-brand-600" : "text-ink-950"}`}
            >
              {formatPrice(product.price)}
            </span>
            {onSale && (
              <>
                <span className="text-lg text-ink-400 line-through">
                  {formatPrice(product.compareAtPrice as number)}
                </span>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                  Save {formatPrice(saveAmount)}
                </span>
              </>
            )}
          </div>

          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-600">
            {product.description}
          </p>

          <div className="mt-8">
            <ProductPurchase product={product} />
          </div>

          {/* accordions */}
          <div className="mt-10 border-t border-ink-100">
            <details open className="group border-b border-ink-100 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold tracking-wide text-ink-950 uppercase">
                Product details
                <span className="text-ink-400 transition group-open:rotate-45">＋</span>
              </summary>
              <ul className="mt-4 space-y-2 text-sm text-ink-600">
                {product.details.map((d) => (
                  <li key={d} className="flex gap-3">
                    <span className="text-brand-600">—</span>
                    {d}
                  </li>
                ))}
              </ul>
            </details>

            <details className="group border-b border-ink-100 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold tracking-wide text-ink-950 uppercase">
                Delivery &amp; returns
                <span className="text-ink-400 transition group-open:rotate-45">＋</span>
              </summary>
              <div className="mt-4 space-y-2 text-sm text-ink-600">
                <p>Standard delivery 3–5 working days — free over $100, otherwise $9.95.</p>
                <p>Express delivery 1–2 working days — $19.95 at checkout.</p>
                <p>
                  Free returns within 30 days.{" "}
                  <Link href="/info/returns" className="text-ink-950 underline underline-offset-4">
                    Read the returns policy
                  </Link>
                  .
                </p>
              </div>
            </details>

            <details className="group border-b border-ink-100 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold tracking-wide text-ink-950 uppercase">
                Care &amp; fit
                <span className="text-ink-400 transition group-open:rotate-45">＋</span>
              </summary>
              <div className="mt-4 space-y-2 text-sm text-ink-600">
                <p>
                  Fit: true to size — take your usual size. Between sizes? Size up for a relaxed
                  fit.
                </p>
                <p>
                  Care: wash cold with like colours, line dry.{" "}
                  <Link href="/info/size-guide" className="text-ink-950 underline underline-offset-4">
                    See the size guide
                  </Link>
                  .
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="mt-24">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.24em] text-brand-600 uppercase">
                Style it with
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-950 md:text-4xl">
                You may also like
              </h2>
            </div>
            <Link
              href={`/shop?gender=${product.gender}`}
              className="hidden shrink-0 text-sm font-medium text-ink-700 underline underline-offset-4 transition hover:text-brand-600 sm:block"
            >
              Shop all {product.gender}
            </Link>
          </div>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}

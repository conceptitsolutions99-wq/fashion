import Image from "next/image";
import Link from "next/link";

import RatingStars from "@/components/RatingStars";
import { categoryLabel } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ProductCard({
  product,
  priority = false,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
}) {
  const onSale = typeof product.compareAtPrice === "number";
  const discount = onSale
    ? Math.round((1 - product.price / (product.compareAtPrice as number)) * 100)
    : 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col"
      aria-label={`${product.name}, ${formatPrice(product.price)}`}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-ink-100">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold tracking-[0.14em] text-ink-950 uppercase shadow-sm">
              New
            </span>
          )}
          {onSale && (
            <span className="rounded-full bg-brand-600 px-3 py-1 text-[10px] font-semibold tracking-[0.14em] text-white uppercase shadow-sm">
              −{discount}%
            </span>
          )}
        </div>

        <div className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-center rounded-full bg-white/95 px-4 py-2.5 text-xs font-semibold tracking-[0.14em] text-ink-950 uppercase opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          View product
        </div>
      </div>

      <div className="mt-3.5 flex flex-col gap-1">
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
          <h3 className="min-w-0 text-[15px] leading-snug font-medium text-ink-900 transition group-hover:text-brand-700">
            {product.name}
          </h3>
          <div className="flex shrink-0 flex-col items-end">
            <span
              className={`text-[15px] font-semibold ${onSale ? "text-brand-600" : "text-ink-950"}`}
            >
              {formatPrice(product.price)}
            </span>
            {onSale && (
              <span className="text-xs text-ink-400 line-through">
                {formatPrice(product.compareAtPrice as number)}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <p className="text-xs tracking-wide text-ink-400 uppercase">
            {categoryLabel(product.category)}
          </p>
          <span className="hidden sm:block">
            <RatingStars rating={product.rating} reviews={product.reviews} />
          </span>
        </div>

        <div className="mt-1.5 flex items-center gap-1.5" aria-hidden="true">
          {product.colors.slice(0, 4).map((c) => (
            <span
              key={c.name}
              className="h-3 w-3 rounded-full border border-ink-200"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
          <span className="text-[11px] text-ink-400">
            {product.colors.length} {product.colors.length === 1 ? "colour" : "colours"}
          </span>
        </div>
      </div>
    </Link>
  );
}

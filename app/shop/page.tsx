import type { Metadata } from "next";
import Link from "next/link";

import ProductGrid from "@/components/ProductGrid";
import ShopFilters from "@/components/ShopFilters";
import SortSelect from "@/components/SortSelect";
import {
  PRICE_BANDS,
  SIZE_OPTIONS,
  SORT_OPTIONS,
  categoriesFor,
  searchProducts,
  type SortKey,
} from "@/lib/catalog";
import { PRODUCTS, categoryLabel } from "@/lib/products";
import type { Gender } from "@/lib/types";
import type { ShopParams } from "@/lib/shop-url";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const gender = first(sp.gender);
  const category = first(sp.category);
  const q = first(sp.q);

  if (q) return { title: `Search: ${q}` };
  if (gender === "men" && category)
    return { title: `Men’s ${categoryLabel(category)}` };
  if (gender === "women" && category)
    return { title: `Women’s ${categoryLabel(category)}` };
  if (gender === "men") return { title: "Men’s Clothing" };
  if (gender === "women") return { title: "Women’s Clothing" };
  if (first(sp.sale)) return { title: "Sale" };
  return { title: "Shop All Clothing" };
}

export default async function ShopPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const genderRaw = first(sp.gender);
  const gender: Gender | undefined =
    genderRaw === "men" || genderRaw === "women" ? genderRaw : undefined;

  const sortRaw = first(sp.sort);
  const sort: SortKey = SORT_OPTIONS.some((o) => o.key === sortRaw)
    ? (sortRaw as SortKey)
    : "featured";

  const current: ShopParams = {
    gender,
    category: first(sp.category),
    size: first(sp.size),
    price: first(sp.price),
    sort: sort === "featured" ? undefined : sort,
    q: first(sp.q),
    sale: first(sp.sale) === "1" ? "1" : undefined,
  };

  const { products } = searchProducts({
    gender,
    category: current.category,
    size: current.size,
    price: current.price,
    sort,
    q: current.q,
    sale: Boolean(current.sale),
  });

  /* ---- facet counts (computed against the gender-scoped pool) ---- */
  const pool = gender ? PRODUCTS.filter((p) => p.gender === gender) : PRODUCTS;

  const genderOptions = [
    { key: "", label: "All", count: PRODUCTS.length },
    { key: "women", label: "Women", count: PRODUCTS.filter((p) => p.gender === "women").length },
    { key: "men", label: "Men", count: PRODUCTS.filter((p) => p.gender === "men").length },
  ];

  const categoryOptions = categoriesFor(gender).map((slug) => ({
    key: slug,
    label: categoryLabel(slug),
    count: pool.filter((p) => p.category === slug).length,
  }));

  const sizeOptions = SIZE_OPTIONS.filter((size) => pool.some((p) => p.sizes.includes(size))).map(
    (size) => ({ key: size, label: size, count: pool.filter((p) => p.sizes.includes(size)).length }),
  );

  const priceOptions = PRICE_BANDS.map((band) => ({
    key: band.key,
    label: band.label,
    count: pool.filter((p) => p.price >= band.min && p.price <= band.max).length,
  }));

  const activeCount = [
    current.gender,
    current.category,
    current.size,
    current.price,
    current.sale,
    current.q,
  ].filter(Boolean).length;

  /* ---- heading ---- */
  const heading = current.q
    ? `Results for “${current.q}”`
    : current.category
      ? current.gender
        ? `${current.gender === "men" ? "Men’s" : "Women’s"} ${categoryLabel(current.category)}`
        : categoryLabel(current.category)
      : current.sale
        ? "Sale"
        : current.gender
          ? current.gender === "men"
            ? "Men’s Clothing"
            : "Women’s Clothing"
          : current.sort === "newest"
            ? "New In"
            : "Shop All Clothing";

  return (
    <div className="container-page pt-8 pb-6">
      <nav aria-label="Breadcrumb" className="mb-5 text-xs text-ink-400">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="transition hover:text-ink-900">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-ink-700">{heading}</li>
        </ol>
      </nav>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-950 md:text-5xl">
            {heading}
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            {products.length} {products.length === 1 ? "style" : "styles"}
            {current.q ? " matching your search" : " in stock"}
          </p>
        </div>
        <SortSelect current={current} />
      </div>

      <div className="flex flex-col lg:flex-row lg:gap-10">
        <ShopFilters
          current={current}
          genderOptions={genderOptions}
          categoryOptions={categoryOptions}
          sizeOptions={sizeOptions}
          priceOptions={priceOptions}
          activeCount={activeCount}
        />

        <div className="min-w-0 flex-1">
          {products.length > 0 ? (
            <>
              <ProductGrid products={products} priorityCount={4} />
              <p className="mt-10 text-center text-xs text-ink-400">
                Showing {products.length} of {PRODUCTS.length} styles
              </p>
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-ink-200 bg-ink-50 px-6 py-20 text-center">
              <p className="font-display text-2xl font-semibold text-ink-950">
                Nothing matches those filters
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-ink-500">
                Try widening your search — our collections change with every drop.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/shop"
                  className="rounded-full bg-ink-950 px-6 py-3 text-xs font-semibold tracking-[0.16em] text-white uppercase transition hover:bg-brand-600"
                >
                  Clear filters
                </Link>
                <Link
                  href="/shop?sort=newest"
                  className="rounded-full border border-ink-950 px-6 py-3 text-xs font-semibold tracking-[0.16em] text-ink-950 uppercase transition hover:bg-ink-950 hover:text-white"
                >
                  See what&rsquo;s new
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

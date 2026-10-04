import { PRODUCTS, categoryLabel } from "@/lib/products";
import type { Gender, Product } from "@/lib/types";

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "rating";

export interface ShopFilters {
  gender?: Gender;
  category?: string;
  size?: string;
  sort?: SortKey;
  q?: string;
  price?: string; // price band key
  sale?: boolean;
}

export interface ShopQuery {
  count: number;
  products: Product[];
}

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "rating", label: "Top rated" },
];

export const PRICE_BANDS: { key: string; label: string; min: number; max: number }[] = [
  { key: "under-50", label: "Under $50", min: 0, max: 49.99 },
  { key: "50-100", label: "$50 – $100", min: 50, max: 100 },
  { key: "100-200", label: "$100 – $200", min: 100.01, max: 200 },
  { key: "200-plus", label: "$200 and up", min: 200.01, max: Infinity },
];

export const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

export function allProducts(): Product[] {
  return PRODUCTS;
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByIds(ids: string[]): Product[] {
  return ids
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
}

export function categoriesFor(gender?: Gender): string[] {
  const pool = gender ? PRODUCTS.filter((p) => p.gender === gender) : PRODUCTS;
  return [...new Set(pool.map((p) => p.category))].sort(
    (a, b) => categoryLabel(a).localeCompare(categoryLabel(b)),
  );
}

export function searchProducts(filters: ShopFilters): ShopQuery {
  const { gender, category, size, sort = "featured", q, price, sale } = filters;
  const band = PRICE_BANDS.find((b) => b.key === price);
  const query = q?.trim().toLowerCase();

  let list = PRODUCTS.slice();

  if (gender) list = list.filter((p) => p.gender === gender);
  if (category) list = list.filter((p) => p.category === category);
  if (size) list = list.filter((p) => p.sizes.includes(size));
  if (sale) list = list.filter((p) => typeof p.compareAtPrice === "number");
  if (band) list = list.filter((p) => p.price >= band.min && p.price <= band.max);
  if (query) {
    list = list.filter((p) =>
      [p.name, p.description, p.category, p.gender, ...p.details]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }

  switch (sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
      break;
    case "newest":
      list.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)) || a.rank - b.rank);
      break;
    default:
      list.sort((a, b) => a.rank - b.rank);
  }

  return { count: list.length, products: list };
}

export function featuredProducts(limit = 8, gender?: Gender): Product[] {
  return PRODUCTS.filter((p) => (gender ? p.gender === gender : true))
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit);
}

export function relatedProducts(product: Product, limit = 4): Product[] {
  return PRODUCTS.filter(
    (p) => p.id !== product.id && p.gender === product.gender && p.category === product.category,
  )
    .concat(
      PRODUCTS.filter(
        (p) => p.id !== product.id && p.gender === product.gender && p.category !== product.category,
      ),
    )
    .slice(0, limit);
}

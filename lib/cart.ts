import { PRODUCTS } from "@/lib/products";
import type { CartLine, CartLineView } from "@/lib/types";

export const FREE_SHIPPING_THRESHOLD = 100;
export const SHIPPING_FLAT_FEE = 9.95;
export const TAX_RATE = 0.08;
export const MAX_QTY_PER_LINE = 10;

export function findProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

/** Resolves raw cart lines against the catalog, dropping anything that no longer exists. */
export function toLineViews(lines: CartLine[]): CartLineView[] {
  return lines.flatMap((line) => {
    const product = findProduct(line.productId);
    if (!product) return [];
    const qty = Math.max(1, Math.min(MAX_QTY_PER_LINE, line.qty));
    return [{ ...line, qty, product, lineTotal: product.price * qty }];
  });
}

export interface CartSummary {
  lines: CartLineView[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  freeShippingUnlocked: boolean;
  amountUntilFreeShipping: number;
}

export function summarize(lines: CartLine[]): CartSummary {
  const views = toLineViews(lines);
  const subtotal = views.reduce((sum, l) => sum + l.lineTotal, 0);
  const itemCount = views.reduce((sum, l) => sum + l.qty, 0);
  const freeShippingUnlocked = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shipping = freeShippingUnlocked ? 0 : SHIPPING_FLAT_FEE;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  return {
    lines: views,
    itemCount,
    subtotal: Math.round(subtotal * 100) / 100,
    shipping,
    tax,
    total,
    freeShippingUnlocked,
    amountUntilFreeShipping: Math.max(0, Math.round((FREE_SHIPPING_THRESHOLD - subtotal) * 100) / 100),
  };
}

export function lineKey(productId: string, size: string, color: string): string {
  return `${productId}::${size}::${color}`;
}

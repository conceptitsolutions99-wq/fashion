"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { lineKey, summarize, type CartSummary } from "@/lib/cart";
import type { CartLine, Product } from "@/lib/types";

const STORAGE_KEY = "your-fashionista-cart-v1";
const TOAST_DURATION = 3200;

interface AddToCartInput {
  product: Product;
  size: string;
  color: string;
  qty?: number;
}

interface CartContextValue {
  lines: CartLine[];
  summary: CartSummary;
  hydrated: boolean;
  toast: { id: number; message: string; href?: string; label?: string } | null;
  add: (input: AddToCartInput) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function readStoredLines(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is CartLine =>
        Boolean(l) &&
        typeof l.productId === "string" &&
        typeof l.size === "string" &&
        typeof l.color === "string" &&
        typeof l.qty === "number",
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<CartContextValue["toast"]>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from localStorage once on the client so SSR and first paint match.
  useEffect(() => {
    setLines(readStoredLines());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage full or unavailable — cart still works for this session */
    }
  }, [lines, hydrated]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = useCallback((message: string, href?: string, label?: string) => {
    setToast({ id: Date.now(), message, href, label });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), TOAST_DURATION);
  }, []);

  const add = useCallback(
    ({ product, size, color, qty = 1 }: AddToCartInput) => {
      const key = lineKey(product.id, size, color);
      setLines((prev) => {
        const existing = prev.find((l) => lineKey(l.productId, l.size, l.color) === key);
        if (existing) {
          return prev.map((l) =>
            l === existing ? { ...l, qty: Math.min(10, l.qty + qty) } : l,
          );
        }
        return [...prev, { productId: product.id, size, color, qty }];
      });
      showToast(`Added “${product.name}” to your bag`, "/cart", "View bag");
    },
    [showToast],
  );

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) => {
      if (qty <= 0) return prev.filter((l) => lineKey(l.productId, l.size, l.color) !== key);
      return prev.map((l) =>
        lineKey(l.productId, l.size, l.color) === key
          ? { ...l, qty: Math.min(10, qty) }
          : l,
      );
    });
  }, []);

  const remove = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => lineKey(l.productId, l.size, l.color) !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const summary = useMemo(() => summarize(lines), [lines]);

  const value = useMemo<CartContextValue>(
    () => ({ lines, summary, hydrated, toast, add, setQty, remove, clear }),
    [lines, summary, hydrated, toast, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside a <CartProvider>");
  return ctx;
}

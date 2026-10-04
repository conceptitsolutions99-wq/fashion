const ORDER_KEY = "your-fashionista-last-order-v1";

export type PaymentMethod = "card" | "paypal" | "cod";
export type DeliveryMethod = "standard" | "express";

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  imageAlt: string;
  size: string;
  color: string;
  qty: number;
  price: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  placedAt: string;
  email: string;
  shipping: {
    firstName: string;
    lastName: string;
    address: string;
    apartment?: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  delivery: DeliveryMethod;
  payment: { method: PaymentMethod; cardLast4?: string };
  items: OrderItem[];
  totals: { subtotal: number; shipping: number; tax: number; total: number };
}

export function createOrderId(): string {
  return `YF-${Math.floor(100000 + Math.random() * 900000)}`;
}

export function saveOrder(order: Order): void {
  try {
    window.sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
  } catch {
    /* private mode — confirmation page will fall back gracefully */
  }
}

export function loadOrder(): Order | null {
  try {
    const raw = window.sessionStorage.getItem(ORDER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Order;
    if (!parsed || typeof parsed.id !== "string" || !Array.isArray(parsed.items)) return null;
    return parsed;
  } catch {
    return null;
  }
}

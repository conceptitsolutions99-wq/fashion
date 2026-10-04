import type { Metadata } from "next";

import CartView from "@/components/CartView";
import { featuredProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Your Bag",
  description: "Review the items in your shopping bag before checkout.",
};

export default function CartPage() {
  return <CartView suggestions={featuredProducts(4)} />;
}

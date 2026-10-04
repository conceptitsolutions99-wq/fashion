import type { Metadata } from "next";

import CheckoutView from "@/components/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure checkout — shipping, delivery and payment.",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}

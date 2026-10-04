import type { Metadata } from "next";

import OrderConfirmation from "@/components/OrderConfirmation";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false },
};

export default function OrderConfirmationPage() {
  return <OrderConfirmation />;
}

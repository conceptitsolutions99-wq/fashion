import type { Metadata, Viewport } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { CartProvider } from "@/components/CartProvider";
import Toast from "@/components/Toast";

import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Your Fashionista — Clothing for Men & Women",
    template: "%s | Your Fashionista",
  },
  description:
    "Your Fashionista is a modern clothing shop for men and women: dresses, denim, knitwear, tailoring, footwear and more. Free shipping over $100 and 30-day returns.",
  keywords: [
    "fashion",
    "clothing shop",
    "men's clothing",
    "women's clothing",
    "dresses",
    "denim",
    "online store",
  ],
  openGraph: {
    title: "Your Fashionista — Clothing for Men & Women",
    description:
      "Considered clothing for men and women. Shop new season dresses, denim, knitwear, tailoring and footwear.",
    images: [{ url: "/editorial/store.jpg", width: 1400, height: 933, alt: "Your Fashionista store" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Fashionista — Clothing for Men & Women",
    description: "Considered clothing for men and women. Shop the new season now.",
  },
};

export const viewport: Viewport = {
  themeColor: "#121110",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-white font-sans text-ink-900 antialiased">
        <CartProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <Toast />
        </CartProvider>
      </body>
    </html>
  );
}

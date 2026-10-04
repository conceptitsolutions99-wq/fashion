import type { MetadataRoute } from "next";

import { INFO_PAGES } from "@/lib/info-pages";
import { PRODUCTS } from "@/lib/products";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;

  const staticRoutes: MetadataRoute.Sitemap = ["", "/shop", "/cart", "/checkout"].map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: path === "" ? 1 : path === "/shop" ? 0.9 : 0.5,
  }));

  const infoRoutes: MetadataRoute.Sitemap = INFO_PAGES.map((page) => ({
    url: `${base}/info/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const productRoutes: MetadataRoute.Sitemap = PRODUCTS.map((product) => ({
    url: `${base}/product/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...infoRoutes, ...productRoutes];
}

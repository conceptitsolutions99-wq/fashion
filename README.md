# Your Fashionista 👗👔

A complete, production-ready clothing shop for **men and women**, built with **Next.js 15 (App Router) + TypeScript + Tailwind CSS 4**. Includes a working cart, a full checkout flow and an order confirmation — ready to deploy to **Vercel** straight from GitHub.

---

## ✨ Features

**Storefront**
- Modern, responsive design (mobile → 4K) with a serif/grotesque editorial type system
- Home page: hero, value props, category tiles, trending grid, brand story, new arrivals, testimonials
- Shop page with **URL-driven filters**: gender, category, size, price band, sale, free-text search and 5 sort orders — all shareable as links
- Product pages: gallery, colour/size selection, quantity, ratings, sale badges, accordions, related products
- 35 products across 13 categories with real photography (served locally from `/public`)

**Buying flow**
- Cart with **localStorage persistence**, quantity steppers, remove, live totals
- Free-shipping progress bar, 8% tax, free shipping over $100
- Checkout with full client-side validation (email, address, **Luhn card check**, expiry, CVC)
- Delivery options (standard / express) and payment methods (card / PayPal / cash on delivery)
- Order confirmation page with order number, ETA, items, totals and shipping address

**Platform**
- Static generation for all product and info pages, dynamic rendering for the shop
- SEO: per-page metadata, Open Graph, `sitemap.xml`, `robots.txt`, semantic HTML
- Accessible: labelled controls, focus states, `aria-*` attributes, reduced-motion friendly
- Custom 404, info/help pages (shipping, returns, size guide, contact, about, stores, careers, sustainability) so every footer link resolves

---

## 🧰 Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script             | What it does                    |
| ------------------ | ------------------------------- |
| `npm run dev`      | Development server              |
| `npm run build`    | Production build (type-checked) |
| `npm run start`    | Serve the production build      |
| `npm run typecheck`| TypeScript check without emit   |

---

## 🚀 Deploy to Vercel

### Option A — Vercel dashboard (recommended)

1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Your Fashionista storefront"
   git branch -M main
   git remote add origin https://github.com/<you>/your-fashionista.git
   git push -u origin main
   ```
2. Open [vercel.com/new](https://vercel.com/new), import that repository.
3. Vercel auto-detects **Next.js** — leave the framework preset as-is and click **Deploy**.
4. Done. Every push to `main` now produces a new deployment.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production deployment
```

### Environment variables (optional)

| Variable             | Purpose                                   | Default                     |
| -------------------- | ----------------------------------------- | --------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL used for SEO/OG/sitemap  | `https://<deployment>` on Vercel |

Set it to your real domain once you attach one, e.g. `https://yourfashionista.com`.

---

## 🗂 Project structure

```
app/
  layout.tsx              fonts, metadata, header/footer, cart provider
  page.tsx                home page
  shop/page.tsx           listing + filters + sorting (URL-driven)
  product/[slug]/page.tsx product detail (SSG)
  cart/                   bag page
  checkout/               checkout form
  order-confirmation/     order summary
  info/[slug]/page.tsx    help & policy pages (SSG)
  sitemap.ts, robots.ts, not-found.tsx, icon.svg
components/               header, footer, cards, filters, cart/checkout views
lib/
  products.ts             product catalogue (edit this to change stock)
  catalog.ts              search / filter / sort logic
  cart.ts                 totals, shipping and tax maths
  orders.ts               order persistence (sessionStorage)
  info-pages.ts           help page content
public/
  products/  editorial/   product & campaign photography
scripts/
  download-images.sh      where the photography came from
  make-favicon.mjs        dependency-free favicon generator
```

### Editing the catalogue

Everything about stock lives in [`lib/products.ts`](lib/products.ts) — name, price, `compareAtPrice` (shows a sale badge), colours, sizes, description, details, rating. Add a JPEG to `public/products/` and a matching entry, and the product automatically appears in the shop, sitemap, related-product rails and search.

---

## 🛒 Checkout notes

The storefront is **fully functional as a demo**: orders are validated, totals calculated and the confirmation rendered in the browser. No payment gateway is wired up, and no card data leaves the page (nothing is sent anywhere). The checkout says so on-screen and suggests the test card `4242 4242 4242 4242`.

To take real payments, swap the payment section in `components/CheckoutView.tsx` for Stripe Checkout or Payment Element — the cart and order objects are already structured for it.

## 📸 Photography

Images are from [Unsplash](https://unsplash.com/license) under the Unsplash License and are stored locally in `public/`, so the site works offline and on any host. Re-run `bash scripts/download-images.sh` to re-download them.

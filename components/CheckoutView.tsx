"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/components/CartProvider";
import { TAX_RATE } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import {
  createOrderId,
  saveOrder,
  type DeliveryMethod,
  type PaymentMethod,
} from "@/lib/orders";

const EXPRESS_FEE = 19.95;

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "United Arab Emirates",
  "India",
  "Japan",
  "Singapore",
  "New Zealand",
];

type FormState = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
};

const EMPTY_FORM: FormState = {
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  region: "",
  postalCode: "",
  country: "United States",
  apartment: "",
};

type Errors = Partial<Record<keyof FormState | "cardNumber" | "cardName" | "cardExpiry" | "cardCvc", string>>;

function luhnValid(digits: string): boolean {
  if (digits.length < 15) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

function groupCardNumber(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

const inputBase =
  "w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400";

function fieldClass(error?: string) {
  return `${inputBase} ${
    error ? "border-brand-500 focus:border-brand-500" : "border-ink-200 focus:border-ink-950"
  }`;
}

export default function CheckoutView() {
  const router = useRouter();
  const { summary, hydrated, clear } = useCart();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [delivery, setDelivery] = useState<DeliveryMethod>("standard");
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvc: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  // guard: nothing to buy
  useEffect(() => {
    if (hydrated && summary.lines.length === 0 && !submitting) {
      router.replace("/cart");
    }
  }, [hydrated, summary.lines.length, submitting, router]);

  const shipping = delivery === "express" ? EXPRESS_FEE : summary.shipping;
  const tax = summary.tax;
  const total = Math.round((summary.subtotal + shipping + tax) * 100) / 100;

  const steps = [
    { label: "Bag", href: "/cart", state: "done" },
    { label: "Information", href: "#information", state: "current" },
    { label: "Payment", href: "#payment", state: "todo" },
  ];

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): Errors {
    const next: Errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      next.email = "Enter a valid email address";
    if (!form.firstName.trim()) next.firstName = "Required";
    if (!form.lastName.trim()) next.lastName = "Required";
    if (!form.address.trim()) next.address = "Required";
    if (!form.city.trim()) next.city = "Required";
    if (!form.region.trim()) next.region = "Required";
    if (!form.postalCode.trim()) next.postalCode = "Required";
    if (form.phone.trim() && form.phone.replace(/\D/g, "").length < 7)
      next.phone = "Enter a valid phone number";

    if (method === "card") {
      const digits = card.number.replace(/\D/g, "");
      if (!luhnValid(digits)) next.cardNumber = "Enter a valid card number";
      if (!card.name.trim()) next.cardName = "Name on card is required";
      const m = card.expiry.match(/^(\d{2})\/(\d{2})$/);
      if (!m) {
        next.cardExpiry = "Use MM/YY";
      } else {
        const month = Number(m[1]);
        const year = 2000 + Number(m[2]);
        const now = new Date();
        const endOfMonth = new Date(year, month, 0, 23, 59, 59);
        if (month < 1 || month > 12) next.cardExpiry = "Month must be 01–12";
        else if (endOfMonth < now) next.cardExpiry = "Card has expired";
      }
      if (!/^\d{3,4}$/.test(card.cvc)) next.cardCvc = "3 or 4 digits";
    }

    return next;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const firstKey = Object.keys(found)[0];
      document.getElementById(firstKey)?.focus();
      document.getElementById(firstKey)?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    setSubmitting(true);

    const order = {
      id: createOrderId(),
      placedAt: new Date().toISOString(),
      email: form.email.trim(),
      shipping: {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        address: form.address.trim(),
        apartment: form.apartment.trim() || undefined,
        city: form.city.trim(),
        region: form.region.trim(),
        postalCode: form.postalCode.trim(),
        country: form.country,
        phone: form.phone.trim() || undefined,
      },
      delivery,
      payment: {
        method,
        cardLast4: method === "card" ? card.number.replace(/\D/g, "").slice(-4) : undefined,
      },
      items: summary.lines.map((line) => ({
        productId: line.productId,
        slug: line.product.slug,
        name: line.product.name,
        image: line.product.image,
        imageAlt: line.product.imageAlt,
        size: line.size,
        color: line.color,
        qty: line.qty,
        price: line.product.price,
        lineTotal: line.lineTotal,
      })),
      totals: { subtotal: summary.subtotal, shipping, tax, total },
    };

    saveOrder(order);
    clear();
    router.push("/order-confirmation");
  }

  const itemLabel = useMemo(
    () => `${summary.itemCount} ${summary.itemCount === 1 ? "item" : "items"}`,
    [summary.itemCount],
  );

  if (!hydrated || summary.lines.length === 0) {
    return (
      <div className="container-page py-24 text-center text-sm text-ink-500">
        Preparing checkout…
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      {/* progress */}
      <ol className="mb-9 flex flex-wrap items-center justify-center gap-x-2 gap-y-3 text-[11px] font-semibold tracking-[0.16em] uppercase sm:gap-x-4">
        {steps.map((s, i) => (
          <li key={s.label} className="flex items-center gap-2 sm:gap-4">
            <span
              className={`flex items-center gap-2 ${
                s.state === "current" ? "text-ink-950" : "text-ink-400"
              }`}
            >
              <span
                className={`grid h-6 w-6 place-items-center rounded-full text-[10px] ${
                  s.state === "current"
                    ? "bg-ink-950 text-white"
                    : s.state === "done"
                      ? "bg-emerald-600 text-white"
                      : "border border-ink-200 text-ink-400"
                }`}
              >
                {s.state === "done" ? "✓" : i + 1}
              </span>
              {s.label}
            </span>
            {i < steps.length - 1 && <span className="h-px w-6 bg-ink-200 sm:w-12" />}
          </li>
        ))}
      </ol>

      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <form onSubmit={handleSubmit} noValidate className="min-w-0">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-950">
            Checkout
          </h1>

          {/* contact */}
          <section id="information" className="mt-8 scroll-mt-40">
            <h2 className="text-[11px] font-semibold tracking-[0.18em] text-ink-950 uppercase">
              1 · Contact information
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="email" className="mb-1.5 block text-xs text-ink-600">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@example.com"
                  className={fieldClass(errors.email)}
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-brand-600" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="phone" className="mb-1.5 block text-xs text-ink-600">
                  Phone (for delivery updates, optional)
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+1 555 000 1234"
                  className={fieldClass(errors.phone)}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-brand-600" role="alert">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* shipping address */}
          <section className="mt-9">
            <h2 className="text-[11px] font-semibold tracking-[0.18em] text-ink-950 uppercase">
              2 · Shipping address
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["firstName", "First name", "given-name", "Jane"],
                  ["lastName", "Last name", "family-name", "Doe"],
                ] as const
              ).map(([key, label, ac, ph]) => (
                <div key={key}>
                  <label htmlFor={key} className="mb-1.5 block text-xs text-ink-600">
                    {label}
                  </label>
                  <input
                    id={key}
                    autoComplete={ac}
                    value={form[key]}
                    onChange={(e) => set(key, e.target.value)}
                    placeholder={ph}
                    className={fieldClass(errors[key])}
                    aria-invalid={Boolean(errors[key])}
                  />
                  {errors[key] && (
                    <p className="mt-1 text-xs text-brand-600" role="alert">
                      {errors[key]}
                    </p>
                  )}
                </div>
              ))}

              <div className="sm:col-span-2">
                <label htmlFor="address" className="mb-1.5 block text-xs text-ink-600">
                  Street address
                </label>
                <input
                  id="address"
                  autoComplete="address-line1"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="123 Market Street"
                  className={fieldClass(errors.address)}
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-brand-600" role="alert">
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="apartment" className="mb-1.5 block text-xs text-ink-600">
                  Apartment, suite, etc. (optional)
                </label>
                <input
                  id="apartment"
                  autoComplete="address-line2"
                  value={form.apartment}
                  onChange={(e) => set("apartment", e.target.value)}
                  placeholder="Apt 4B"
                  className={fieldClass()}
                />
              </div>

              {(
                [
                  ["city", "City", "address-level2", "San Francisco"],
                  ["region", "State / Region", "address-level1", "California"],
                  ["postalCode", "Postal code", "postal-code", "94103"],
                ] as const
              ).map(([key, label, ac, ph]) => (
                <div key={key}>
                  <label htmlFor={key} className="mb-1.5 block text-xs text-ink-600">
                    {label}
                  </label>
                  <input
                    id={key}
                    autoComplete={ac}
                    value={form[key]}
                    onChange={(e) => set(key, e.target.value)}
                    placeholder={ph}
                    className={fieldClass(errors[key])}
                    aria-invalid={Boolean(errors[key])}
                  />
                  {errors[key] && (
                    <p className="mt-1 text-xs text-brand-600" role="alert">
                      {errors[key]}
                    </p>
                  )}
                </div>
              ))}

              <div>
                <label htmlFor="country" className="mb-1.5 block text-xs text-ink-600">
                  Country
                </label>
                <select
                  id="country"
                  autoComplete="country-name"
                  value={form.country}
                  onChange={(e) => set("country", e.target.value)}
                  className={fieldClass()}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* delivery */}
          <section className="mt-9">
            <h2 className="text-[11px] font-semibold tracking-[0.18em] text-ink-950 uppercase">
              3 · Delivery method
            </h2>
            <div className="mt-4 grid gap-3">
              {(
                [
                  {
                    key: "standard" as DeliveryMethod,
                    title: "Standard delivery",
                    detail: "3–5 working days",
                    price: summary.freeShippingUnlocked ? "Free" : formatPrice(summary.shipping),
                  },
                  {
                    key: "express" as DeliveryMethod,
                    title: "Express delivery",
                    detail: "1–2 working days",
                    price: formatPrice(EXPRESS_FEE),
                  },
                ]
              ).map((opt) => (
                <label
                  key={opt.key}
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border px-4 py-4 transition ${
                    delivery === opt.key
                      ? "border-ink-950 bg-ink-50"
                      : "border-ink-200 hover:border-ink-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={opt.key}
                    checked={delivery === opt.key}
                    onChange={() => setDelivery(opt.key)}
                    className="h-4 w-4 accent-ink-950"
                  />
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-ink-950">{opt.title}</span>
                    <span className="block text-xs text-ink-500">{opt.detail}</span>
                  </span>
                  <span className="text-sm font-semibold text-ink-950">{opt.price}</span>
                </label>
              ))}
            </div>
          </section>

          {/* payment */}
          <section id="payment" className="mt-9 scroll-mt-40">
            <h2 className="text-[11px] font-semibold tracking-[0.18em] text-ink-950 uppercase">
              4 · Payment
            </h2>

            <div className="mt-4 grid gap-3">
              {(
                [
                  { key: "card" as PaymentMethod, label: "Credit / debit card" },
                  { key: "paypal" as PaymentMethod, label: "PayPal" },
                  { key: "cod" as PaymentMethod, label: "Cash on delivery" },
                ]
              ).map((opt) => (
                <label
                  key={opt.key}
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border px-4 py-4 transition ${
                    method === opt.key
                      ? "border-ink-950 bg-ink-50"
                      : "border-ink-200 hover:border-ink-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={opt.key}
                    checked={method === opt.key}
                    onChange={() => setMethod(opt.key)}
                    className="h-4 w-4 accent-ink-950"
                  />
                  <span className="text-sm font-medium text-ink-950">{opt.label}</span>
                </label>
              ))}
            </div>

            {method === "card" && (
              <div className="mt-4 grid gap-4 rounded-xl border border-ink-200 bg-ink-50 p-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="cardNumber" className="mb-1.5 block text-xs text-ink-600">
                    Card number
                  </label>
                  <input
                    id="cardNumber"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    value={card.number}
                    onChange={(e) => {
                      setCard((c) => ({ ...c, number: groupCardNumber(e.target.value) }));
                      if (errors.cardNumber)
                        setErrors((p) => ({ ...p, cardNumber: undefined }));
                    }}
                    placeholder="4242 4242 4242 4242"
                    className={fieldClass(errors.cardNumber)}
                    aria-invalid={Boolean(errors.cardNumber)}
                  />
                  {errors.cardNumber && (
                    <p className="mt-1 text-xs text-brand-600" role="alert">
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="cardName" className="mb-1.5 block text-xs text-ink-600">
                    Name on card
                  </label>
                  <input
                    id="cardName"
                    autoComplete="cc-name"
                    value={card.name}
                    onChange={(e) => {
                      setCard((c) => ({ ...c, name: e.target.value }));
                      if (errors.cardName) setErrors((p) => ({ ...p, cardName: undefined }));
                    }}
                    placeholder="Jane Doe"
                    className={fieldClass(errors.cardName)}
                    aria-invalid={Boolean(errors.cardName)}
                  />
                  {errors.cardName && (
                    <p className="mt-1 text-xs text-brand-600" role="alert">
                      {errors.cardName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="cardExpiry" className="mb-1.5 block text-xs text-ink-600">
                    Expiry (MM/YY)
                  </label>
                  <input
                    id="cardExpiry"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    value={card.expiry}
                    onChange={(e) => {
                      setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }));
                      if (errors.cardExpiry) setErrors((p) => ({ ...p, cardExpiry: undefined }));
                    }}
                    placeholder="09/29"
                    className={fieldClass(errors.cardExpiry)}
                    aria-invalid={Boolean(errors.cardExpiry)}
                  />
                  {errors.cardExpiry && (
                    <p className="mt-1 text-xs text-brand-600" role="alert">
                      {errors.cardExpiry}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="cardCvc" className="mb-1.5 block text-xs text-ink-600">
                    Security code
                  </label>
                  <input
                    id="cardCvc"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    value={card.cvc}
                    onChange={(e) => {
                      setCard((c) => ({
                        ...c,
                        cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
                      }));
                      if (errors.cardCvc) setErrors((p) => ({ ...p, cardCvc: undefined }));
                    }}
                    placeholder="123"
                    className={fieldClass(errors.cardCvc)}
                    aria-invalid={Boolean(errors.cardCvc)}
                  />
                  {errors.cardCvc && (
                    <p className="mt-1 text-xs text-brand-600" role="alert">
                      {errors.cardCvc}
                    </p>
                  )}
                </div>
              </div>
            )}

            {method === "paypal" && (
              <p className="mt-4 rounded-xl border border-ink-200 bg-ink-50 p-4 text-sm text-ink-600">
                You&rsquo;ll be redirected to PayPal to complete payment after placing your order.
              </p>
            )}
            {method === "cod" && (
              <p className="mt-4 rounded-xl border border-ink-200 bg-ink-50 p-4 text-sm text-ink-600">
                Pay in cash when your order arrives. A $2 handling fee may apply for cash on
                delivery in some regions.
              </p>
            )}

            <p className="mt-4 text-xs text-ink-400">
              This is a demo storefront — no card is charged and no data leaves your browser.
              Try <strong className="font-medium text-ink-600">4242 4242 4242 4242</strong> with
              any future expiry and CVC.
            </p>
          </section>

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 h-14 w-full rounded-full bg-ink-950 text-sm font-semibold tracking-[0.16em] text-white uppercase transition hover:bg-brand-600 disabled:opacity-60 sm:w-auto sm:px-14"
          >
            {submitting ? "Placing order…" : `Place order — ${formatPrice(total)}`}
          </button>

          <p className="mt-4 text-xs text-ink-400">
            By placing an order you agree to our{" "}
            <Link href="/info/returns" className="underline underline-offset-4">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/info/shipping" className="underline underline-offset-4">
              shipping policy
            </Link>
            .
          </p>
        </form>

        {/* summary */}
        <aside className="lg:sticky lg:top-36 lg:self-start">
          <div className="rounded-3xl border border-ink-100 bg-ink-50 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-semibold tracking-[0.18em] text-ink-950 uppercase">
                Order summary
              </h2>
              <span className="text-xs text-ink-400">{itemLabel}</span>
            </div>

            <ul className="mt-5 max-h-72 space-y-4 overflow-y-auto pr-1">
              {summary.lines.map((line) => (
                <li key={`${line.productId}-${line.size}-${line.color}`} className="flex gap-3">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-ink-200">
                    <Image
                      src={line.product.image}
                      alt={line.product.imageAlt}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                    <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-ink-950 text-[10px] font-semibold text-white">
                      {line.qty}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink-950">
                      {line.product.name}
                    </p>
                    <p className="text-xs text-ink-500">
                      {line.size} · {line.color}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-medium text-ink-950">
                    {formatPrice(line.lineTotal)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-3 border-t border-ink-200 pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-600">Subtotal</dt>
                <dd className="font-medium text-ink-950">{formatPrice(summary.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-600">Shipping</dt>
                <dd className="font-medium text-ink-950">
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-600">Estimated tax ({Math.round(TAX_RATE * 100)}%)</dt>
                <dd className="font-medium text-ink-950">{formatPrice(tax)}</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-ink-200 pt-4">
                <dt className="font-semibold text-ink-950">Total</dt>
                <dd className="text-xl font-semibold text-ink-950">{formatPrice(total)}</dd>
              </div>
            </dl>

            <Link
              href="/cart"
              className="mt-5 block text-center text-xs text-ink-500 underline underline-offset-4 transition hover:text-ink-950"
            >
              ← Return to bag
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-24">
      <div className="mx-auto max-w-lg text-center">
        <p className="font-display text-7xl font-semibold text-ink-950">404</p>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink-950">
          This page has left the rail
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
          The link may be old, or the piece sold out and retired. Everything in stock is one tap
          away.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-ink-950 px-7 py-3.5 text-xs font-semibold tracking-[0.16em] text-white uppercase transition hover:bg-brand-600"
          >
            Back home
          </Link>
          <Link
            href="/shop"
            className="rounded-full border border-ink-950 px-7 py-3.5 text-xs font-semibold tracking-[0.16em] text-ink-950 uppercase transition hover:bg-ink-950 hover:text-white"
          >
            Shop all
          </Link>
        </div>
      </div>
    </div>
  );
}

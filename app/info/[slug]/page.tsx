import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { INFO_PAGES, getInfoPage } from "@/lib/info-pages";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return INFO_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getInfoPage(slug);
  if (!page) return { title: "Page not found" };
  return { title: page.title, description: page.intro };
}

export default async function InfoPage({ params }: Props) {
  const { slug } = await params;
  const page = getInfoPage(slug);
  if (!page) notFound();

  return (
    <div className="container-page py-12">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-ink-400">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="transition hover:text-ink-900">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-ink-700">{page.title}</li>
        </ol>
      </nav>

      <div className="max-w-3xl">
        <p className="text-[11px] font-semibold tracking-[0.24em] text-brand-600 uppercase">
          {page.eyebrow}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink-950 md:text-5xl">
          {page.title}
        </h1>
        <p className="mt-5 text-[17px] leading-relaxed text-ink-600">{page.intro}</p>
      </div>

      <div className="mt-12 grid max-w-5xl gap-8 md:grid-cols-2">
        {page.sections.map((section) => (
          <section
            key={section.heading}
            className="rounded-3xl border border-ink-100 bg-white p-6 md:p-7"
          >
            <h2 className="font-display text-2xl font-semibold text-ink-950">
              {section.heading}
            </h2>

            {section.paragraphs?.map((p, i) => (
              <p key={i} className="mt-4 text-[15px] leading-relaxed text-ink-600">
                {p}
              </p>
            ))}

            {section.bullets && (
              <ul className="mt-4 space-y-2.5">
                {section.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-[15px] text-ink-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {section.table && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <caption className="mb-3 text-left text-xs text-ink-400">
                    {section.table.caption}
                  </caption>
                  <thead>
                    <tr className="border-b border-ink-200">
                      {section.table.head.map((h) => (
                        <th
                          key={h}
                          scope="col"
                          className="py-2 pr-4 text-left text-[11px] font-semibold tracking-wider text-ink-950 uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row) => (
                      <tr key={row[0]} className="border-b border-ink-100 last:border-0">
                        {row.map((cell, i) => (
                          <td
                            key={i}
                            className={`py-2.5 pr-4 ${
                              i === 0 ? "font-medium text-ink-950" : "text-ink-600"
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </div>

      <div className="mt-14 flex flex-wrap gap-3">
        <Link
          href="/shop"
          className="rounded-full bg-ink-950 px-7 py-3.5 text-xs font-semibold tracking-[0.16em] text-white uppercase transition hover:bg-brand-600"
        >
          Shop the collection
        </Link>
        <Link
          href="/info/contact"
          className="rounded-full border border-ink-950 px-7 py-3.5 text-xs font-semibold tracking-[0.16em] text-ink-950 uppercase transition hover:bg-ink-950 hover:text-white"
        >
          Talk to us
        </Link>
      </div>
    </div>
  );
}

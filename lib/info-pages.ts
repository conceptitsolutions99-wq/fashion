export interface InfoSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: { caption: string; head: string[]; rows: string[][] };
}

export interface InfoPage {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  sections: InfoSection[];
}

export const INFO_PAGES: InfoPage[] = [
  {
    slug: "about",
    eyebrow: "Our story",
    title: "About Your Fashionista",
    intro:
      "We started in 2019 with a simple idea: clothes should look as good on day 100 as they did on day one — and the price should make sense.",
    sections: [
      {
        heading: "Clothes first, hype second",
        paragraphs: [
          "Your Fashionista is an independent clothing shop for men and women. We design in-house, work directly with mills in Portugal, Turkey and India, and drop small runs so nothing sits in a warehouse for a year.",
          "Every fit is tested on more than 40 body types before it goes into production, and we publish the fabric composition and care instructions on every product page — no surprises after the first wash.",
        ],
      },
      {
        heading: "What we believe",
        bullets: [
          "Natural fibres wherever possible, and honest labelling when they're not.",
          "Fair pricing — no fake ‘was $300, now $49’ theatre; sale prices are genuine markdowns on real end-of-season stock.",
          "Fit over fashion: if a piece doesn't earn a place in your weekly rotation, it doesn't ship.",
          "Small batches, restocked based on what you actually buy.",
        ],
      },
      {
        heading: "By the numbers",
        bullets: [
          "12,400+ reviews averaging 4.8 out of 5",
          "120+ new styles released this year",
          "92% of packaging is recyclable or reusable",
          "30-day returns on every order, no questions asked",
        ],
      },
    ],
  },
  {
    slug: "shipping",
    eyebrow: "Delivery",
    title: "Shipping & Delivery",
    intro:
      "Orders placed before 3pm are dispatched the same working day. You'll get a tracking link by email as soon as your parcel leaves us.",
    sections: [
      {
        heading: "Rates & timeframes",
        table: {
          caption: "Delivery options",
          head: ["Method", "Timeframe", "Cost"],
          rows: [
            ["Standard", "3–5 working days", "Free over $100, otherwise $9.95"],
            ["Express", "1–2 working days", "$19.95"],
            ["International", "7–14 working days", "Calculated at checkout"],
          ],
        },
      },
      {
        heading: "Good to know",
        bullets: [
          "Free standard shipping applies automatically when your subtotal reaches $100.",
          "Tracking numbers are emailed within 24 hours of dispatch.",
          "Deliveries are made Monday–Saturday; some regions offer Sunday delivery at checkout.",
          "We ship to 40+ countries. Duties for international orders are shown at checkout where possible.",
          "Order tracking: email your order number to orders@yourfashionista.com and we'll reply within one business day.",
        ],
      },
      {
        heading: "Where's my order?",
        paragraphs: [
          "Most delays come from a mistyped apartment number or a missed delivery card. Check the tracking link first — if it hasn't updated in 48 hours, contact our team and we'll chase the courier for you.",
        ],
      },
    ],
  },
  {
    slug: "returns",
    eyebrow: "Hassle-free",
    title: "Returns & Exchanges",
    intro:
      "Changed your mind? You have 30 days from delivery to return anything unworn with tags attached — and returns are free for US orders.",
    sections: [
      {
        heading: "How it works",
        bullets: [
          "Start a return within 30 days of delivery by emailing returns@yourfashionista.com with your order number.",
          "We'll send a prepaid return label (US orders) or instructions for your region.",
          "Pack items with tags attached and in original condition — perfumed, worn or washed items can't be accepted.",
          "Refunds are issued to the original payment method within 5 working days of arrival at our warehouse.",
        ],
      },
      {
        heading: "Exchanges",
        paragraphs: [
          "Need a different size instead? Tell us in your return request and we'll reserve the replacement as soon as your parcel is scanned — so you're not waiting on stock.",
        ],
      },
      {
        heading: "Exceptions",
        bullets: [
          "Underwear, earrings and grooming products are final sale for hygiene reasons.",
          "Items marked ‘Final sale’ at purchase can't be returned.",
          "Gift cards are non-refundable.",
        ],
      },
    ],
  },
  {
    slug: "size-guide",
    eyebrow: "Fit",
    title: "Size Guide",
    intro:
      "Our sizing runs true to size. If you're between two sizes, size up for a relaxed fit or stay put for a closer one.",
    sections: [
      {
        heading: "Women's clothing",
        table: {
          caption: "Women's size chart (inches)",
          head: ["Size", "Bust", "Waist", "Hips"],
          rows: [
            ["XS (0–2)", '32"–33"', '24"–25"', '34"–35"'],
            ["S (4–6)", '34"–35"', '26"–27"', '36"–37"'],
            ["M (8–10)", '36"–37"', '28"–29"', '38"–39"'],
            ["L (12–14)", '38"–40"', '30"–32"', '40"–42"'],
            ["XL (16–18)", '41"–43"', '33"–35"', '43"–45"'],
          ],
        },
      },
      {
        heading: "Men's clothing",
        table: {
          caption: "Men's size chart (inches)",
          head: ["Size", "Chest", "Waist", "Neck"],
          rows: [
            ["S", '34"–36"', '28"–30"', '14"–14.5"'],
            ["M", '38"–40"', '32"–34"', '15"–15.5"'],
            ["L", '42"–44"', '36"–38"', '16"–16.5"'],
            ["XL", '46"–48"', '40"–42"', '17"–17.5"'],
            ["XXL", '50"–52"', '44"–46"', '18"'],
          ],
        },
      },
      {
        heading: "Footwear",
        table: {
          caption: "Shoe sizing (EU / UK / US)",
          head: ["EU", "UK (men)", "US (men)"],
          rows: [
            ["40", "6.5", "7"],
            ["41", "7", "8"],
            ["42", "8", "9"],
            ["43", "9", "10"],
            ["44", "9.5", "10.5"],
            ["45", "10.5", "11.5"],
          ],
        },
      },
      {
        heading: "Between sizes?",
        paragraphs: [
          "Measurements are body measurements, not garment measurements — knitwear and denim have a little ease built in. Still unsure? Email fit@yourfashionista.com with your usual size and the style you're eyeing, and a human will answer within a day.",
        ],
      },
    ],
  },
  {
    slug: "contact",
    eyebrow: "We're here",
    title: "Contact Us",
    intro:
      "Real people, seven days a week. Most emails get a reply within a few hours, and always within one business day.",
    sections: [
      {
        heading: "Get in touch",
        bullets: [
          "General: hello@yourfashionista.com",
          "Orders & tracking: orders@yourfashionista.com",
          "Returns: returns@yourfashionista.com",
          "Phone: +1 (555) 018-2245 — Mon–Fri, 9am–6pm ET",
          "Live chat: bottom of any page, 9am–9pm ET daily",
        ],
      },
      {
        heading: "Before you write",
        bullets: [
          "Order not arriving? Have your order number (YF-XXXXXX) to hand.",
          "Sizing question? Our size guide covers most cases.",
          "Press & partnerships: press@yourfashionista.com",
        ],
      },
    ],
  },
  {
    slug: "stores",
    eyebrow: "Visit us",
    title: "Store Locator",
    intro: "Two flagship stores and a studio outlet — come try things on.",
    sections: [
      {
        heading: "New York",
        paragraphs: [
          "214 Lafayette Street, SoHo, New York, NY 10012",
          "Mon–Sat 10am–8pm · Sun 11am–7pm",
        ],
      },
      {
        heading: "Los Angeles",
        paragraphs: [
          "8420 Melrose Avenue, West Hollywood, CA 90069",
          "Mon–Sat 10am–7pm · Sun 11am–6pm",
        ],
      },
      {
        heading: "Studio Outlet — Brooklyn",
        paragraphs: [
          "61 Greenpoint Avenue, Brooklyn, NY 11222",
          "Fri–Sun 12pm–6pm · Sample sale pricing up to 70% off",
        ],
      },
    ],
  },
  {
    slug: "careers",
    eyebrow: "Join us",
    title: "Careers",
    intro: "We're a small team that ships fast and cares about the details. Open roles:",
    sections: [
      {
        heading: "Open positions",
        bullets: [
          "Senior Womenswear Designer — New York (hybrid)",
          "Ecommerce Merchandiser — Remote (US time zones)",
          "Retail Associate — Los Angeles",
          "Fulfilment Coordinator — Brooklyn",
        ],
      },
      {
        heading: "How to apply",
        paragraphs: [
          "Send a CV and a short note about why you'd like to work here to careers@yourfashionista.com with the role in the subject line. We read every application and reply to all within two weeks.",
        ],
      },
    ],
  },
  {
    slug: "sustainability",
    eyebrow: "Responsibility",
    title: "Sustainability",
    intro:
      "We're not going to claim we're perfect. Here's what we do today, and what we're working on next.",
    sections: [
      {
        heading: "Where we are",
        bullets: [
          "78% of our AW26 collection uses natural or recycled fibres",
          "92% of packaging is recyclable or reusable — no single-use plastic in the box",
          "Small-batch production means under 4% of stock is ever marked down",
          "All partner factories are audited annually for wage and safety standards",
        ],
      },
      {
        heading: "What's next",
        bullets: [
          "Per-garment care labels with repair instructions (piloting this season)",
          "A resale and take-back scheme for worn-out Your Fashionista pieces",
          "Cutting shipment air-freight to zero by 2027",
        ],
      },
      {
        heading: "Care longer",
        paragraphs: [
          "The most sustainable garment is the one you already own. Wash cold, line dry, and send anything that needs a fix to our repair partner — we cover stitching and button repairs for two years after purchase.",
        ],
      },
    ],
  },
];

export function getInfoPage(slug: string): InfoPage | undefined {
  return INFO_PAGES.find((p) => p.slug === slug);
}

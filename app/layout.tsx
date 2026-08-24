import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Geist, JetBrains_Mono } from "next/font/google";
// Order matters: tokens define the variables, globals sets the base layer,
// then component sheets override it. See the note at the top of globals.css.
import "./tokens.css";
import "./globals.css";
import "./components.css";
import "./case.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import CommandPaletteLoader from "@/components/CommandPaletteLoader";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { identity, summary } from "@/lib/content";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

const sans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

/**
 * Resolved at BUILD time, not request time — `metadataBase` and the sitemap are
 * both static. Setting the variable on an already-built artifact does nothing,
 * so the warning below is the only chance to catch a bad deploy.
 */
function resolveSite() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  if (process.env.NODE_ENV === "production") {
    console.warn(
      [
        "",
        "[metadata] NEXT_PUBLIC_SITE_URL is not set and no Vercel host was found.",
        "           Canonical URLs, the sitemap and the OG image will point at",
        "           http://localhost:3000 in this build.",
        "",
      ].join("\n"),
    );
  }
  return "http://localhost:3000";
}

const SITE = resolveSite();

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: `${identity.name} — AI Engineer, CEO & Founder of Selvoria AI`,
    template: `%s — ${identity.name}`,
  },
  description: summary.short,
  keywords: [
    "Ammar Ahmed",
    "AI Engineer",
    "Selvoria AI",
    "Selvoria",
    "Machine Learning Engineer",
    "Computer Vision",
    "Multimodal AI",
    "Agentic AI",
    "Zewail City",
    "Egypt",
  ],
  authors: [{ name: identity.name, url: SITE }],
  creator: identity.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE,
    siteName: identity.name,
    title: `${identity.name} — AI Engineer, CEO & Founder of Selvoria AI`,
    description: summary.short,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: `${identity.name} — AI Engineer, CEO & Founder of Selvoria AI`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${identity.name} — AI Engineer, CEO & Founder of Selvoria AI`,
    description: summary.short,
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  // Must match the canvas: the browser paints native scrollbars, form controls
  // and the mobile URL bar from these, and a dark scrollbar on a light page is
  // the first thing a visitor reads as unfinished.
  themeColor: "#FBF7F2",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: identity.name,
  jobTitle: ["AI Engineer", "CEO & Founder of Selvoria AI"],
  email: `mailto:${identity.email}`,
  telephone: identity.phone,
  url: SITE,
  address: {
    "@type": "PostalAddress",
    addressLocality: "6th of October",
    addressRegion: "Giza",
    addressCountry: "EG",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Zewail City of Science and Technology",
  },
  worksFor: [
    { "@type": "Organization", name: "Anthropic" },
    { "@type": "Organization", name: "Selvoria AI" },
  ],
  sameAs: [identity.github, identity.linkedin],
  knowsAbout: [
    "Artificial Intelligence",
    "Deep Learning",
    "Computer Vision",
    "Natural Language Processing",
    "Multimodal Agents",
    "Explainable AI",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <head>
        {/* The travertine tile is the LCP element, but it is referenced from
            CSS, so it is not discovered until the stylesheet has parsed —
            measured at 659ms against 170ms for everything in the markup.
            Preloading it moves the fetch to the front of the queue. The type
            hint means engines without AVIF skip this and pick their own
            variant from the image-set() in globals.css instead. */}
        <link
          rel="preload"
          as="image"
          href="/img/travertine.avif"
          type="image/avif"
          fetchPriority="high"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <a className="skip" href="#main">
          Skip to content
        </a>
        <SmoothScroll>
          <Nav />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </SmoothScroll>
        <CommandPaletteLoader />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}

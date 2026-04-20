import type { Metadata } from "next";
import { Inter, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import SmoothScroll from "@/components/ui/SmoothScroll";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { Analytics } from "@vercel/analytics/next";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";
import "./globals.css";

// Body + UI
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Display face + italic philosophical emphasis (Ravi Klaassens pattern)
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

// Eyebrows, tabular numerals
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://clsolutions.dev"),
  title: {
    default: "CL Solutions — Fast custom websites for serious founders",
    template: "%s — CL Solutions",
  },
  description:
    "An independent boutique studio building fast, custom websites for founders anywhere. Fixed scope. Fixed pricing. Shipped in a week.",
  keywords: [
    "custom website design",
    "boutique web studio",
    "founder websites",
    "Next.js agency",
    "fixed price website",
    "Zurich Helsinki web studio",
    "international web design",
  ],
  authors: [{ name: "CL Solutions" }],
  openGraph: {
    title: "CL Solutions — Fast custom websites for serious founders",
    description:
      "Premium sites for founders anywhere. Fixed pricing, one-week delivery. Zurich · Helsinki base, remote-first.",
    url: "https://clsolutions.dev",
    siteName: "CL Solutions",
    locale: "en",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "CL Solutions — Fast custom websites for serious founders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CL Solutions — Fast custom websites for serious founders",
    description:
      "Premium sites for founders anywhere. Fixed pricing, one-week delivery.",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${plexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[color:var(--paper-dark)] text-[color:var(--ink)]">
        <SmoothScroll />
        <ScrollProgress />
        {children}
        <Analytics />
        <OrganizationJsonLd />
      </body>
    </html>
  );
}

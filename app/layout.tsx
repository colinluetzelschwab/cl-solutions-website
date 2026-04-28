import type { Metadata } from "next";
import { Inter, Instrument_Serif, IBM_Plex_Mono, Geist, Geist_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";
import SmoothScroll from "@/components/ui/SmoothScroll";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { Analytics } from "@vercel/analytics/next";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Geist — the current standard for dev-tool UI (Vercel / Linear / v0).
// Used inside the JARVIS shell only. Public site stays on Inter.
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://clsolutions.dev"),
  title: {
    default: "CL Solutions — Fast custom websites for serious founders",
    template: "%s — CL Solutions",
  },
  description:
    "An independent boutique studio building fast, custom websites for founders anywhere. Fixed scope. Fixed pricing. Shipped in a week.",
  authors: [{ name: "CL Solutions" }],
  openGraph: {
    title: "CL Solutions — Fast custom websites for serious founders",
    description:
      "Premium sites for founders anywhere. Fixed pricing, one-week delivery. Zurich · Helsinki base, remote-first.",
    url: "https://clsolutions.dev",
    siteName: "CL Solutions",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${inter.variable} ${instrumentSerif.variable} ${plexMono.variable} ${geist.variable} ${geistMono.variable} h-full antialiased`}
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

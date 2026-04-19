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

// Pre-hydration theme apply — dark is now the ALTERNATE (light is default).
const themeInitScript = `(function(){try{var t=localStorage.getItem('cls-theme');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL("https://clsolutions.dev"),
  title: {
    default: "CL Solutions — Websites for Swiss businesses",
    template: "%s — CL Solutions",
  },
  description:
    "A boutique Swiss studio building fast, custom websites. Fixed scope. Fixed pricing. Shipped in 3–5 days.",
  keywords: [
    "website design Switzerland",
    "Webdesign Schweiz",
    "Next.js agency",
    "Zurich web agency",
    "fixed price website",
    "Swiss web design",
  ],
  authors: [{ name: "CL Solutions" }],
  openGraph: {
    title: "CL Solutions — Websites for Swiss businesses",
    description:
      "Fast, modern websites for Swiss businesses. Fixed pricing, 3–5 day delivery.",
    url: "https://clsolutions.dev",
    siteName: "CL Solutions",
    locale: "en_CH",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "CL Solutions — Websites for Swiss businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CL Solutions — Websites for Swiss businesses",
    description:
      "Fast, modern websites for Swiss businesses. Fixed pricing, 3–5 day delivery.",
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
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <SmoothScroll />
        <ScrollProgress />
        {children}
        <Analytics />
        <OrganizationJsonLd />
      </body>
    </html>
  );
}

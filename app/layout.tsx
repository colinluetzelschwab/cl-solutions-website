import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { Analytics } from "@vercel/analytics/next";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://clsolutions.dev"),
  title: {
    default: "CL Solutions — Premium Website Design in Switzerland",
    template: "%s — CL Solutions",
  },
  description:
    "Fast, modern websites for Swiss businesses. Fixed pricing, 3–5 day delivery, custom design. Get a quote today.",
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
    title: "CL Solutions — Premium Website Design in Switzerland",
    description:
      "Fast, modern websites for Swiss businesses. Fixed pricing, 3–5 day delivery.",
    url: "https://clsolutions.dev",
    siteName: "CL Solutions",
    locale: "en_CH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CL Solutions — Premium Website Design in Switzerland",
    description:
      "Fast, modern websites for Swiss businesses. Fixed pricing, 3–5 day delivery.",
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
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll />
        {children}
        <Analytics />
        <OrganizationJsonLd />
      </body>
    </html>
  );
}

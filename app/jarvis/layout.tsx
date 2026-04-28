import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  title: "JARVIS — CL Solutions",
  robots: { index: false, follow: false },
  manifest: "/jarvis-manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "JARVIS",
  },
  icons: {
    apple: "/jarvis-icon-192.png",
  },
};

/**
 * JARVIS shell — modern dark master dashboard.
 * - Geist sans for everything, Geist Mono for IDs / timestamps / slugs.
 * - No serif anywhere (Instrument Serif is reserved for the public marketing site).
 * - jarvis-shell namespace scopes typography away from the public site.
 */
export default function JarvisLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="jarvis-shell min-h-screen select-none antialiased"
      style={{
        background: "var(--jarvis-bg)",
        color: "var(--jarvis-text-primary)",
      }}
    >
      {children}
    </div>
  );
}

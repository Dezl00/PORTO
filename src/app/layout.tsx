import type { Metadata } from "next";
import localFont from "next/font/local";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { getAdminSettings } from "@/lib/admin-data";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const ibmPlex = localFont({
  variable: "--font-ibm-plex",
  display: "swap",
  src: [
    { path: "./fonts/ibm-plex-sans-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ibm-plex-sans-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ibm-plex-sans-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/ibm-plex-sans-700.woff2", weight: "700", style: "normal" },
  ],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAdminSettings();
  return {
  metadataBase: new URL(siteUrl),
  title: {
    default: settings.defaultSeoTitle,
    template: "%s — SHOBAKY STUDIO",
  },
  description: settings.defaultSeoDescription,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SHOBAKY STUDIO",
  },
  robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${ibmPlex.variable} h-full`} data-scroll-behavior="smooth">
      <body className="min-h-full bg-white text-black antialiased">{children}<ScrollReveal /></body>
    </html>
  );
}

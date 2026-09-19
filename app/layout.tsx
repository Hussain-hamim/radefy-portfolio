import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const poppins = localFont({
  src: "../public/fonts/Poppins-Medium.ttf",
  variable: "--font-poppins",
  weight: "500",
  display: "swap",
});

const atures = localFont({
  src: "../public/fonts/Atures-700_PERSONAL_USE.ttf",
  variable: "--font-atures",
  weight: "700",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.radefysystems.com"),
  title: {
    default: "Radefy Systems | Software & AI Development Company",
    template: "%s | Radefy Systems",
  },
  description:
    "Radefy Systems is a software company in Khost, Afghanistan. We build custom software, AI-powered systems, web platforms, and apps for businesses.",
  keywords: [
    "software company Afghanistan",
    "software development Khost",
    "AI development company",
    "custom software development",
    "web application development",
    "mobile app development",
    "business software",
    "Radefy Systems",
  ],
  authors: [{ name: "Radefy Systems", url: "https://www.radefysystems.com" }],
  creator: "Radefy Systems",
  publisher: "Radefy Systems",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Radefy Systems",
    title: "Radefy Systems | Software & AI Development Company",
    description:
      "Custom software, web platforms, and applications that simplify operations and bring new products to market. Based in Khost, Afghanistan.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Radefy Systems | Software & AI Development Company",
    description:
      "Custom software, web platforms, and applications that simplify operations and bring new products to market. Based in Khost, Afghanistan.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${atures.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

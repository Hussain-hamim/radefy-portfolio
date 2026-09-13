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
  title: "Radefy Systems | B2B Brand & Web Studio",
  description:
    "A senior B2B brand and web studio. We design brands and the websites that carry them, then help both grow.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
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

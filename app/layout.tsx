import type { Metadata } from "next";
import { EB_Garamond, Inter, Frank_Ruhl_Libre } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const serif = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const hebrew = Frank_Ruhl_Libre({
  subsets: ["hebrew"],
  weight: ["400", "500", "700"],
  variable: "--font-hebrew",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dvar of the Week",
    template: "%s · Dvar of the Week",
  },
  description:
    "A short, thoughtful Dvar Torah on the weekly Parsha — designed to be told over at the Shabbat table in three to five minutes.",
  openGraph: {
    title: "Dvar of the Week",
    description:
      "A short, thoughtful Dvar Torah on the weekly Parsha — designed to be told over at the Shabbat table in three to five minutes.",
    type: "website",
    siteName: "Dvar of the Week",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dvar of the Week",
    description:
      "A short, thoughtful Dvar Torah on the weekly Parsha — designed to be told over at the Shabbat table in three to five minutes.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${hebrew.variable}`}
    >
      <body className="min-h-screen">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

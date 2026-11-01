import type { Metadata } from "next";
import { Manrope, Source_Sans_3 } from "next/font/google";
import { siteConfig } from "@/config/constants";
import "./globals.css";
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});
export const metadata: Metadata = {
  title: {
    default: "GVS Live Stream | Every moment, shared live.",
    template: "%s | GVS Live Stream",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  icons: { icon: "/favicon.ico" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${sourceSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}

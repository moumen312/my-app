import type { Metadata } from "next";
import { Syne, DM_Sans,Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument",
  style: ["normal", "italic"],
});
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "T.E.C.H.Y",
  description: "Shop now — Pick, Order, Ready in less than 48 Hours.",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      
      <body  className={`${inter.className} ${syne.variable} ${dmSans.variable} ${instrumentSerif.variable} `}>{children}</body>
    </html>
  );
}
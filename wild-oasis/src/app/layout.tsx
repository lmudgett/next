import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  // Pages set their own title; it composes into this template.
  title: {
    default: "The Wild Oasis",
    template: "%s · The Wild Oasis",
  },
  description:
    "Staff dashboard for managing cabins, bookings, guests, and settings at The Wild Oasis hotel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.className}>
      <body>{children}</body>
    </html>
  );
}

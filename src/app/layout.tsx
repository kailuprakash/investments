import type { Metadata } from "next";
import type { ReactNode } from "react";
// Carlito is metric-compatible with Calibri, so self-hosting it guarantees the
// workbook renders with the same advance widths on Linux/Android (where Calibri
// itself is not installed) as it does on Windows/Office machines.
import "@fontsource/carlito/400.css";
import "@fontsource/carlito/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio Tracker - Excel Financial Workbook",
  description:
    "Live portfolio application linking Daily Transactions, Consolidated View - Account Level, and Account's Summary with real-time market data.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/workbook-exact.css" />
      </head>
      <body className="bg-slate-100 text-slate-900 antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import PortfolioLogin from "@/components/PortfolioLogin";

export const metadata: Metadata = {
  title: "Sign in | Portfolio Tracker",
  description: "Secure access to the private portfolio ledger.",
};

export default function LoginPage() {
  return <PortfolioLogin />;
}

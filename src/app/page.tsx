import { redirect } from "next/navigation";
import PortfolioApp from "@/components/PortfolioApp";
import { authStatus } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { authenticated } = await authStatus();
  if (!authenticated) redirect("/login");
  return <PortfolioApp />;
}

import { redirect } from "next/navigation";
import PortfolioLogin from "@/components/PortfolioLogin";
import { authStatus } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const status = await authStatus();
  if (status.authenticated) redirect("/");

  const params = await searchParams;
  const rawError = Array.isArray(params.error) ? params.error[0] : params.error;
  const error = rawError?.slice(0, 240);

  return <PortfolioLogin configured={status.configured} error={error} />;
}

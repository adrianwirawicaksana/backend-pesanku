import VerifyForm from "./VerifyForm";

export const dynamic = "force-dynamic";

type ForgotPasswordVerifyPageProps = {
  searchParams?: Promise<{ email?: string | string[] }>;
};

export default async function ForgotPasswordVerifyPage({ searchParams }: ForgotPasswordVerifyPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialEmail = Array.isArray(resolvedSearchParams?.email)
    ? resolvedSearchParams.email[0] ?? ""
    : resolvedSearchParams?.email ?? "";

  return <VerifyForm initialEmail={initialEmail} />;
}

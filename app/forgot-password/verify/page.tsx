import VerifyForm from "./VerifyForm";

export const dynamic = "force-dynamic";

type ForgotPasswordVerifyPageProps = {
  searchParams?: {
    email?: string | string[];
  };
};

export default function ForgotPasswordVerifyPage({ searchParams }: ForgotPasswordVerifyPageProps) {
  const initialEmail = Array.isArray(searchParams?.email)
    ? searchParams?.email[0] ?? ""
    : searchParams?.email ?? "";

  return <VerifyForm initialEmail={initialEmail} />;
}

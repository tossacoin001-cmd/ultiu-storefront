import Link from "next/link";
import { confirmSignup } from "@/lib/data/customer";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  const error = code
    ? (await confirmSignup(code)).error
    : "This confirmation link is missing its code. Please use the link from your email.";

  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="font-headline text-3xl font-medium tracking-tight text-ink">
        Confirm your email
      </h1>
      <p className="mt-3 text-graphite">{error}</p>
      <div className="mt-8">
        <Link href="/account/register" className="text-signal hover:underline">
          Back to sign up
        </Link>
      </div>
    </div>
  );
}

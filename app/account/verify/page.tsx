"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { confirmSignup } from "@/lib/data/customer";

function VerifyContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!code) {
      setError("This confirmation link is missing its code. Please use the link from your email.");
      setChecking(false);
      return;
    }

    // confirmSignup redirects to /account on success (thrown internally by
    // Next.js's redirect()), so there's nothing to handle here but the
    // error case. Must be called from client code, not awaited directly
    // during a Server Component's render: cookies().set() (setting the
    // session) is only allowed inside a genuine Server Action invocation.
    confirmSignup(code).then((result) => {
      if (result?.error) {
        setError(result.error);
        setChecking(false);
      }
    });
  }, [code]);

  if (checking) {
    return <p className="mt-3 text-graphite">Confirming your email…</p>;
  }

  return <p className="mt-3 text-graphite">{error}</p>;
}

export default function VerifyPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="font-headline text-3xl font-medium tracking-tight text-ink">
        Confirm your email
      </h1>

      <Suspense fallback={<p className="mt-3 text-graphite">Confirming your email…</p>}>
        <VerifyContent />
      </Suspense>

      <div className="mt-8">
        <Link href="/account/register" className="text-signal hover:underline">
          Back to sign up
        </Link>
      </div>
    </div>
  );
}

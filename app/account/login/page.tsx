"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginCustomer } from "@/lib/data/customer";
import { FormSubmitButton } from "@/components/form-submit-button";

export default function LoginPage() {
  const [state, formAction] = useActionState(loginCustomer, { error: null });

  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <h1 className="font-headline text-3xl font-medium tracking-tight text-ink text-center">
        Sign In
      </h1>
      <p className="mt-3 text-center text-graphite">
        Welcome back. Sign in to track orders and manage your account.
      </p>

      <form action={formAction} className="mt-10 space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full rounded border border-silver px-3 py-2 text-sm"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="w-full rounded border border-silver px-3 py-2 text-sm"
        />
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        <FormSubmitButton
          idleLabel="Sign In"
          pendingLabel="Signing in…"
          size="lg"
          className="w-full bg-deep text-white hover:bg-deep/90"
        />
      </form>

      <div className="mt-6 flex items-center justify-between text-sm">
        <Link href="/account/reset-password" className="text-signal hover:underline">
          Forgot password?
        </Link>
        <Link href="/account/register" className="text-signal hover:underline">
          Create account
        </Link>
      </div>
    </div>
  );
}

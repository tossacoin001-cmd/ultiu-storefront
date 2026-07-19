"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerCustomer } from "@/lib/data/customer";
import { FormSubmitButton } from "@/components/form-submit-button";

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerCustomer, { error: null });

  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <h1 className="font-headline text-3xl font-medium tracking-tight text-ink text-center">
        Create Account
      </h1>
      <p className="mt-3 text-center text-graphite">
        Join ULTIU to track orders, save designs, and check out faster.
      </p>

      <form action={formAction} className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          type="text"
          name="first_name"
          placeholder="First name"
          required
          className="rounded border border-silver px-3 py-2 text-sm"
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last name"
          required
          className="rounded border border-silver px-3 py-2 text-sm"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="sm:col-span-2 rounded border border-silver px-3 py-2 text-sm"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          minLength={8}
          className="sm:col-span-2 rounded border border-silver px-3 py-2 text-sm"
        />
        {state.error && <p className="sm:col-span-2 text-sm text-red-600">{state.error}</p>}
        <FormSubmitButton
          idleLabel="Create Account"
          pendingLabel="Creating account…"
          size="lg"
          className="sm:col-span-2 bg-deep text-white hover:bg-deep/90"
        />
      </form>

      <p className="mt-6 text-center text-sm text-graphite">
        Already have an account?{" "}
        <Link href="/account/login" className="text-signal hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

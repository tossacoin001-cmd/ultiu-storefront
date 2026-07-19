"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  requestCustomerPasswordReset,
  confirmCustomerPasswordReset,
} from "@/lib/data/customer";
import { FormSubmitButton } from "@/components/form-submit-button";

function RequestResetForm() {
  const [state, formAction] = useActionState(requestCustomerPasswordReset, {
    error: null,
    submitted: false,
  });

  if (state.submitted && !state.error) {
    return (
      <p className="mt-10 text-center text-graphite">
        If an account exists for that email, a reset link is on its way.
        Check your inbox.
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-10 space-y-4">
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="w-full rounded border border-silver px-3 py-2 text-sm"
      />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <FormSubmitButton
        idleLabel="Send Reset Link"
        pendingLabel="Sending…"
        size="lg"
        className="w-full bg-deep text-white hover:bg-deep/90"
      />
    </form>
  );
}

function ConfirmResetForm({ token }: { token: string }) {
  const [state, formAction] = useActionState(confirmCustomerPasswordReset, {
    error: null,
  });

  return (
    <form action={formAction} className="mt-10 space-y-4">
      <input type="hidden" name="token" value={token} />
      <input
        type="password"
        name="password"
        placeholder="New password"
        required
        minLength={8}
        className="w-full rounded border border-silver px-3 py-2 text-sm"
      />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <FormSubmitButton
        idleLabel="Reset Password"
        pendingLabel="Resetting…"
        size="lg"
        className="w-full bg-deep text-white hover:bg-deep/90"
      />
    </form>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <>
      <p className="mt-3 text-center text-graphite">
        {token
          ? "Choose a new password below."
          : "Enter your email and we'll send you a reset link."}
      </p>

      {token ? <ConfirmResetForm token={token} /> : <RequestResetForm />}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <h1 className="font-headline text-3xl font-medium tracking-tight text-ink text-center">
        Reset Password
      </h1>

      <Suspense fallback={null}>
        <ResetPasswordContent />
      </Suspense>

      <p className="mt-6 text-center text-sm text-graphite">
        <Link href="/account/login" className="text-signal hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}

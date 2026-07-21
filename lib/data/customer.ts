"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sdk } from "@/lib/medusa";

const CUSTOMER_TOKEN_COOKIE = "ultiu_customer_token";
const PENDING_SIGNUP_COOKIE = "ultiu_pending_signup";

export type AuthActionState = { error: string | null };
export type ResetRequestState = { error: string | null; submitted: boolean };
export type RegisterActionState = { error: string | null; pendingVerification: boolean };

type PendingSignup = {
  email: string;
  first_name: string;
  last_name: string;
  registrationToken: string;
};

async function setCustomerToken(token: string) {
  (await cookies()).set(CUSTOMER_TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

async function getCustomerToken() {
  return (await cookies()).get(CUSTOMER_TOKEN_COOKIE)?.value ?? null;
}

async function setPendingSignup(pending: PendingSignup) {
  (await cookies()).set(PENDING_SIGNUP_COOKIE, JSON.stringify(pending), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 30,
    path: "/",
  });
}

async function getPendingSignup(): Promise<PendingSignup | null> {
  const raw = (await cookies()).get(PENDING_SIGNUP_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingSignup;
  } catch {
    return null;
  }
}

async function clearPendingSignup() {
  (await cookies()).delete(PENDING_SIGNUP_COOKIE);
}

export async function retrieveCustomer() {
  const token = await getCustomerToken();
  if (!token) return null;

  try {
    const { customer } = await sdk.store.customer.retrieve(
      {},
      { Authorization: `Bearer ${token}` }
    );
    return customer;
  } catch {
    return null;
  }
}

export async function registerCustomer(
  _prevState: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const first_name = (formData.get("first_name") as string)?.trim();
  const last_name = (formData.get("last_name") as string)?.trim();

  if (!email || !password || !first_name || !last_name) {
    return { error: "Please fill in all fields.", pendingVerification: false };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters.", pendingVerification: false };
  }

  try {
    const registrationToken = await sdk.auth.register("customer", "emailpass", {
      email,
      password,
    });

    // Don't create the customer yet: gate on confirming the email first.
    // sdk.auth.verification.request needs the registration token as the
    // caller's identity, and the code is only ever delivered via the
    // auth.verification_requested event (email), never in this response.
    await sdk.auth.verification.request(
      { entity_id: email, entity_type: "email" },
      { Authorization: `Bearer ${registrationToken}` }
    );

    await setPendingSignup({ email, first_name, last_name, registrationToken });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.toLowerCase().includes("already")) {
      return {
        error: "An account with this email already exists.",
        pendingVerification: false,
      };
    }
    return {
      error: "Couldn't start creating your account. Please try again.",
      pendingVerification: false,
    };
  }

  return { error: null, pendingVerification: true };
}

export async function confirmSignup(code: string): Promise<AuthActionState> {
  let entityId: string;
  try {
    const result = await sdk.auth.verification.confirm({ code });
    entityId = result.entity_id;
  } catch {
    return { error: "This confirmation link is invalid or has expired." };
  }

  const pending = await getPendingSignup();
  if (!pending || pending.email !== entityId) {
    return {
      error:
        "Your email is confirmed, but this browser doesn't have your signup details anymore. Please open the confirmation link on the same device and browser you signed up with.",
    };
  }

  try {
    await sdk.store.customer.create(
      { email: pending.email, first_name: pending.first_name, last_name: pending.last_name },
      {},
      { Authorization: `Bearer ${pending.registrationToken}` }
    );

    const refreshed = await sdk.auth.refresh({
      Authorization: `Bearer ${pending.registrationToken}`,
    });
    if (!("token" in refreshed) || !refreshed.token) {
      return { error: "Account created, but signing in needs an extra step. Try signing in manually." };
    }
    const token = refreshed.token;

    await setCustomerToken(token);
    await clearPendingSignup();
  } catch {
    return { error: "Couldn't finish creating your account. Please try again." };
  }

  redirect("/account");
}

export async function loginCustomer(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  let token: string;
  try {
    const result = await sdk.auth.login("customer", "emailpass", { email, password });
    if (typeof result !== "string") {
      return { error: "Sign-in requires an extra step that isn't supported here yet." };
    }
    token = result;
  } catch {
    return { error: "Incorrect email or password." };
  }

  await setCustomerToken(token);
  redirect("/account");
}

export async function logoutCustomer() {
  (await cookies()).delete(CUSTOMER_TOKEN_COOKIE);
  redirect("/");
}

export async function requestCustomerPasswordReset(
  _prevState: ResetRequestState,
  formData: FormData
): Promise<ResetRequestState> {
  const email = (formData.get("email") as string)?.trim();
  if (!email) return { error: "Please enter your email.", submitted: false };

  try {
    await sdk.auth.resetPassword("customer", "emailpass", { identifier: email });
  } catch {
    // Don't leak whether the email exists either way.
  }

  return { error: null, submitted: true };
}

export async function confirmCustomerPasswordReset(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;

  if (!token) {
    return { error: "This reset link is invalid or has expired." };
  }
  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  try {
    await sdk.auth.updateProvider("customer", "emailpass", { password }, token);
  } catch {
    return { error: "This reset link is invalid or has expired." };
  }

  redirect("/account/login");
}

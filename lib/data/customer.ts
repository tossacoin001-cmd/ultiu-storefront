"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sdk } from "@/lib/medusa";

const CUSTOMER_TOKEN_COOKIE = "ultiu_customer_token";

export type AuthActionState = { error: string | null };
export type ResetRequestState = { error: string | null; submitted: boolean };

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
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const first_name = (formData.get("first_name") as string)?.trim();
  const last_name = (formData.get("last_name") as string)?.trim();

  if (!email || !password || !first_name || !last_name) {
    return { error: "Please fill in all fields." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  try {
    const registrationToken = await sdk.auth.register("customer", "emailpass", {
      email,
      password,
    });

    await sdk.store.customer.create(
      { email, first_name, last_name },
      {},
      { Authorization: `Bearer ${registrationToken}` }
    );

    const loginResult = await sdk.auth.login("customer", "emailpass", {
      email,
      password,
    });
    if (typeof loginResult !== "string") {
      return {
        error: "Account created, but signing in needs an extra step. Try signing in manually.",
      };
    }
    await setCustomerToken(loginResult);
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.toLowerCase().includes("already")) {
      return { error: "An account with this email already exists." };
    }
    return { error: "Couldn't create your account. Please try again." };
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

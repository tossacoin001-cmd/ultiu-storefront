import Medusa from "@medusajs/js-sdk";

export const sdk = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL!,
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
  // Server Components/Actions run one-off in Node, no localStorage. Tokens
  // are self-managed via httpOnly cookies (see lib/data/customer.ts) and
  // passed explicitly per request instead.
  auth: { jwtTokenStorageMethod: "nostore" },
});

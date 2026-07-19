import Link from "next/link";
import { retrieveCustomer, logoutCustomer } from "@/lib/data/customer";
import { buttonVariants } from "@/components/ui/button";

export default async function AccountPage() {
  const customer = await retrieveCustomer();

  if (!customer) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="font-headline text-3xl font-medium tracking-tight text-ink">
          Sign in to ULTIU
        </h1>
        <p className="mt-3 text-graphite">
          Sign in to track orders, save your paddle designs, and check out
          faster.
        </p>

        <div className="mt-10 space-y-3">
          <Link
            href="/account/login"
            className={buttonVariants({
              size: "lg",
              className: "w-full bg-deep text-white hover:bg-deep/90",
            })}
          >
            Sign In
          </Link>
          <Link
            href="/account/register"
            className={buttonVariants({
              size: "lg",
              variant: "outline",
              className: "w-full",
            })}
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="font-headline text-3xl font-medium tracking-tight text-ink">
        Hi, {customer.first_name}
      </h1>
      <p className="mt-2 text-graphite">{customer.email}</p>

      <div className="mt-10 space-y-4">
        <div className="rounded border border-silver p-6">
          <h2 className="text-sm font-medium text-ink">Orders</h2>
          <p className="mt-2 text-sm text-graphite">
            Your order history will show up here once you place an order.
          </p>
        </div>

        <form action={logoutCustomer}>
          <button
            type="submit"
            className="text-sm text-graphite underline-offset-4 hover:text-ink hover:underline"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}

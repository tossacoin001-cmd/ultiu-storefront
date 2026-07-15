import { Button } from "@/components/ui/button";

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="font-headline text-3xl font-medium tracking-tight text-ink">
        Sign in to ULTIU
      </h1>
      <p className="mt-3 text-graphite">
        Accounts aren&apos;t live yet. Check back soon to sign in, track orders,
        and save your paddle designs.
      </p>

      <div className="mt-10 space-y-3">
        <Button
          size="lg"
          disabled
          className="w-full bg-deep text-white hover:bg-deep/90"
        >
          Sign In
        </Button>
        <Button size="lg" variant="outline" disabled className="w-full">
          Create Account
        </Button>
      </div>
    </div>
  );
}

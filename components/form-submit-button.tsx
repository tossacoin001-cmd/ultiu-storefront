"use client";

import { useFormStatus } from "react-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

export function FormSubmitButton({
  idleLabel,
  pendingLabel,
  className,
  size,
}: {
  idleLabel: string;
  pendingLabel: string;
  className?: string;
  size?: VariantProps<typeof buttonVariants>["size"];
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size={size} disabled={pending} className={className}>
      {pending ? pendingLabel : idleLabel}
    </Button>
  );
}

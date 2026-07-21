"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { FormState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
  withName?: boolean;
  footer: { text: string; linkLabel: string; href: string };
};

export function AuthForm({ action, submitLabel, withName, footer }: Props) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-4">
      {withName && (
        <div className="space-y-2">
          <Label htmlFor="name">İsim</Label>
          <Input id="name" name="name" autoComplete="name" placeholder="Zeki" />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">E-posta</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="zeki@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Şifre</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={withName ? "new-password" : "current-password"}
        />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Gönderiliyor..." : submitLabel}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {footer.text}{" "}
        <Link href={footer.href} className="text-foreground underline underline-offset-4">
          {footer.linkLabel}
        </Link>
      </p>
    </form>
  );
}

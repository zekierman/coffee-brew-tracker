"use server";

import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { validateCredentials } from "@/lib/validation";

export type FormState = { error: string } | null;

export async function register(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const parsed = validateCredentials(email, password);
  if (!parsed.ok) return { error: parsed.error };

  const existing = await db.query.users.findFirst({ where: eq(users.email, parsed.email) });
  if (existing) return { error: "Bu e-posta zaten kayıtlı." };

  const name = formData.get("name");
  await db.insert(users).values({
    email: parsed.email,
    passwordHash: await hash(password as string, 10),
    name: typeof name === "string" && name.trim() ? name.trim() : null,
  });

  await signIn("credentials", {
    email: parsed.email,
    password,
    redirectTo: "/dashboard",
  });
  return null;
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    // ponytail: tum credentials hatalari tek mesaja duser, hangi alanin yanlis
    // oldugunu sizdirmamak icin bilerek boyle.
    if (error instanceof AuthError) return { error: "E-posta veya şifre hatalı." };
    throw error;
  }
  return null;
}

export async function logout() {
  await signOut({ redirect: false });
  redirect("/login");
}

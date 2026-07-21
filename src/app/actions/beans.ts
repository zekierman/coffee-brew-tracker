"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { coffeeBeans } from "@/db/schema";
import { parseBeanForm } from "@/lib/beans";
import { requireUserId } from "@/lib/session";

export type FormState = { error: string } | null;

export async function saveBean(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const parsed = parseBeanForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  const id = formData.get("id");
  if (typeof id === "string" && id) {
    await db
      .update(coffeeBeans)
      .set(parsed.value)
      .where(and(eq(coffeeBeans.id, id), eq(coffeeBeans.userId, userId)));
  } else {
    await db.insert(coffeeBeans).values({ ...parsed.value, userId });
  }

  revalidatePath("/beans");
  revalidatePath("/dashboard");
  return null;
}

export async function deleteBean(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  await db.delete(coffeeBeans).where(and(eq(coffeeBeans.id, id), eq(coffeeBeans.userId, userId)));
  revalidatePath("/beans");
  revalidatePath("/dashboard");
}

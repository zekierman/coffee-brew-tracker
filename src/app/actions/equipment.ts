"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { equipment } from "@/db/schema";
import { parseEquipmentForm } from "@/lib/equipment";
import { requireUserId } from "@/lib/session";

export type FormState = { error: string } | null;

export async function saveEquipment(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const parsed = parseEquipmentForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  const id = formData.get("id");
  if (typeof id === "string" && id) {
    // userId kosulu sart: baskasinin kaydini guncellemeyi engeller.
    await db
      .update(equipment)
      .set(parsed.value)
      .where(and(eq(equipment.id, id), eq(equipment.userId, userId)));
  } else {
    await db.insert(equipment).values({ ...parsed.value, userId });
  }

  revalidatePath("/equipment");
  return null;
}

export async function deleteEquipment(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  await db.delete(equipment).where(and(eq(equipment.id, id), eq(equipment.userId, userId)));
  revalidatePath("/equipment");
}

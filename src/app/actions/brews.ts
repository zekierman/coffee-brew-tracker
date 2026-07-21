"use server";

import { and, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { brews, coffeeBeans, equipment, recipes, tastingNotes } from "@/db/schema";
import { parseBrewForm } from "@/lib/brews";
import { requireUserId } from "@/lib/session";

export type FormState = { error: string } | null;

/**
 * Formdan gelen bean/equipment id'leri kullaniciya ait mi? Degilse baska bir
 * kullanicinin kaydina referans verilmis olur; o alanlari dusuruyoruz.
 */
async function keepOwnedRefs(
  userId: string,
  refs: { beanId: string | null; grinderId: string | null; dripperId: string | null },
) {
  const equipmentIds = [refs.grinderId, refs.dripperId].filter((id): id is string => id !== null);

  const [ownedBeans, ownedEquipment] = await Promise.all([
    refs.beanId
      ? db
          .select({ id: coffeeBeans.id })
          .from(coffeeBeans)
          .where(and(eq(coffeeBeans.id, refs.beanId), eq(coffeeBeans.userId, userId)))
      : Promise.resolve([]),
    equipmentIds.length
      ? db
          .select({ id: equipment.id })
          .from(equipment)
          .where(and(inArray(equipment.id, equipmentIds), eq(equipment.userId, userId)))
      : Promise.resolve([]),
  ]);

  const ownedEquipmentIds = new Set(ownedEquipment.map((row) => row.id));
  return {
    beanId: ownedBeans.length ? refs.beanId : null,
    grinderId: refs.grinderId && ownedEquipmentIds.has(refs.grinderId) ? refs.grinderId : null,
    dripperId: refs.dripperId && ownedEquipmentIds.has(refs.dripperId) ? refs.dripperId : null,
  };
}

export async function saveBrew(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const parsed = parseBrewForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  const refs = await keepOwnedRefs(userId, parsed.brew);
  const values = { ...parsed.brew, ...refs };

  const id = formData.get("id");
  let brewId: string;

  if (typeof id === "string" && id) {
    const [updated] = await db
      .update(brews)
      .set(values)
      .where(and(eq(brews.id, id), eq(brews.userId, userId)))
      .returning({ id: brews.id });
    if (!updated) return { error: "Demleme bulunamadı." };
    brewId = updated.id;
  } else {
    const [created] = await db
      .insert(brews)
      .values({ ...values, userId })
      .returning({ id: brews.id });
    brewId = created.id;
  }

  if (parsed.hasNote) {
    await db
      .insert(tastingNotes)
      .values({ ...parsed.note, brewId })
      .onConflictDoUpdate({ target: tastingNotes.brewId, set: parsed.note });
  } else {
    await db.delete(tastingNotes).where(eq(tastingNotes.brewId, brewId));
  }

  // Stok dusumu sadece yeni kayitta: duzenlemede iki kez dusmesin.
  const isNew = !(typeof id === "string" && id);
  if (isNew && refs.beanId && values.doseG) {
    await db
      .update(coffeeBeans)
      .set({ stockG: sql`greatest(${coffeeBeans.stockG} - ${values.doseG}, 0)` })
      .where(
        and(
          eq(coffeeBeans.id, refs.beanId),
          eq(coffeeBeans.userId, userId),
          isNotNull(coffeeBeans.stockG),
        ),
      );
  }

  revalidatePath("/dashboard");
  revalidatePath("/beans");
  revalidatePath("/stats");
  redirect("/dashboard");
}

export async function toggleFavorite(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  await db
    .update(brews)
    .set({ isFavorite: sql`not ${brews.isFavorite}` })
    .where(and(eq(brews.id, id), eq(brews.userId, userId)));
  revalidatePath("/dashboard");
}

/** Yeni demleme formunu doldurmak icin kayitli tarif. */
export async function saveRecipe(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const name = formData.get("name");
  if (typeof name !== "string" || !name.trim()) return { error: "Tarif adı zorunlu." };

  const parsed = parseBrewForm(formData);
  if (!parsed.ok) return { error: parsed.error };
  const refs = await keepOwnedRefs(userId, parsed.brew);

  await db.insert(recipes).values({
    userId,
    name: name.trim().slice(0, 120),
    method: parsed.brew.method,
    grinderId: refs.grinderId,
    dripperId: refs.dripperId,
    grindClicks: parsed.brew.grindClicks,
    waterTempC: parsed.brew.waterTempC,
    doseG: parsed.brew.doseG,
    waterG: parsed.brew.waterG,
    brewTimeSeconds: parsed.brew.brewTimeSeconds,
  });

  revalidatePath("/recipes");
  revalidatePath("/brews/new");
  return null;
}

export async function deleteRecipe(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  await db.delete(recipes).where(and(eq(recipes.id, id), eq(recipes.userId, userId)));
  revalidatePath("/recipes");
}

export async function deleteBrew(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  await db.delete(brews).where(and(eq(brews.id, id), eq(brews.userId, userId)));
  revalidatePath("/dashboard");
}

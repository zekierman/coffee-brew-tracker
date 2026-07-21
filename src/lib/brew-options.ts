import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { coffeeBeans, equipment } from "@/db/schema";

/** Demleme formundaki secim listeleri — hepsi kullaniciya kapsamli. */
export async function loadBrewOptions(userId: string) {
  const [beans, allEquipment] = await Promise.all([
    db
      .select({ id: coffeeBeans.id, name: coffeeBeans.name })
      .from(coffeeBeans)
      .where(eq(coffeeBeans.userId, userId))
      .orderBy(asc(coffeeBeans.name)),
    db
      .select({ id: equipment.id, name: equipment.name, type: equipment.type })
      .from(equipment)
      .where(eq(equipment.userId, userId))
      .orderBy(asc(equipment.name)),
  ]);

  return {
    beans,
    // Kettle/terazi gibi tipler de secilebilsin diye grinder/dripper disindakiler
    // her iki listede de gosteriliyor.
    grinders: allEquipment.filter((item) => item.type !== "dripper"),
    drippers: allEquipment.filter((item) => item.type !== "grinder"),
  };
}

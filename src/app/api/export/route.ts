import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { brews, coffeeBeans, equipment } from "@/db/schema";
import { formatBrewTime } from "@/lib/brews";
import { toCsv } from "@/lib/csv";
import { requireUserId } from "@/lib/session";

export async function GET(request: Request) {
  const userId = await requireUserId();
  const format = new URL(request.url).searchParams.get("format") === "json" ? "json" : "csv";

  const [brewRows, beanRows, equipmentRows] = await Promise.all([
    db.query.brews.findMany({
      where: eq(brews.userId, userId),
      orderBy: desc(brews.brewedAt),
      with: { tastingNote: true, bean: true, grinder: true, dripper: true },
    }),
    db.select().from(coffeeBeans).where(eq(coffeeBeans.userId, userId)),
    db.select().from(equipment).where(eq(equipment.userId, userId)),
  ]);

  const stamp = new Date().toISOString().slice(0, 10);

  if (format === "json") {
    const payload = {
      exportedAt: new Date().toISOString(),
      brews: brewRows,
      beans: beanRows,
      equipment: equipmentRows,
    };
    return new Response(JSON.stringify(payload, null, 2), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "content-disposition": `attachment; filename="brewlog-${stamp}.json"`,
      },
    });
  }

  const flat = brewRows.map((brew) => ({
    tarih: brew.brewedAt.toISOString(),
    cekirdek: brew.bean?.name ?? "",
    ulke: brew.bean?.country ?? "",
    kavurucu: brew.bean?.roaster ?? "",
    degirmen: brew.grinder?.name ?? "",
    dripper: brew.dripper?.name ?? "",
    yontem: brew.method ?? "",
    ogutum_click: brew.grindClicks ?? "",
    su_sicakligi_c: brew.waterTempC ?? "",
    kahve_g: brew.doseG ?? "",
    su_g: brew.waterG ?? "",
    sure: brew.brewTimeSeconds === null ? "" : formatBrewTime(brew.brewTimeSeconds),
    sure_saniye: brew.brewTimeSeconds ?? "",
    puan: brew.rating ?? "",
    favori: brew.isFavorite ? "evet" : "hayir",
    etiketler: brew.tags?.join(" ") ?? "",
    aroma: brew.tastingNote?.aroma ?? "",
    tat: brew.tastingNote?.flavor ?? "",
    asitlik: brew.tastingNote?.acidity ?? "",
    govde: brew.tastingNote?.body ?? "",
    tatlilik: brew.tastingNote?.sweetness ?? "",
    bitis: brew.tastingNote?.aftertaste ?? "",
  }));

  return new Response(toCsv(flat), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="brewlog-${stamp}.csv"`,
    },
  });
}

import { and, desc, eq, gte, ilike, type SQL } from "drizzle-orm";
import Link from "next/link";
import { deleteBrew } from "@/app/actions/brews";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/db";
import { brews } from "@/db/schema";
import { brewRatio, formatBrewTime } from "@/lib/brews";
import { loadBrewOptions } from "@/lib/brew-options";
import { requireUserId } from "@/lib/session";

const selectClass =
  "border-input bg-transparent dark:bg-input/30 h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const userId = await requireUserId();
  const params = await searchParams;
  const beanFilter = first(params.bean);
  const methodFilter = first(params.method);
  const ratingFilter = Number(first(params.rating)) || 0;

  // userId kosulu her zaman ilk sirada; filtreler sadece ustune biner.
  const conditions: SQL[] = [eq(brews.userId, userId)];
  if (beanFilter) conditions.push(eq(brews.beanId, beanFilter));
  if (methodFilter) conditions.push(ilike(brews.method, `%${methodFilter}%`));
  if (ratingFilter >= 1 && ratingFilter <= 5) conditions.push(gte(brews.rating, ratingFilter));

  const [rows, { beans }] = await Promise.all([
    db.query.brews.findMany({
      where: and(...conditions),
      orderBy: desc(brews.brewedAt),
      with: { tastingNote: true, bean: true, grinder: true, dripper: true },
      limit: 100,
    }),
    loadBrewOptions(userId),
  ]);

  const isFiltered = Boolean(beanFilter || methodFilter || ratingFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Demlemeler</h1>
          <p className="text-muted-foreground">
            {rows.length} kayıt{isFiltered && " (filtreli)"}
          </p>
        </div>
        <Link href="/brews/new" className={buttonVariants()}>
          Yeni demleme
        </Link>
      </div>

      {/* ponytail: filtreler native GET formu — durum URL'de, client state yok,
          sonuc paylasilabilir/yer imlenebilir. */}
      <Card>
        <CardContent className="pt-6">
          <form method="get" className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="bean">Çekirdek</Label>
              <select id="bean" name="bean" defaultValue={beanFilter} className={selectClass}>
                <option value="">Hepsi</option>
                {beans.map((bean) => (
                  <option key={bean.id} value={bean.id}>
                    {bean.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Yöntem</Label>
              <Input id="method" name="method" defaultValue={methodFilter} placeholder="V60" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">En az puan</Label>
              <select
                id="rating"
                name="rating"
                defaultValue={ratingFilter || ""}
                className={selectClass}
              >
                <option value="">Hepsi</option>
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {"★".repeat(value)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <Button type="submit">Filtrele</Button>
              {isFiltered && (
                <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
                  Temizle
                </Link>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {rows.length === 0 ? (
        <p className="text-muted-foreground">
          {isFiltered ? "Filtreye uyan demleme yok." : "Henüz demleme kaydetmedin."}
        </p>
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {rows.map((brew) => {
            const params = [
              brew.grindClicks !== null && `${brew.grindClicks} tık`,
              brew.waterTempC && `${brew.waterTempC} °C`,
              brew.brewTimeSeconds !== null && formatBrewTime(brew.brewTimeSeconds),
              brewRatio(brew.doseG, brew.waterG),
              brew.doseG && brew.waterG && `${brew.doseG}g / ${brew.waterG}g`,
            ].filter(Boolean) as string[];

            const notes = brew.tastingNote
              ? ([
                  brew.tastingNote.aroma && ["Aroma", brew.tastingNote.aroma],
                  brew.tastingNote.flavor && ["Tat", brew.tastingNote.flavor],
                  brew.tastingNote.acidity && ["Asitlik", brew.tastingNote.acidity],
                  brew.tastingNote.body && ["Gövde", brew.tastingNote.body],
                  brew.tastingNote.sweetness && ["Tatlılık", brew.tastingNote.sweetness],
                  brew.tastingNote.aftertaste && ["Bitiş", brew.tastingNote.aftertaste],
                ].filter(Boolean) as [string, string][])
              : [];

            return (
              <li key={brew.id}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex flex-wrap items-baseline justify-between gap-2">
                      <span>{brew.bean?.name ?? brew.method ?? "Demleme"}</span>
                      {brew.rating !== null && (
                        <span className="text-sm font-normal text-amber-500" title={`${brew.rating}/5`}>
                          {"★".repeat(brew.rating)}
                          <span className="text-muted-foreground/40">
                            {"★".repeat(5 - brew.rating)}
                          </span>
                        </span>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {brew.brewedAt.toLocaleString("tr-TR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                      {brew.method && ` · ${brew.method}`}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {params.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {params.map((item) => (
                          <span
                            key={item}
                            className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}

                    {(brew.grinder || brew.dripper) && (
                      <p className="text-sm text-muted-foreground">
                        {[brew.grinder?.name, brew.dripper?.name].filter(Boolean).join(" · ")}
                      </p>
                    )}

                    {notes.length > 0 && (
                      <dl className="space-y-1 text-sm">
                        {notes.map(([label, value]) => (
                          <div key={label} className="flex gap-2">
                            <dt className="shrink-0 text-muted-foreground">{label}:</dt>
                            <dd>{value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <Link
                        href={`/brews/${brew.id}`}
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        Düzenle
                      </Link>
                      <form action={deleteBrew}>
                        <input type="hidden" name="id" value={brew.id} />
                        <Button type="submit" variant="outline" size="sm">
                          Sil
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

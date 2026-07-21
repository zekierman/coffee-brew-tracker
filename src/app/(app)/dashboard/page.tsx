import { and, desc, eq, gte, ilike, sql, type SQL } from "drizzle-orm";
import {
  CircleGauge,
  CoffeeIcon,
  Filter,
  Pencil,
  PlusCircle,
  RotateCcw,
  SlidersHorizontal,
  Star,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { deleteBrew, toggleFavorite } from "@/app/actions/brews";
import { PageHeader } from "@/components/page-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/db";
import { brews, coffeeBeans, tastingNotes } from "@/db/schema";
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
  const query = first(params.q).trim();
  const tagFilter = first(params.tag).trim().toLocaleLowerCase("tr");
  const favoritesOnly = first(params.fav) === "1";

  // userId kosulu her zaman ilk sirada; filtreler sadece ustune biner.
  const conditions: SQL[] = [eq(brews.userId, userId)];
  if (beanFilter) conditions.push(eq(brews.beanId, beanFilter));
  if (methodFilter) conditions.push(ilike(brews.method, `%${methodFilter}%`));
  if (ratingFilter >= 1 && ratingFilter <= 5) conditions.push(gte(brews.rating, ratingFilter));
  if (favoritesOnly) conditions.push(eq(brews.isFavorite, true));
  if (tagFilter) conditions.push(sql`${brews.tags} @> ARRAY[${tagFilter}]::text[]`);

  if (query) {
    // ponytail: tsvector yerine ilike -- kisisel bir gunlukte kayit sayisi
    // birkac bini gecmez, indeks karmasikligina degmiyor.
    const like = `%${query}%`;
    const notes = tastingNotes;
    conditions.push(
      sql`(
        ${brews.method} ilike ${like}
        or exists (select 1 from ${coffeeBeans} b where b.id = ${brews.beanId} and b.name ilike ${like})
        or exists (
          select 1 from ${notes} n where n.brew_id = ${brews.id} and (
            n.aroma ilike ${like} or n.flavor ilike ${like} or n.acidity ilike ${like}
            or n.body ilike ${like} or n.sweetness ilike ${like} or n.aftertaste ilike ${like}
          )
        )
      )`,
    );
  }

  const [rows, { beans }] = await Promise.all([
    db.query.brews.findMany({
      where: and(...conditions),
      orderBy: desc(brews.brewedAt),
      with: { tastingNote: true, bean: true, grinder: true, dripper: true },
      limit: 100,
    }),
    loadBrewOptions(userId),
  ]);

  const isFiltered = Boolean(
    beanFilter || methodFilter || ratingFilter || query || tagFilter || favoritesOnly,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        Icon={CircleGauge}
        title="Demlemeler"
        description={`${rows.length} kayıt${isFiltered ? " · filtreli" : ""}`}
      >
        <Link href="/brews/new" className={buttonVariants({ size: "lg" })}>
          <PlusCircle className="size-4" aria-hidden />
          Yeni demleme
        </Link>
      </PageHeader>

      {/* ponytail: filtreler native GET formu — durum URL'de, client state yok,
          sonuc paylasilabilir/yer imlenebilir. */}
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
            <SlidersHorizontal className="size-4" aria-hidden />
            Filtrele
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form method="get" className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2 sm:col-span-2 lg:col-span-4">
              <Label htmlFor="q">Ara</Label>
              <Input
                id="q"
                name="q"
                type="search"
                defaultValue={query}
                placeholder="Tadım notu, çekirdek adı, yöntem..."
              />
            </div>

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

            {tagFilter && <input type="hidden" name="tag" value={tagFilter} />}

            <div className="flex flex-wrap items-center gap-2">
              <label className="hover:bg-secondary/60 inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-2 text-sm transition-colors duration-200">
                <input
                  type="checkbox"
                  name="fav"
                  value="1"
                  defaultChecked={favoritesOnly}
                  className="peer sr-only"
                />
                <Star
                  className="text-muted-foreground/50 peer-checked:fill-star peer-checked:text-star size-4"
                  aria-hidden
                />
                Favoriler
              </label>
              <Button type="submit">
                <Filter className="size-4" aria-hidden />
                Uygula
              </Button>
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
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <CoffeeIcon className="text-muted-foreground/50 size-10" aria-hidden />
            <p className="text-muted-foreground">
              {isFiltered ? "Filtreye uyan demleme yok." : "Henüz demleme kaydetmedin."}
            </p>
            {!isFiltered && (
              <Link href="/brews/new" className={buttonVariants({ variant: "outline" })}>
                İlk demlemeni kaydet
              </Link>
            )}
          </CardContent>
        </Card>
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
                <Card className="hover:ring-primary/25 h-full transition-shadow duration-200 hover:shadow-lg hover:shadow-black/5">
                  <CardHeader>
                    <CardTitle className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-display text-lg tracking-tight">
                        {brew.bean?.name ?? brew.method ?? "Demleme"}
                      </span>
                      {brew.rating !== null && (
                        <span
                          className="text-star text-sm font-normal"
                          aria-label={`${brew.rating} / 5 puan`}
                        >
                          {"★".repeat(brew.rating)}
                          <span className="text-muted-foreground/30" aria-hidden>
                            {"★".repeat(5 - brew.rating)}
                          </span>
                        </span>
                      )}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {brew.brewedAt.toLocaleString("tr-TR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                      {brew.method && ` · ${brew.method}`}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {params.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {params.map((item) => (
                          <span
                            key={item}
                            className="bg-muted text-muted-foreground rounded-md px-2 py-1 font-mono text-xs tabular-nums"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}

                    {(brew.grinder || brew.dripper) && (
                      <p className="text-muted-foreground text-sm">
                        {[brew.grinder?.name, brew.dripper?.name].filter(Boolean).join(" · ")}
                      </p>
                    )}

                    {notes.length > 0 && (
                      <dl className="border-border/70 space-y-1.5 border-l-2 pl-3 text-sm">
                        {notes.map(([label, value]) => (
                          <div key={label} className="flex gap-2">
                            <dt className="text-muted-foreground shrink-0">{label}</dt>
                            <dd className="text-pretty">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}

                    {brew.tags && brew.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {brew.tags.map((tag) => (
                          <Link
                            key={tag}
                            href={`/dashboard?tag=${encodeURIComponent(tag)}`}
                            className="bg-secondary text-secondary-foreground hover:bg-secondary/70 rounded-full px-2.5 py-0.5 text-xs transition-colors duration-200"
                          >
                            #{tag}
                          </Link>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <Link
                        href={`/brews/new?from=${brew.id}`}
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        <RotateCcw className="size-3.5" aria-hidden />
                        Tekrar demle
                      </Link>
                      <Link
                        href={`/brews/${brew.id}`}
                        className={buttonVariants({ variant: "ghost", size: "sm" })}
                      >
                        <Pencil className="size-3.5" aria-hidden />
                        Düzenle
                      </Link>
                      <form action={toggleFavorite}>
                        <input type="hidden" name="id" value={brew.id} />
                        <Button
                          type="submit"
                          variant="ghost"
                          size="sm"
                          aria-label={brew.isFavorite ? "Favoriden çıkar" : "Favorilere ekle"}
                        >
                          <Star
                            className={`size-3.5 ${brew.isFavorite ? "fill-star text-star" : ""}`}
                            aria-hidden
                          />
                        </Button>
                      </form>
                      <form action={deleteBrew} className="ml-auto">
                        <input type="hidden" name="id" value={brew.id} />
                        <Button type="submit" variant="ghost" size="sm">
                          <Trash2 className="size-3.5" aria-hidden />
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

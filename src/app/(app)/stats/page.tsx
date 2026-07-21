import { desc, eq } from "drizzle-orm";
import { BarChart3, CalendarRange, Coffee, Scale, SlidersHorizontal, Star } from "lucide-react";
import { BarChart } from "@/components/bar-chart";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { brews } from "@/db/schema";
import {
  brewsPerMonth,
  ratingByBean,
  ratingByGrind,
  ratingByMethod,
  summarize,
  type BrewRow,
} from "@/lib/stats";
import { requireUserId } from "@/lib/session";

function StatTile({
  Icon,
  label,
  value,
  hint,
}: {
  Icon: typeof Coffee;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="space-y-1 pt-6">
        <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <Icon className="size-3.5" aria-hidden />
          {label}
        </p>
        <p className="font-display text-3xl leading-none font-semibold tabular-nums">{value}</p>
        {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export default async function StatsPage() {
  const userId = await requireUserId();

  const rows = await db.query.brews.findMany({
    where: eq(brews.userId, userId),
    orderBy: desc(brews.brewedAt),
    with: { bean: { columns: { name: true } } },
    columns: {
      grindClicks: true,
      rating: true,
      method: true,
      doseG: true,
      waterG: true,
      brewedAt: true,
      isFavorite: true,
    },
  });

  const data: BrewRow[] = rows.map((row) => ({
    grindClicks: row.grindClicks,
    rating: row.rating,
    method: row.method,
    doseG: row.doseG,
    waterG: row.waterG,
    brewedAt: row.brewedAt,
    beanName: row.bean?.name ?? null,
  }));

  const summary = summarize(data, rows.filter((r) => r.isFavorite).length);
  const grind = ratingByGrind(data);
  const beans = ratingByBean(data);
  const methods = ratingByMethod(data);
  const months = brewsPerMonth(data);

  const brewCount = (count: number) => `(${count} demleme)`;

  return (
    <div className="space-y-6">
      <PageHeader
        Icon={BarChart3}
        title="İstatistikler"
        description="Hangi ayarın daha iyi fincan verdiğini veriden gör."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile Icon={Coffee} label="Toplam demleme" value={String(summary.total)} />
        <StatTile
          Icon={Star}
          label="Ortalama puan"
          value={summary.averageRating === null ? "—" : `${summary.averageRating}`}
          hint={`${summary.rated} puanlanmış`}
        />
        <StatTile
          Icon={Scale}
          label="Ortalama oran"
          value={summary.averageRatio === null ? "—" : `1:${summary.averageRatio}`}
        />
        <StatTile
          Icon={Coffee}
          label="Öğütülen kahve"
          value={`${summary.totalCoffeeG} g`}
          hint={`${summary.favorites} favori`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <SlidersHorizontal className="text-primary size-4" aria-hidden />
            Öğütüm tıkına göre ortalama puan
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Tık sayısına göre sıralı. En yüksek puanlı ayar senin tatlı noktan.
          </p>
        </CardHeader>
        <CardContent>
          <BarChart
            data={grind}
            max={5}
            unit=" ★"
            countLabel={brewCount}
            emptyText="Henüz öğütüm tıkı ve puan girilmiş demleme yok."
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Çekirdeğe göre ortalama puan</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={beans}
              max={5}
              unit=" ★"
              countLabel={brewCount}
              emptyText="Puanlanmış çekirdek yok."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Yönteme göre ortalama puan</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={methods}
              max={5}
              unit=" ★"
              countLabel={brewCount}
              emptyText="Puanlanmış yöntem yok."
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarRange className="text-primary size-4" aria-hidden />
            Aylara göre demleme sayısı
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart data={months} emptyText="Kayıt yok." />
        </CardContent>
      </Card>
    </div>
  );
}

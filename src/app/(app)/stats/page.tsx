import { desc, eq } from "drizzle-orm";
import { BarChart3, Bean, CalendarRange, Coffee, Scale, Star, Trophy } from "lucide-react";
import { BestBrews } from "@/components/best-brews";
import { ColumnChart } from "@/components/column-chart";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { brews } from "@/db/schema";
import { brewsPerMonth, summarize, topRatedBrews, type BrewRow } from "@/lib/stats";
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
    <Card className="relative overflow-hidden">
      {/* Sicak vurgu seridi -- kutulari duz dikdortgen olmaktan cikariyor. */}
      <span className="bg-chart-1 absolute inset-y-0 left-0 w-1" aria-hidden />
      <CardContent className="space-y-1 pt-6 pl-5">
        <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <Icon className="size-3.5" aria-hidden />
          {label}
        </p>
        <p className="font-display text-3xl leading-none font-semibold tabular-nums">{value}</p>
        <p className="text-muted-foreground text-xs">{hint ?? " "}</p>
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
      id: true,
      grindClicks: true,
      rating: true,
      method: true,
      waterTempC: true,
      doseG: true,
      waterG: true,
      brewTimeSeconds: true,
      brewedAt: true,
      isFavorite: true,
    },
  });

  const data: BrewRow[] = rows.map((row) => ({
    id: row.id,
    grindClicks: row.grindClicks,
    rating: row.rating,
    method: row.method,
    waterTempC: row.waterTempC,
    doseG: row.doseG,
    waterG: row.waterG,
    brewTimeSeconds: row.brewTimeSeconds,
    brewedAt: row.brewedAt,
    beanName: row.bean?.name ?? null,
  }));

  const summary = summarize(data, rows.filter((r) => r.isFavorite).length);
  const best = topRatedBrews(data, 5);
  const months = brewsPerMonth(data);

  return (
    <div className="space-y-6">
      <PageHeader
        Icon={BarChart3}
        title="İstatistikler"
        description="En iyi fincanların ve demleme alışkanlığın."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          Icon={Coffee}
          label="Toplam demleme"
          value={String(summary.total)}
          hint={summary.favorites > 0 ? `${summary.favorites} favori` : undefined}
        />
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
        <StatTile Icon={Bean} label="Öğütülen kahve" value={`${summary.totalCoffeeG} g`} />
      </div>

      <Card className="relative overflow-hidden">
        <span className="bg-chart-1 absolute inset-x-0 top-0 h-1" aria-hidden />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="text-primary size-4" aria-hidden />
            En iyi demlemelerin
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            En yüksek puanlı fincan en üstte. Ayarlarını görüp tek dokunuşla tekrarlayabilirsin.
          </p>
        </CardHeader>
        <CardContent>
          <BestBrews data={best} emptyText="Henüz puanladığın demleme yok." />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarRange className="text-primary size-4" aria-hidden />
            Son 6 ayda demleme sayısı
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ColumnChart data={months} emptyText="Kayıt yok." />
        </CardContent>
      </Card>
    </div>
  );
}

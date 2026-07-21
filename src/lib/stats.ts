export type BrewRow = {
  id: string;
  grindClicks: number | null;
  rating: number | null;
  method: string | null;
  waterTempC: string | null;
  doseG: string | null;
  waterG: string | null;
  brewTimeSeconds: number | null;
  brewedAt: Date;
  beanName: string | null;
};

export type Bucket = { label: string; value: number; count: number };

function mean(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * En yuksek puanli demlemeler once. Esitlikte yeni tarihli ustte kalir --
 * ayni puani veren iki demlemeden guncel olani tekrarlamak daha mantikli.
 * Puansiz demlemeler listeye girmez.
 */
export function topRatedBrews(rows: BrewRow[], limit = 5): BrewRow[] {
  return rows
    .filter((row) => row.rating !== null)
    .sort((a, b) => b.rating! - a.rating! || b.brewedAt.getTime() - a.brewedAt.getTime())
    .slice(0, limit);
}

/** Son n ayin demleme sayisi, eski -> yeni. Bos aylar 0 olarak yer alir. */
export function brewsPerMonth(rows: BrewRow[], months = 6, now = new Date()): Bucket[] {
  const buckets: Bucket[] = [];
  const counts = new Map<string, number>();

  for (const row of rows) {
    const key = `${row.brewedAt.getFullYear()}-${row.brewedAt.getMonth()}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const count = counts.get(key) ?? 0;
    buckets.push({
      label: date.toLocaleDateString("tr-TR", { month: "short" }),
      value: count,
      count,
    });
  }
  return buckets;
}

export type Summary = {
  total: number;
  rated: number;
  averageRating: number | null;
  favorites: number;
  averageRatio: number | null;
  totalCoffeeG: number;
};

export function summarize(rows: BrewRow[], favorites: number): Summary {
  const ratings = rows.map((r) => r.rating).filter((r): r is number => r !== null);

  const ratios = rows
    .map((r) => (r.doseG && r.waterG && Number(r.doseG) > 0 ? Number(r.waterG) / Number(r.doseG) : null))
    .filter((r): r is number => r !== null && Number.isFinite(r));

  const totalCoffeeG = rows.reduce((sum, r) => sum + (r.doseG ? Number(r.doseG) : 0), 0);

  return {
    total: rows.length,
    rated: ratings.length,
    averageRating: ratings.length ? Number(mean(ratings).toFixed(2)) : null,
    favorites,
    averageRatio: ratios.length ? Number(mean(ratios).toFixed(1)) : null,
    totalCoffeeG: Number(totalCoffeeG.toFixed(1)),
  };
}

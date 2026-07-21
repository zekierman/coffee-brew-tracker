export type BrewRow = {
  grindClicks: number | null;
  rating: number | null;
  method: string | null;
  doseG: string | null;
  waterG: string | null;
  brewedAt: Date;
  beanName: string | null;
};

export type Bucket = { label: string; value: number; count: number };

function mean(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/** Bir anahtara gore gruplayip puan ortalamasi alir; puansiz demlemeler sayilmaz. */
function averageRatingBy(
  rows: BrewRow[],
  key: (row: BrewRow) => string | null,
): Bucket[] {
  const groups = new Map<string, number[]>();
  for (const row of rows) {
    const label = key(row);
    if (label === null || row.rating === null) continue;
    const list = groups.get(label);
    if (list) list.push(row.rating);
    else groups.set(label, [row.rating]);
  }

  return [...groups.entries()]
    .map(([label, ratings]) => ({
      label,
      value: Number(mean(ratings).toFixed(2)),
      count: ratings.length,
    }))
    .sort((a, b) => b.value - a.value || b.count - a.count);
}

/**
 * Uygulamanin asil sorusu: hangi ogutum ayari daha iyi fincan veriyor?
 * Tik sayisina gore artan siralanir -- buyukluk degil, ayar ekseni.
 */
export function ratingByGrind(rows: BrewRow[]): Bucket[] {
  return averageRatingBy(rows, (row) =>
    row.grindClicks === null ? null : String(row.grindClicks),
  ).sort((a, b) => Number(a.label) - Number(b.label));
}

export function ratingByBean(rows: BrewRow[]): Bucket[] {
  return averageRatingBy(rows, (row) => row.beanName);
}

export function ratingByMethod(rows: BrewRow[]): Bucket[] {
  return averageRatingBy(rows, (row) => row.method);
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

import type { Bucket } from "@/lib/stats";

type Props = {
  data: Bucket[];
  /** Cubuk uzunlugunun olceklendigi ust sinir (orn. puan icin 5). */
  max?: number;
  /** Deger etiketinin sonuna eklenir. */
  unit?: string;
  emptyText: string;
  countLabel?: (count: number) => string;
};

/**
 * Yatay cubuk grafigi. Tek seri oldugu icin tek renk ve lejant yok -- kimlik
 * her cubugun yanindaki metin etiketiyle veriliyor, renkle degil.
 * ponytail: grafik kutuphanesi yerine CSS; deger ve etiket zaten metin oldugu
 * icin ekran okuyucu ve kopyala-yapistir da dogal calisiyor.
 */
export function BarChart({ data, max, unit = "", emptyText, countLabel }: Props) {
  if (data.length === 0) {
    return <p className="text-muted-foreground py-6 text-sm">{emptyText}</p>;
  }

  const ceiling = max ?? Math.max(...data.map((d) => d.value), 1);

  return (
    <ul className="space-y-2.5">
      {data.map((item) => {
        // Sifir icin cubuk cizilmez: en kucuk genislik tabani ancak sifirdan
        // buyuk degerlere uygulanir, yoksa "0" varmis gibi gorunur.
        const pct = item.value <= 0 ? 0 : Math.max((item.value / ceiling) * 100, 1.5);
        return (
          <li key={item.label} className="group grid grid-cols-[minmax(0,7rem)_1fr] items-center gap-3">
            <span className="truncate text-sm" title={item.label}>
              {item.label}
            </span>

            <span className="flex items-center gap-2">
              <span className="bg-muted h-2.5 flex-1 overflow-hidden rounded-full">
                <span
                  className="bg-chart-1 block h-full rounded-full transition-[width] duration-300"
                  style={{ width: `${pct}%` }}
                />
              </span>
              <span className="text-muted-foreground w-20 shrink-0 text-right font-mono text-xs tabular-nums">
                {item.value}
                {unit}
                {countLabel && (
                  <span className="text-muted-foreground/60 ml-1 opacity-0 transition-opacity group-hover:opacity-100">
                    {countLabel(item.count)}
                  </span>
                )}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

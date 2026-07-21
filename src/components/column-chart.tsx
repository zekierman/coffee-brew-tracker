import type { Bucket } from "@/lib/stats";

/**
 * Dikey sutun grafigi -- zaman ekseni soldan saga aktigi icin aylar buna
 * daha uygun. Sifir degerler sutun cizmez, sadece taban cizgisinde kalir.
 */
export function ColumnChart({ data, emptyText }: { data: Bucket[]; emptyText: string }) {
  if (data.length === 0) {
    return <p className="text-muted-foreground py-6 text-sm">{emptyText}</p>;
  }

  const ceiling = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex h-44 items-end gap-2 sm:gap-3">
      {data.map((item) => {
        const pct = item.value <= 0 ? 0 : Math.max((item.value / ceiling) * 100, 4);
        return (
          <div key={item.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span className="text-muted-foreground font-mono text-xs tabular-nums">
              {item.value > 0 ? item.value : ""}
            </span>
            <div
              className="bg-chart-1 w-full rounded-t-md transition-[height] duration-300"
              style={{ height: `${pct}%` }}
              role="img"
              aria-label={`${item.label}: ${item.value} demleme`}
            />
            <span className="text-muted-foreground text-xs">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

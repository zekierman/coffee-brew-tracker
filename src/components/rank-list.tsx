import type { Bucket } from "@/lib/stats";

type Props = {
  data: Bucket[];
  /** Etiketin sonuna eklenir: "88" -> "88 click". */
  labelSuffix?: string;
  emptyText: string;
};

/**
 * Puana gore siralanmis ilk N kayit. Sira numarasi + yildiz + cubuk birlikte
 * veriliyor: kimlik ve buyukluk renkle degil, konum ve metinle okunuyor.
 */
export function RankList({ data, labelSuffix, emptyText }: Props) {
  if (data.length === 0) {
    return <p className="text-muted-foreground py-6 text-sm">{emptyText}</p>;
  }

  return (
    <ol className="space-y-3">
      {data.map((item, index) => {
        const pct = (item.value / 5) * 100;
        const isTop = index === 0;

        return (
          <li key={item.label} className="flex items-center gap-3">
            <span
              className={`grid size-8 shrink-0 place-items-center rounded-lg font-mono text-sm font-semibold tabular-nums ${
                isTop
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
              aria-label={`${index + 1}. sıra`}
            >
              {index + 1}
            </span>

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <span className={`truncate ${isTop ? "font-semibold" : ""}`} title={item.label}>
                  {item.label}
                  {labelSuffix && <span className="text-muted-foreground"> {labelSuffix}</span>}
                </span>
                <span className="text-muted-foreground shrink-0 font-mono text-xs tabular-nums">
                  {item.count} demleme
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                  <span
                    className={`block h-full rounded-full ${isTop ? "bg-chart-1" : "bg-chart-1/55"}`}
                    style={{ width: `${pct}%` }}
                  />
                </span>
                <span className="text-star w-24 shrink-0 text-right text-sm" aria-label={`${item.value} / 5`}>
                  {"★".repeat(Math.round(item.value))}
                  <span className="text-muted-foreground/30" aria-hidden>
                    {"★".repeat(5 - Math.round(item.value))}
                  </span>
                  <span className="text-muted-foreground ml-1 font-mono text-xs tabular-nums">
                    {item.value}
                  </span>
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

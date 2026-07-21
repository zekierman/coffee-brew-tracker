import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { brewRatio, formatBrewTime } from "@/lib/brews";
import type { BrewRow } from "@/lib/stats";

/**
 * En yuksek puanli demlemeler, en iyisi basta. Puan yildizla ve sayiyla
 * birlikte veriliyor -- renk tek basina bilgi tasimiyor.
 */
export function BestBrews({ data, emptyText }: { data: BrewRow[]; emptyText: string }) {
  if (data.length === 0) {
    return <p className="text-muted-foreground py-6 text-sm">{emptyText}</p>;
  }

  return (
    <ol className="divide-border divide-y">
      {data.map((brew, index) => {
        const isTop = index === 0;
        const params = [
          brew.grindClicks !== null && `${brew.grindClicks} click`,
          brew.waterTempC && `${brew.waterTempC} °C`,
          brew.brewTimeSeconds !== null && formatBrewTime(brew.brewTimeSeconds),
          brewRatio(brew.doseG, brew.waterG),
        ].filter(Boolean) as string[];

        return (
          <li
            key={brew.id}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3 first:pt-0 last:pb-0"
          >
            <span
              className={`text-star shrink-0 text-lg leading-none ${isTop ? "" : "opacity-80"}`}
              aria-label={`${brew.rating} / 5 puan`}
            >
              {"★".repeat(brew.rating ?? 0)}
              <span className="text-muted-foreground/25" aria-hidden>
                {"★".repeat(5 - (brew.rating ?? 0))}
              </span>
            </span>

            <div className="min-w-0 flex-1">
              <p className={`truncate ${isTop ? "font-display text-lg font-semibold" : "text-sm"}`}>
                {brew.beanName ?? brew.method ?? "Demleme"}
              </p>
              <p className="text-muted-foreground mt-0.5 font-mono text-xs tabular-nums">
                {params.join(" · ")}
              </p>
              <p className="text-muted-foreground/80 mt-0.5 text-xs">
                {brew.brewedAt.toLocaleDateString("tr-TR", { dateStyle: "medium" })}
              </p>
            </div>

            <Link
              href={`/brews/new?from=${brew.id}`}
              className={buttonVariants({ variant: isTop ? "default" : "outline", size: "sm" })}
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Tekrar demle
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

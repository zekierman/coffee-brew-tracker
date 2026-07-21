"use client";

import { useState } from "react";

// ponytail: saf CSS ile kumulatif doldurma (peer + kardes secici + ters siralama)
// kivirmasindan daha okunur oldugu icin kucuk bir state tutuluyor.
export function StarRating({ name, defaultValue }: { name: string; defaultValue?: number | null }) {
  const [rating, setRating] = useState<number>(defaultValue ?? 0);

  return (
    <div className="flex items-center gap-1">
      <input type="hidden" name={name} value={rating || ""} />
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => setRating(value)}
          aria-label={`${value} yıldız`}
          aria-pressed={rating === value}
          className={`text-2xl leading-none transition-colors hover:text-amber-400 focus-visible:outline-2 focus-visible:outline-ring ${
            value <= rating ? "text-amber-500" : "text-muted-foreground/40"
          }`}
        >
          ★
        </button>
      ))}
      {rating > 0 && (
        <button
          type="button"
          onClick={() => setRating(0)}
          className="ml-2 text-xs text-muted-foreground hover:text-foreground"
        >
          temizle
        </button>
      )}
    </div>
  );
}

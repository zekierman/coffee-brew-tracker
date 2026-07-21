"use client";

import { Pause, Play, RotateCcw, Timer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  /** Zamanlayici durunca dakika/saniye alanlarini dolduran geri cagri. */
  onStop: (totalSeconds: number) => void;
  bloomSeconds?: number;
};

function format(totalMs: number): string {
  const total = Math.floor(totalMs / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

export function BrewTimer({ onStop, bloomSeconds = 45 }: Props) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [running, setRunning] = useState(false);
  // Gecen sureyi setInterval saymiyor: sekme arka plana alininca interval
  // kisilir ve sayac geri kalir. Baslangic damgasindan fark aliniyor.
  const startedAt = useRef<number | null>(null);
  const baseMs = useRef(0);

  useEffect(() => {
    if (!running) return;
    startedAt.current = Date.now();
    const id = setInterval(() => {
      setElapsedMs(baseMs.current + (Date.now() - (startedAt.current ?? Date.now())));
    }, 100);
    return () => clearInterval(id);
  }, [running]);

  function toggle() {
    if (running) {
      baseMs.current = elapsedMs;
      setRunning(false);
      onStop(Math.round(elapsedMs / 1000));
    } else {
      setRunning(true);
    }
  }

  function reset() {
    setRunning(false);
    baseMs.current = 0;
    setElapsedMs(0);
  }

  const seconds = Math.floor(elapsedMs / 1000);
  const inBloom = seconds < bloomSeconds;
  const bloomProgress = Math.min(seconds / bloomSeconds, 1) * 100;

  return (
    <div className="bg-muted/50 space-y-3 rounded-xl border p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Timer className="text-primary size-5" aria-hidden />
          <span className="font-mono text-3xl tabular-nums" aria-live="polite" aria-atomic="true">
            {format(elapsedMs)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" onClick={toggle} variant={running ? "secondary" : "default"}>
            {running ? (
              <>
                <Pause className="size-4" aria-hidden /> Durdur
              </>
            ) : (
              <>
                <Play className="size-4" aria-hidden /> Başlat
              </>
            )}
          </Button>
          <Button
            type="button"
            onClick={reset}
            variant="ghost"
            size="icon"
            aria-label="Zamanlayıcıyı sıfırla"
          >
            <RotateCcw className="size-4" aria-hidden />
          </Button>
        </div>
      </div>

      <div>
        <div className="text-muted-foreground mb-1 flex justify-between text-xs">
          <span>{inBloom ? "Bloom" : "Bloom bitti"}</span>
          <span className="font-mono tabular-nums">{bloomSeconds} sn</span>
        </div>
        <div className="bg-border h-1.5 overflow-hidden rounded-full">
          <div
            className="bg-primary h-full rounded-full transition-[width] duration-200"
            style={{ width: `${bloomProgress}%` }}
          />
        </div>
      </div>

      <p className="text-muted-foreground text-xs">
        Durdurunca süre aşağıdaki alanlara yazılır.
      </p>
    </div>
  );
}

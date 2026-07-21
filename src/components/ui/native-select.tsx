import { cn } from "@/lib/utils";

/**
 * Native <select>. Acilan listeyi isletim sistemi ciziyor; bg-transparent
 * birakilirsa karanlik modda secenek yazilari okunmuyordu. Hem select'e hem
 * option'lara acik zemin/metin rengi veriliyor, color-scheme ile de tarayicinin
 * kendi cizimi dogru moda ayarlaniyor (globals.css).
 */
export function NativeSelect({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "border-input bg-card text-foreground h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "[&>option]:bg-card [&>option]:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

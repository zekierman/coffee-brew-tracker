"use client";

import { Bean, NotebookPen, SlidersHorizontal } from "lucide-react";
import { useActionState } from "react";
import { saveBrew, type FormState } from "@/app/actions/brews";
import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type BrewDefaults = {
  beanId: string | null;
  grinderId: string | null;
  dripperId: string | null;
  grindClicks: number | null;
  waterTempC: string | null;
  doseG: string | null;
  waterG: string | null;
  brewTimeSeconds: number | null;
  method: string | null;
  rating: number | null;
  brewedAt: Date;
  note: {
    aroma: string | null;
    flavor: string | null;
    acidity: string | null;
    body: string | null;
    sweetness: string | null;
    aftertaste: string | null;
  } | null;
};

type Option = { id: string; name: string };

type Props = {
  id?: string;
  beans: Option[];
  grinders: Option[];
  drippers: Option[];
  defaults?: BrewDefaults;
  submitLabel: string;
};

const NOTE_FIELDS = [
  { name: "aroma", label: "Aroma", placeholder: "Sütlü çikolata kokusu" },
  { name: "flavor", label: "Tat", placeholder: "Limonata gibi mayhoş" },
  { name: "acidity", label: "Asitlik", placeholder: "Parlak, sitrik" },
  { name: "body", label: "Gövde", placeholder: "Orta, yağlı" },
  { name: "sweetness", label: "Tatlılık", placeholder: "Bal, kahverengi şeker" },
  { name: "aftertaste", label: "Bitiş", placeholder: "Ağır ve bitter kakao acılığı" },
] as const;

const selectClass =
  "border-input bg-transparent dark:bg-input/30 h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

/** <input type="datetime-local"> yerel saat bekler, ISO'nun Z'li hali islemiyor. */
function toLocalInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function SectionTitle({ Icon, children }: { Icon: typeof Bean; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 border-b pb-2 text-sm font-medium">
      <Icon className="text-primary size-4" aria-hidden />
      {children}
    </h2>
  );
}

export function BrewForm({ id, beans, grinders, drippers, defaults, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(saveBrew, null);
  const totalSeconds = defaults?.brewTimeSeconds ?? null;

  return (
    <form action={formAction} className="space-y-8">
      {id && <input type="hidden" name="id" value={id} />}

      <section className="space-y-4">
        <SectionTitle Icon={Bean}>Kahve ve ekipman</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="beanId">Çekirdek</Label>
            <select id="beanId" name="beanId" defaultValue={defaults?.beanId ?? ""} className={selectClass}>
              <option value="">—</option>
              {beans.map((bean) => (
                <option key={bean.id} value={bean.id}>
                  {bean.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grinderId">Değirmen</Label>
            <select
              id="grinderId"
              name="grinderId"
              defaultValue={defaults?.grinderId ?? ""}
              className={selectClass}
            >
              <option value="">—</option>
              {grinders.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dripperId">Dripper</Label>
            <select
              id="dripperId"
              name="dripperId"
              defaultValue={defaults?.dripperId ?? ""}
              className={selectClass}
            >
              <option value="">—</option>
              {drippers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle Icon={SlidersHorizontal}>Parametreler</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="grindClicks">Öğütüm (tık)</Label>
            <Input
              id="grindClicks"
              name="grindClicks"
              type="number"
              className="font-mono tabular-nums"
              min={0}
              max={999}
              inputMode="numeric"
              defaultValue={defaults?.grindClicks ?? ""}
              placeholder="88"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="waterTempC">Su sıcaklığı (°C)</Label>
            <Input
              id="waterTempC"
              name="waterTempC"
              type="number"
              className="font-mono tabular-nums"
              step="0.5"
              min={1}
              max={100}
              inputMode="decimal"
              defaultValue={defaults?.waterTempC ?? ""}
              placeholder="92"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">Yöntem</Label>
            <Input
              id="method"
              name="method"
              defaultValue={defaults?.method ?? ""}
              placeholder="V60, Chemex, French Press..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doseG">Kahve (g)</Label>
            <Input
              id="doseG"
              name="doseG"
              type="number"
              className="font-mono tabular-nums"
              step="0.1"
              min={0.1}
              inputMode="decimal"
              defaultValue={defaults?.doseG ?? ""}
              placeholder="15"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="waterG">Su (g)</Label>
            <Input
              id="waterG"
              name="waterG"
              type="number"
              className="font-mono tabular-nums"
              step="1"
              min={1}
              inputMode="decimal"
              defaultValue={defaults?.waterG ?? ""}
              placeholder="250"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brewMinutes">Süre</Label>
            <div className="flex items-center gap-2">
              <Input
                id="brewMinutes"
                name="brewMinutes"
                type="number"
                className="font-mono tabular-nums"
                min={0}
                max={59}
                inputMode="numeric"
                defaultValue={totalSeconds === null ? "" : Math.floor(totalSeconds / 60)}
                placeholder="2"
                aria-label="Dakika"
              />
              <span className="text-sm text-muted-foreground">dk</span>
              <Input
                name="brewSeconds"
                type="number"
                className="font-mono tabular-nums"
                min={0}
                max={59}
                inputMode="numeric"
                defaultValue={totalSeconds === null ? "" : totalSeconds % 60}
                placeholder="35"
                aria-label="Saniye"
              />
              <span className="text-sm text-muted-foreground">sn</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="brewedAt">Tarih</Label>
            <Input
              id="brewedAt"
              name="brewedAt"
              type="datetime-local"
              defaultValue={toLocalInputValue(defaults?.brewedAt ?? new Date())}
            />
          </div>

          <div className="space-y-2">
            <Label>Puan</Label>
            <StarRating name="rating" defaultValue={defaults?.rating} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle Icon={NotebookPen}>Tadım notları</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NOTE_FIELDS.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Textarea
                id={field.name}
                name={field.name}
                rows={2}
                defaultValue={defaults?.note?.[field.name] ?? ""}
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>
      </section>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Kaydediliyor..." : submitLabel}
      </Button>
    </form>
  );
}

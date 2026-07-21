"use client";

import { useActionState } from "react";
import { saveBean, type FormState } from "@/app/actions/beans";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { BeanInput } from "@/lib/beans";

type Props = { id?: string; defaults?: BeanInput; submitLabel: string };

const FIELDS = [
  { name: "country", label: "Ülke", placeholder: "Etiyopya" },
  { name: "region", label: "Bölge", placeholder: "Yirgacheffe" },
  { name: "farm", label: "Çiftlik", placeholder: "Konga" },
  { name: "variety", label: "Varyete", placeholder: "Heirloom" },
  { name: "processMethod", label: "İşleme", placeholder: "Yıkanmış" },
  { name: "roaster", label: "Kavurucu", placeholder: "Coffee Sapiens" },
] as const;

export function BeanForm({ id, defaults, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(saveBean, null);
  const suffix = id ?? "new";

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {id && <input type="hidden" name="id" value={id} />}

      <div className="space-y-2 sm:col-span-2 lg:col-span-1">
        <Label htmlFor={`name-${suffix}`}>Ad</Label>
        <Input
          id={`name-${suffix}`}
          name="name"
          required
          maxLength={160}
          defaultValue={defaults?.name}
          placeholder="Etiyopya Yirgacheffe"
        />
      </div>

      {FIELDS.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={`${field.name}-${suffix}`}>{field.label}</Label>
          <Input
            id={`${field.name}-${suffix}`}
            name={field.name}
            defaultValue={defaults?.[field.name] ?? ""}
            placeholder={field.placeholder}
          />
        </div>
      ))}

      <div className="space-y-2">
        <Label htmlFor={`roastDate-${suffix}`}>Kavurma tarihi</Label>
        {/* ponytail: native date input — mobilde OS tarih secicisini acar,
            takvim kutuphanesi gerekmiyor. */}
        <Input
          id={`roastDate-${suffix}`}
          name="roastDate"
          type="date"
          defaultValue={defaults?.roastDate ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`stockG-${suffix}`}>Stok (g)</Label>
        <Input
          id={`stockG-${suffix}`}
          name="stockG"
          type="number"
          className="font-mono tabular-nums"
          step="1"
          min={0}
          inputMode="decimal"
          defaultValue={defaults?.stockG ?? ""}
          placeholder="250"
        />
        <p className="text-muted-foreground text-xs">Her demlemede doz kadar düşülür.</p>
      </div>

      <div className="space-y-2 sm:col-span-2 lg:col-span-3">
        <Label htmlFor={`notes-${suffix}`}>Not</Label>
        <Textarea
          id={`notes-${suffix}`}
          name="notes"
          rows={2}
          defaultValue={defaults?.notes ?? ""}
          placeholder="Paket üzerindeki tadım notları, satın alma yeri..."
        />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive sm:col-span-2 lg:col-span-3">
          {state.error}
        </p>
      )}

      <div className="sm:col-span-2 lg:col-span-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Kaydediliyor..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

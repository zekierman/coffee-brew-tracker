"use client";

import { useActionState } from "react";
import { saveEquipment, type FormState } from "@/app/actions/equipment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EQUIPMENT_TYPES, EQUIPMENT_TYPE_LABELS, type EquipmentType } from "@/lib/equipment";

type Props = {
  id?: string;
  defaults?: { type: EquipmentType; name: string; brand: string | null; notes: string | null };
  submitLabel: string;
};

export function EquipmentForm({ id, defaults, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(saveEquipment, null);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      {id && <input type="hidden" name="id" value={id} />}

      <div className="space-y-2">
        <Label htmlFor={`type-${id ?? "new"}`}>Tip</Label>
        {/* ponytail: native select — mobilde isletim sisteminin kendi secicisini
            acar, ekstra bilesen ve JS gerektirmez. */}
        <select
          id={`type-${id ?? "new"}`}
          name="type"
          defaultValue={defaults?.type ?? "grinder"}
          className="border-input bg-transparent dark:bg-input/30 h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        >
          {EQUIPMENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {EQUIPMENT_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`name-${id ?? "new"}`}>Ad</Label>
        <Input
          id={`name-${id ?? "new"}`}
          name="name"
          required
          maxLength={120}
          defaultValue={defaults?.name}
          placeholder="Kingrinder K6"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`brand-${id ?? "new"}`}>Marka</Label>
        <Input
          id={`brand-${id ?? "new"}`}
          name="brand"
          defaultValue={defaults?.brand ?? ""}
          placeholder="Kingrinder"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`notes-${id ?? "new"}`}>Not</Label>
        <Textarea
          id={`notes-${id ?? "new"}`}
          name="notes"
          rows={2}
          defaultValue={defaults?.notes ?? ""}
          placeholder="Burr tipi, ayar aralığı..."
        />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive sm:col-span-2">
          {state.error}
        </p>
      )}

      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Kaydediliyor..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

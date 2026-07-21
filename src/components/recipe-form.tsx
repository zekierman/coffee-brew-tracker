"use client";

import { useActionState } from "react";
import { saveRecipe, type FormState } from "@/app/actions/brews";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";

type Option = { id: string; name: string };

export function RecipeForm({ grinders, drippers }: { grinders: Option[]; drippers: Option[] }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(saveRecipe, null);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="recipeName">Tarif adı</Label>
        <Input id="recipeName" name="name" required maxLength={120} placeholder="Sabah V60" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="recipeMethod">Yöntem</Label>
        <Input id="recipeMethod" name="method" placeholder="V60" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="recipeGrinder">Değirmen</Label>
        <NativeSelect id="recipeGrinder" name="grinderId" defaultValue="">
          <option value="">—</option>
          {grinders.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </NativeSelect>
      </div>

      <div className="space-y-2">
        <Label htmlFor="recipeDripper">Dripper</Label>
        <NativeSelect id="recipeDripper" name="dripperId" defaultValue="">
          <option value="">—</option>
          {drippers.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </NativeSelect>
      </div>

      <div className="space-y-2">
        <Label htmlFor="recipeClicks">Öğütüm (click)</Label>
        <Input
          id="recipeClicks"
          name="grindClicks"
          type="number"
          className="font-mono tabular-nums"
          min={0}
          max={999}
          inputMode="numeric"
          placeholder="88"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="recipeTemp">Su (°C)</Label>
        <Input
          id="recipeTemp"
          name="waterTempC"
          type="number"
          className="font-mono tabular-nums"
          step="0.5"
          min={1}
          max={100}
          inputMode="decimal"
          placeholder="92"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="recipeDose">Kahve (g)</Label>
        <Input
          id="recipeDose"
          name="doseG"
          type="number"
          className="font-mono tabular-nums"
          step="0.1"
          min={0.1}
          inputMode="decimal"
          placeholder="15"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="recipeWater">Su (g)</Label>
        <Input
          id="recipeWater"
          name="waterG"
          type="number"
          className="font-mono tabular-nums"
          step="1"
          min={1}
          inputMode="decimal"
          placeholder="250"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="recipeMinutes">Hedef süre</Label>
        <div className="flex items-center gap-2">
          <Input
            id="recipeMinutes"
            name="brewMinutes"
            type="number"
            className="font-mono tabular-nums"
            min={0}
            max={59}
            inputMode="numeric"
            placeholder="2"
            aria-label="Dakika"
          />
          <span className="text-muted-foreground text-sm">dk</span>
          <Input
            name="brewSeconds"
            type="number"
            className="font-mono tabular-nums"
            min={0}
            max={59}
            inputMode="numeric"
            placeholder="35"
            aria-label="Saniye"
          />
          <span className="text-muted-foreground text-sm">sn</span>
        </div>
      </div>

      {state?.error && (
        <p role="alert" className="text-destructive text-sm sm:col-span-2 lg:col-span-4">
          {state.error}
        </p>
      )}

      <div className="sm:col-span-2 lg:col-span-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Kaydediliyor..." : "Tarifi kaydet"}
        </Button>
      </div>
    </form>
  );
}

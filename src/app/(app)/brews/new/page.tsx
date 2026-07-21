import { and, eq } from "drizzle-orm";
import { PlusCircle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { BrewForm, type BrewDefaults } from "@/components/brew-form";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/db";
import { brews, recipes } from "@/db/schema";
import { loadBrewOptions } from "@/lib/brew-options";
import { requireUserId } from "@/lib/session";

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

/** Onceki demlemeyi form varsayilanina cevirir; tarih ve puan tasinmaz. */
async function defaultsFromBrew(userId: string, brewId: string): Promise<BrewDefaults | null> {
  const brew = await db.query.brews.findFirst({
    where: and(eq(brews.id, brewId), eq(brews.userId, userId)),
    with: { tastingNote: true },
  });
  if (!brew) return null;

  return {
    beanId: brew.beanId,
    grinderId: brew.grinderId,
    dripperId: brew.dripperId,
    grindClicks: brew.grindClicks,
    waterTempC: brew.waterTempC,
    doseG: brew.doseG,
    waterG: brew.waterG,
    brewTimeSeconds: brew.brewTimeSeconds,
    method: brew.method,
    // Puan, tadim notu ve favori tasinmaz: bu yeni bir fincan.
    rating: null,
    isFavorite: false,
    tags: brew.tags,
    brewedAt: new Date(),
    note: null,
  };
}

async function defaultsFromRecipe(userId: string, recipeId: string): Promise<BrewDefaults | null> {
  const recipe = await db.query.recipes.findFirst({
    where: and(eq(recipes.id, recipeId), eq(recipes.userId, userId)),
  });
  if (!recipe) return null;

  return {
    beanId: null,
    grinderId: recipe.grinderId,
    dripperId: recipe.dripperId,
    grindClicks: recipe.grindClicks,
    waterTempC: recipe.waterTempC,
    doseG: recipe.doseG,
    waterG: recipe.waterG,
    brewTimeSeconds: recipe.brewTimeSeconds,
    method: recipe.method,
    rating: null,
    isFavorite: false,
    tags: null,
    brewedAt: new Date(),
    note: null,
  };
}

export default async function NewBrewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const userId = await requireUserId();
  const params = await searchParams;
  const fromBrew = first(params.from);
  const fromRecipe = first(params.recipe);

  const [options, defaults] = await Promise.all([
    loadBrewOptions(userId),
    fromBrew
      ? defaultsFromBrew(userId, fromBrew)
      : fromRecipe
        ? defaultsFromRecipe(userId, fromRecipe)
        : Promise.resolve(null),
  ]);
  const { beans, grinders, drippers } = options;

  return (
    <div className="space-y-6">
      <PageHeader
        Icon={defaults ? RotateCcw : PlusCircle}
        title={defaults ? "Tekrar demle" : "Yeni demleme"}
        description={
          defaults
            ? "Parametreler önceki demlemeden geldi — değiştirip kaydet."
            : "Bugünün demlemesini kaydet."
        }
      />

      {beans.length === 0 && grinders.length === 0 && (
        <p className="text-muted-foreground text-sm">
          Henüz{" "}
          <Link href="/beans" className="underline">
            çekirdek
          </Link>{" "}
          veya{" "}
          <Link href="/equipment" className="underline">
            ekipman
          </Link>{" "}
          eklemedin — demlemeyi onlarsız da kaydedebilirsin.
        </p>
      )}

      <Card>
        <CardContent className="pt-2">
          <BrewForm
            beans={beans}
            grinders={grinders}
            drippers={drippers}
            defaults={defaults ?? undefined}
            submitLabel="Kaydet"
          />
        </CardContent>
      </Card>
    </div>
  );
}

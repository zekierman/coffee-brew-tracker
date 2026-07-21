import { desc, eq } from "drizzle-orm";
import { BookMarked, PlayCircle, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteRecipe } from "@/app/actions/brews";
import { PageHeader } from "@/components/page-header";
import { RecipeForm } from "@/components/recipe-form";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { recipes } from "@/db/schema";
import { loadBrewOptions } from "@/lib/brew-options";
import { formatBrewTime } from "@/lib/brews";
import { requireUserId } from "@/lib/session";

export default async function RecipesPage() {
  const userId = await requireUserId();
  const [rows, { grinders, drippers }] = await Promise.all([
    db.query.recipes.findMany({
      where: eq(recipes.userId, userId),
      orderBy: desc(recipes.createdAt),
      with: { grinder: true, dripper: true },
    }),
    loadBrewOptions(userId),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        Icon={BookMarked}
        title="Tarifler"
        description="Sık kullandığın ayarları kaydet, yeni demlemeyi tek tıkla doldur."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <PlusCircle className="text-primary size-4" aria-hidden />
            Yeni tarif
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RecipeForm grinders={grinders} drippers={drippers} />
        </CardContent>
      </Card>

      {rows.length === 0 ? (
        <p className="text-muted-foreground text-sm">Henüz tarif kaydetmedin.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {rows.map((recipe) => {
            const params = [
              recipe.grindClicks !== null && `${recipe.grindClicks} tık`,
              recipe.waterTempC && `${recipe.waterTempC} °C`,
              recipe.doseG && recipe.waterG && `${recipe.doseG}g / ${recipe.waterG}g`,
              recipe.brewTimeSeconds !== null && formatBrewTime(recipe.brewTimeSeconds),
            ].filter(Boolean) as string[];

            return (
              <li key={recipe.id}>
                <Card className="h-full transition-shadow duration-200 hover:shadow-lg hover:shadow-black/5">
                  <CardHeader>
                    <CardTitle className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-display text-lg tracking-tight">{recipe.name}</span>
                      {recipe.method && (
                        <span className="text-muted-foreground text-sm font-normal">
                          {recipe.method}
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {params.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {params.map((item) => (
                          <span
                            key={item}
                            className="bg-muted text-muted-foreground rounded-md px-2 py-1 font-mono text-xs tabular-nums"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}

                    {(recipe.grinder || recipe.dripper) && (
                      <p className="text-muted-foreground text-sm">
                        {[recipe.grinder?.name, recipe.dripper?.name].filter(Boolean).join(" · ")}
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/brews/new?recipe=${recipe.id}`}
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        <PlayCircle className="size-3.5" aria-hidden />
                        Bu tarifle demle
                      </Link>
                      <form action={deleteRecipe} className="ml-auto">
                        <input type="hidden" name="id" value={recipe.id} />
                        <Button type="submit" variant="ghost" size="sm">
                          <Trash2 className="size-3.5" aria-hidden />
                          Sil
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

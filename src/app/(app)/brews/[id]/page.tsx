import { and, eq } from "drizzle-orm";
import { Pencil } from "lucide-react";
import { notFound } from "next/navigation";
import { BrewForm } from "@/components/brew-form";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/db";
import { brews } from "@/db/schema";
import { loadBrewOptions } from "@/lib/brew-options";
import { requireUserId } from "@/lib/session";

export default async function EditBrewPage({ params }: { params: Promise<{ id: string }> }) {
  const userId = await requireUserId();
  const { id } = await params;

  const brew = await db.query.brews.findFirst({
    // userId kosulu: baskasinin demlemesi acilamaz.
    where: and(eq(brews.id, id), eq(brews.userId, userId)),
    with: { tastingNote: true },
  });
  if (!brew) notFound();

  const { beans, grinders, drippers } = await loadBrewOptions(userId);

  return (
    <div className="space-y-6">
      <PageHeader Icon={Pencil} title="Demlemeyi düzenle" />

      <Card>
        <CardContent className="pt-2">
          <BrewForm
            id={brew.id}
            beans={beans}
            grinders={grinders}
            drippers={drippers}
            submitLabel="Kaydet"
            defaults={{
              beanId: brew.beanId,
              grinderId: brew.grinderId,
              dripperId: brew.dripperId,
              grindClicks: brew.grindClicks,
              waterTempC: brew.waterTempC,
              doseG: brew.doseG,
              waterG: brew.waterG,
              brewTimeSeconds: brew.brewTimeSeconds,
              method: brew.method,
              rating: brew.rating,
              brewedAt: brew.brewedAt,
              note: brew.tastingNote
                ? {
                    aroma: brew.tastingNote.aroma,
                    flavor: brew.tastingNote.flavor,
                    acidity: brew.tastingNote.acidity,
                    body: brew.tastingNote.body,
                    sweetness: brew.tastingNote.sweetness,
                    aftertaste: brew.tastingNote.aftertaste,
                  }
                : null,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

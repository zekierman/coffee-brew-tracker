import Link from "next/link";
import { BrewForm } from "@/components/brew-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadBrewOptions } from "@/lib/brew-options";
import { requireUserId } from "@/lib/session";

export default async function NewBrewPage() {
  const userId = await requireUserId();
  const { beans, grinders, drippers } = await loadBrewOptions(userId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Yeni demleme</h1>
        <p className="text-muted-foreground">Bugünün demlemesini kaydet.</p>
      </div>

      {beans.length === 0 && grinders.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Henüz <Link href="/beans" className="underline">çekirdek</Link> veya{" "}
          <Link href="/equipment" className="underline">ekipman</Link> eklemedin — demlemeyi
          onlarsız da kaydedebilirsin.
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Demleme detayları</CardTitle>
        </CardHeader>
        <CardContent>
          <BrewForm beans={beans} grinders={grinders} drippers={drippers} submitLabel="Kaydet" />
        </CardContent>
      </Card>
    </div>
  );
}

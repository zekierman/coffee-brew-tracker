import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { BrewForm } from "@/components/brew-form";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { loadBrewOptions } from "@/lib/brew-options";
import { requireUserId } from "@/lib/session";

export default async function NewBrewPage() {
  const userId = await requireUserId();
  const { beans, grinders, drippers } = await loadBrewOptions(userId);

  return (
    <div className="space-y-6">
      <PageHeader Icon={PlusCircle} title="Yeni demleme" description="Bugünün demlemesini kaydet." />

      {beans.length === 0 && grinders.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Henüz <Link href="/beans" className="underline">çekirdek</Link> veya{" "}
          <Link href="/equipment" className="underline">ekipman</Link> eklemedin — demlemeyi
          onlarsız da kaydedebilirsin.
        </p>
      )}

      <Card>
        <CardContent className="pt-2">
          <BrewForm beans={beans} grinders={grinders} drippers={drippers} submitLabel="Kaydet" />
        </CardContent>
      </Card>
    </div>
  );
}

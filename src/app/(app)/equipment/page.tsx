import { asc, eq } from "drizzle-orm";
import { Pencil, PlusCircle, Trash2, Wrench } from "lucide-react";
import { deleteEquipment } from "@/app/actions/equipment";
import { EquipmentForm } from "@/components/equipment-form";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { equipment } from "@/db/schema";
import { EQUIPMENT_TYPE_LABELS } from "@/lib/equipment";
import { requireUserId } from "@/lib/session";

export default async function EquipmentPage() {
  const userId = await requireUserId();
  const items = await db
    .select()
    .from(equipment)
    .where(eq(equipment.userId, userId))
    .orderBy(asc(equipment.type), asc(equipment.name));

  return (
    <div className="space-y-6">
      <PageHeader
        Icon={Wrench}
        title="Ekipman"
        description="Değirmen, dripper ve diğer ekipmanların."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <PlusCircle className="text-primary size-4" aria-hidden />
            Yeni ekipman
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EquipmentForm submitLabel="Ekle" />
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">Henüz ekipman eklemedin.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id}>
              <Card className="h-full transition-shadow duration-200 hover:shadow-lg hover:shadow-black/5">
                <CardHeader>
                  <CardTitle className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-display text-lg tracking-tight">{item.name}</span>
                    <span className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-0.5 text-xs font-medium">
                      {EQUIPMENT_TYPE_LABELS[item.type]}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {item.brand && <p className="text-muted-foreground text-sm">{item.brand}</p>}
                  {item.notes && <p className="text-sm text-pretty">{item.notes}</p>}

                  <div className="flex items-start gap-2">
                    {/* ponytail: native <details> ile acilir duzenleme formu,
                        client-side state yonetimi ve ayri rota gerekmiyor. */}
                    <details className="w-full">
                      <summary className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors duration-200">
                        <Pencil className="size-3.5" aria-hidden />
                        Düzenle
                      </summary>
                      <div className="pt-4">
                        <EquipmentForm
                          id={item.id}
                          defaults={{
                            type: item.type,
                            name: item.name,
                            brand: item.brand,
                            notes: item.notes,
                          }}
                          submitLabel="Kaydet"
                        />
                      </div>
                    </details>

                    <form action={deleteEquipment}>
                      <input type="hidden" name="id" value={item.id} />
                      <Button type="submit" variant="ghost" size="sm">
                        <Trash2 className="size-3.5" aria-hidden />
                        Sil
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

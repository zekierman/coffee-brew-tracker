import { asc, eq } from "drizzle-orm";
import { deleteEquipment } from "@/app/actions/equipment";
import { EquipmentForm } from "@/components/equipment-form";
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
      <div>
        <h1 className="text-2xl font-semibold">Ekipman</h1>
        <p className="text-muted-foreground">Değirmen, dripper ve diğer ekipmanların.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yeni ekipman</CardTitle>
        </CardHeader>
        <CardContent>
          <EquipmentForm submitLabel="Ekle" />
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <p className="text-muted-foreground">Henüz ekipman eklemedin.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex flex-wrap items-baseline justify-between gap-2">
                    <span>{item.name}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {EQUIPMENT_TYPE_LABELS[item.type]}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {item.brand && <p className="text-sm text-muted-foreground">{item.brand}</p>}
                  {item.notes && <p className="text-sm">{item.notes}</p>}

                  <div className="flex items-start gap-2">
                    {/* ponytail: native <details> ile acilir duzenleme formu,
                        client-side state yonetimi ve ayri rota gerekmiyor. */}
                    <details className="w-full">
                      <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
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
                      <Button type="submit" variant="outline" size="sm">
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

import { desc, eq } from "drizzle-orm";
import { Bean, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { deleteBean } from "@/app/actions/beans";
import { BeanForm } from "@/components/bean-form";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { coffeeBeans } from "@/db/schema";
import { daysSinceRoast } from "@/lib/beans";
import { requireUserId } from "@/lib/session";

export default async function BeansPage() {
  const userId = await requireUserId();
  const beans = await db
    .select()
    .from(coffeeBeans)
    .where(eq(coffeeBeans.userId, userId))
    .orderBy(desc(coffeeBeans.createdAt));

  return (
    <div className="space-y-6">
      <PageHeader
        Icon={Bean}
        title="Çekirdekler"
        description="Künyeleriyle birlikte kahve çekirdeklerin."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <PlusCircle className="text-primary size-4" aria-hidden />
            Yeni çekirdek
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BeanForm submitLabel="Ekle" />
        </CardContent>
      </Card>

      {beans.length === 0 ? (
        <p className="text-muted-foreground text-sm">Henüz çekirdek eklemedin.</p>
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {beans.map((bean) => {
            const origin = [bean.country, bean.region, bean.farm].filter(Boolean).join(" · ");
            const details = [
              bean.variety && `Varyete: ${bean.variety}`,
              bean.processMethod && `İşleme: ${bean.processMethod}`,
              bean.roaster && `Kavurucu: ${bean.roaster}`,
              bean.roastDate && `Kavrum: ${bean.roastDate} (${daysSinceRoast(bean.roastDate)} gün)`,
            ].filter(Boolean) as string[];

            return (
              <li key={bean.id}>
                <Card className="h-full transition-shadow duration-200 hover:shadow-lg hover:shadow-black/5">
                  <CardHeader>
                    <CardTitle className="font-display text-lg tracking-tight">
                      {bean.name}
                    </CardTitle>
                    {origin && <p className="text-muted-foreground text-sm">{origin}</p>}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {details.length > 0 && (
                      <ul className="text-muted-foreground space-y-0.5 text-sm">
                        {details.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    )}
                    {bean.notes && <p className="text-sm text-pretty">{bean.notes}</p>}

                    <div className="flex items-start gap-2">
                      <details className="w-full">
                        <summary className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors duration-200">
                          <Pencil className="size-3.5" aria-hidden />
                          Düzenle
                        </summary>
                        <div className="pt-4">
                          <BeanForm
                            id={bean.id}
                            defaults={{
                              name: bean.name,
                              country: bean.country,
                              region: bean.region,
                              farm: bean.farm,
                              variety: bean.variety,
                              processMethod: bean.processMethod,
                              roastDate: bean.roastDate,
                              roaster: bean.roaster,
                              notes: bean.notes,
                            }}
                            submitLabel="Kaydet"
                          />
                        </div>
                      </details>

                      <form action={deleteBean}>
                        <input type="hidden" name="id" value={bean.id} />
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

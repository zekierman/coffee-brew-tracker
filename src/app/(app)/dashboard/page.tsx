import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Merhaba {session?.user?.name || "kahveci"}</h1>
      <p className="text-muted-foreground">
        Ekipman yönetimi ve demleme kaydı sonraki adımlarda burada olacak.
      </p>
    </div>
  );
}

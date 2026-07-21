import { redirect } from "next/navigation";
import { auth } from "@/auth";

// Tum veri sorgulari bu id ile filtrelenir. RLS yok, izolasyon uygulama
// katmaninda: user_id filtresi olmayan sorgu yazma.
export async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user.id;
}

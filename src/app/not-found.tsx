import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">Sayfa bulunamadı</h1>
      <p className="text-muted-foreground">Aradığın demleme silinmiş ya da hiç var olmamış.</p>
      <Link href="/dashboard" className={buttonVariants()}>
        Demlemelere dön
      </Link>
    </main>
  );
}

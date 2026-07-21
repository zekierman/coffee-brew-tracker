import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ponytail: tek guard burada; /dashboard ve altindaki tum rotalar bu layout'tan
// gectigi icin proxy.ts (eski middleware) gerekmiyor. bcrypt edge'de calismadigindan
// auth config'i edge/node diye ikiye bolmekten de kurtuluyoruz.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-svh">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link href="/dashboard" className="font-semibold">
              Brew Log
            </Link>
            <Link href="/brews/new" className="text-sm text-muted-foreground hover:text-foreground">
              Yeni demleme
            </Link>
            <Link href="/beans" className="text-sm text-muted-foreground hover:text-foreground">
              Çekirdekler
            </Link>
            <Link href="/equipment" className="text-sm text-muted-foreground hover:text-foreground">
              Ekipman
            </Link>
          </nav>
          <form action={logout} className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {session.user.name || session.user.email}
            </span>
            <Button type="submit" variant="outline" size="sm">
              Çıkış
            </Button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}

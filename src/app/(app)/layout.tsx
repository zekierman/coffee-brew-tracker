import { Download, LogOut } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { auth } from "@/auth";
import { Logo } from "@/components/logo";
import { MainNav } from "@/components/main-nav";
import { Button, buttonVariants } from "@/components/ui/button";

// ponytail: tek guard burada; /dashboard ve altindaki tum rotalar bu layout'tan
// gectigi icin proxy.ts (eski middleware) gerekmiyor. bcrypt edge'de calismadigindan
// auth config'i edge/node diye ikiye bolmekten de kurtuluyoruz.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-svh">
      <header className="bg-background/85 sticky top-0 z-20 border-b backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/dashboard" className="shrink-0">
            <Logo />
          </Link>

          <div className="flex items-center gap-1">
            <span className="text-muted-foreground mr-2 hidden text-sm md:inline">
              {session.user.name || session.user.email}
            </span>
            <a
              href="/api/export?format=csv"
              download
              className={buttonVariants({ variant: "ghost", size: "sm" })}
              title="Demlemeleri CSV olarak indir"
            >
              <Download className="size-4" aria-hidden />
              <span className="hidden sm:inline">CSV</span>
            </a>
            <form action={logout}>
              <Button type="submit" variant="ghost" size="sm" aria-label="Çıkış yap">
                <LogOut className="size-4" aria-hidden />
                <span className="hidden sm:inline">Çıkış</span>
              </Button>
            </form>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-2 pb-2">
          <MainNav />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}

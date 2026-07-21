import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LogoMark } from "@/components/logo";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  if (await auth()) redirect("/dashboard");

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="bg-primary text-primary-foreground grid size-14 place-items-center rounded-2xl shadow-sm">
            <LogoMark className="size-8" />
          </span>
          <div>
            <p className="font-display text-2xl font-semibold tracking-tight">
              Brew<span className="text-primary">Log</span>
            </p>
            <p className="text-muted-foreground mt-1 text-sm">Nitelikli kahve demleme günlüğü</p>
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}

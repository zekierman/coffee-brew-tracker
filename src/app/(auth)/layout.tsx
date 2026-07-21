import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  if (await auth()) redirect("/dashboard");

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">{children}</div>
    </main>
  );
}

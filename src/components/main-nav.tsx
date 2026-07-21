"use client";

import { BarChart3, Bean, BookMarked, CircleGauge, PlusCircle, Wrench } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/dashboard", label: "Demlemeler", Icon: CircleGauge },
  { href: "/brews/new", label: "Yeni", Icon: PlusCircle },
  { href: "/stats", label: "İstatistik", Icon: BarChart3 },
  { href: "/recipes", label: "Tarifler", Icon: BookMarked },
  { href: "/beans", label: "Çekirdekler", Icon: Bean },
  { href: "/equipment", label: "Ekipman", Icon: Wrench },
] as const;

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 overflow-x-auto">
      {LINKS.map(({ href, label, Icon }) => {
        const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm whitespace-nowrap transition-colors duration-200 ${
              active
                ? "bg-secondary text-secondary-foreground font-medium"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            }`}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

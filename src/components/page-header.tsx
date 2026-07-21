import type { LucideIcon } from "lucide-react";

type Props = {
  Icon: LucideIcon;
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function PageHeader({ Icon, title, description, children }: Props) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <span className="bg-secondary text-primary ring-primary/10 grid size-11 shrink-0 place-items-center rounded-xl ring-1">
          <Icon className="size-5" aria-hidden />
        </span>
        <div>
          <h1 className="font-display text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">
            {title}
          </h1>
          {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

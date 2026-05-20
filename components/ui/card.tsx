import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border border-(--color-line) bg-(--color-bg-2) p-5 transition hover:border-(--color-line-2)",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mb-5 flex items-start justify-between gap-4 pb-4 border-b border-(--color-line)",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-[16px] tracking-[-0.015em] text-(--color-ink)", className)}
      style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
      {...props}
    >
      {children}
    </h2>
  );
}

export function CardLabel({ children }: { children: ReactNode }) {
  return (
    <div className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-(--color-ink-mute)">
      {children}
    </div>
  );
}

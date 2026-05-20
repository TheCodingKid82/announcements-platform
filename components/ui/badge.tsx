import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

type Tone = "default" | "red" | "green" | "amber" | "outline";

const tones: Record<Tone, string> = {
  default: "bg-(--color-bg-3) text-(--color-ink-dim) border border-(--color-line)",
  red: "bg-(--color-red-soft) text-(--color-red-bright) border border-(--color-red)/30",
  green: "bg-(--color-green)/12 text-(--color-green) border border-(--color-green)/30",
  amber: "bg-(--color-amber)/12 text-(--color-amber) border border-(--color-amber)/30",
  outline: "bg-transparent text-(--color-ink-dim) border border-(--color-line-2)"
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & { tone?: Tone };

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-[3px] font-mono text-[10px] tracking-[0.12em] uppercase",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}

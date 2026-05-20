import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { LinkButton } from "./button";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: string;
  href?: string;
  icon?: ReactNode;
};

export function EmptyState({ title, description, action, href, icon }: EmptyStateProps) {
  return (
    <div className="border border-(--color-line) bg-(--color-bg-2) px-8 py-16 text-center">
      <div className="mx-auto mb-6 grid h-12 w-12 place-items-center border border-(--color-line-2) text-(--color-red)">
        {icon ?? <Inbox className="h-5 w-5" strokeWidth={1.6} />}
      </div>
      <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-(--color-red) mb-4">
        No data yet
      </div>
      <h3
        className="text-(--color-ink) tracking-[-0.025em]"
        style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "32px", lineHeight: 1.05 }}
      >
        {title}
      </h3>
      <p className="mx-auto mt-4 max-w-md text-[14.5px] text-(--color-ink-dim) leading-relaxed">
        {description}
      </p>
      {action && href ? (
        <div className="mt-8">
          <LinkButton href={href}>{action}</LinkButton>
        </div>
      ) : null}
    </div>
  );
}

import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string;
  detail?: string;
  delta?: { value: string; positive?: boolean };
  icon?: ReactNode;
};

export function StatCard({ label, value, detail, delta }: StatCardProps) {
  return (
    <div className="relative border border-(--color-line) bg-(--color-bg-2) p-5 transition hover:border-(--color-line-2)">
      <div className="flex items-center justify-between">
        <div className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-(--color-ink-mute)">
          {label}
        </div>
        {delta ? (
          <div
            className={`font-mono text-[10.5px] tracking-[0.06em] ${
              delta.positive ? "text-(--color-green)" : "text-(--color-red)"
            }`}
          >
            {delta.positive ? "+" : ""}
            {delta.value}
          </div>
        ) : null}
      </div>
      <div
        className="mt-4 text-(--color-ink)"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "44px",
          lineHeight: 1,
          letterSpacing: "-0.04em"
        }}
      >
        {value}
      </div>
      {detail ? (
        <div className="mt-3 text-[13px] text-(--color-ink-dim)">{detail}</div>
      ) : null}
    </div>
  );
}

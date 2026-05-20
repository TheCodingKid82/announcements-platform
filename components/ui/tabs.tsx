"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export function Tabs({ tabs }: { tabs: { label: string; content: React.ReactNode }[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="mb-6 flex border border-(--color-line-2) w-fit">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            onClick={() => setActive(index)}
            className={cn(
              "border-r border-(--color-line-2) px-4 py-2.5 font-mono text-[11px] tracking-[0.14em] uppercase transition last:border-r-0",
              active === index
                ? "bg-(--color-red) text-white"
                : "text-(--color-ink-dim) hover:text-(--color-ink)"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs[active]?.content}
    </div>
  );
}

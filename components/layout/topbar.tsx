import { Bell, Search } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { formatNumber } from "@/lib/utils/format";

export function Topbar({ live }: { live: { active: boolean; processed: number; total: number } }) {
  const label = live.active ? "Broadcasting" : "Idle";

  return (
    <header className="sticky top-0 z-30 border-b border-(--color-line) bg-(--color-bg)/85 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        <MobileNav />

        {/* Search */}
        <div className="flex flex-1 items-center gap-3 border border-(--color-line) bg-(--color-bg-2) px-3 py-2 text-(--color-ink-mute) transition focus-within:border-(--color-line-2)">
          <Search className="h-[14px] w-[14px]" strokeWidth={1.75} />
          <span className="font-mono text-[11.5px] tracking-[0.08em] uppercase">
            Search announcements · agents · subscribers
          </span>
          <span className="ml-auto font-mono text-[10px] tracking-[0.12em] text-(--color-ink-mute)/70">
            ⌘K
          </span>
        </div>

        {/* New broadcast indicator */}
        <div className="hidden items-center gap-2 border border-(--color-line) bg-(--color-bg-2) px-3 py-2 md:flex">
          <span className="live-dot" />
          <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-(--color-ink-dim)">
            <span className="text-(--color-red)">{label}</span> · {formatNumber(live.processed)} / {formatNumber(live.total)}
          </span>
        </div>

        <button
          aria-label="Notifications"
          className="relative grid h-9 w-9 place-items-center border border-(--color-line) text-(--color-ink-dim) transition hover:border-(--color-line-2) hover:text-(--color-ink)"
        >
          <Bell className="h-[14px] w-[14px]" strokeWidth={1.75} />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-(--color-red) shadow-[0_0_8px_rgba(255,36,36,0.6)]" />
        </button>

        <div className="grid h-9 w-9 place-items-center bg-(--color-red) text-[13px] font-semibold text-white shadow-[0_0_18px_rgba(255,36,36,0.35)]">
          A
        </div>
      </div>
    </header>
  );
}

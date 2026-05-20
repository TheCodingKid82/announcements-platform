"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Bot, Home, Layers, Megaphone, PenLine, Settings, Users } from "lucide-react";
import Image from "next/image";
import type { OrganizationRecord } from "@/lib/data/types";

const nav = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/compose", label: "Compose", icon: PenLine },
  { href: "/dashboard/announcements", label: "Announcements", icon: Megaphone },
  { href: "/dashboard/agents", label: "Agents", icon: Bot },
  { href: "/dashboard/sources", label: "Sources", icon: Layers },
  { href: "/dashboard/audiences", label: "Audiences", icon: Users },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 }
];

export function Sidebar({ org }: { org: OrganizationRecord }) {
  const pathname = usePathname();
  const smsCreditsUsed = org.smsCreditsUsed ?? 0;
  const smsCreditsIncluded = org.smsCreditsIncluded ?? 0;
  const creditPercent = smsCreditsIncluded > 0 ? Math.min(100, Math.round((smsCreditsUsed / smsCreditsIncluded) * 100)) : 0;

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-(--color-line) bg-(--color-bg-2) lg:flex">
      {/* Brand */}
      <Link
        href="/dashboard"
        className="flex h-16 items-center gap-3 border-b border-(--color-line) px-5"
      >
        <Image
          src="/logo-light.png"
          alt=""
          width={28}
          height={24}
          className="h-6 w-7 object-contain drop-shadow-[0_0_12px_rgba(255,36,36,0.5)]"
        />
        <span
          className="text-[15px] tracking-[-0.025em] text-(--color-ink)"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
        >
          Announcements
        </span>
      </Link>

      {/* Status strip */}
      <div className="flex items-center justify-between border-b border-(--color-line) bg-(--color-bg) px-5 py-3 font-mono text-[10.5px] tracking-[0.16em] uppercase text-(--color-ink-mute)">
        <span>Workspace · v1</span>
        <span className="inline-flex items-center gap-2 text-(--color-red)">
          <span className="live-dot" />
          Live
        </span>
      </div>

      {/* Nav */}
      <nav className="scrollarea flex-1 overflow-y-auto py-3">
        <div className="px-5 pb-2 pt-1 font-mono text-[10.5px] tracking-[0.18em] uppercase text-(--color-ink-mute)">
          Workspace
        </div>
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-5 py-2.5 text-[13.5px] transition ${
                active
                  ? "bg-(--color-red-soft) text-(--color-ink)"
                  : "text-(--color-ink-dim) hover:bg-white/[0.03] hover:text-(--color-ink)"
              }`}
            >
              {active ? <span className="absolute left-0 top-0 h-full w-[3px] bg-(--color-red)" /> : null}
              <item.icon className="h-[15px] w-[15px]" strokeWidth={1.75} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}

        <div className="mt-6 px-5 pb-2 pt-1 font-mono text-[10.5px] tracking-[0.18em] uppercase text-(--color-ink-mute)">
          Account
        </div>
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-3 px-5 py-2.5 text-[13.5px] transition ${
            pathname?.startsWith("/dashboard/settings")
              ? "bg-(--color-red-soft) text-(--color-ink)"
              : "text-(--color-ink-dim) hover:bg-white/[0.03] hover:text-(--color-ink)"
          }`}
        >
          <Settings className="h-[15px] w-[15px]" strokeWidth={1.75} />
          Settings
        </Link>
      </nav>

      {/* Org card */}
      <div className="border-t border-(--color-line) p-4">
        <div className="border border-(--color-line) bg-(--color-bg) p-3">
          <div className="flex items-center justify-between">
            <span
              className="text-[13px] tracking-[-0.005em] text-(--color-ink)"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              {org.name}
            </span>
            <span className="font-mono text-[9.5px] tracking-[0.16em] uppercase text-(--color-red)">
              {org.plan}
            </span>
          </div>
          <div className="mt-2 font-mono text-[10.5px] tracking-[0.08em] text-(--color-ink-mute)">
            {smsCreditsUsed.toLocaleString()} / {smsCreditsIncluded.toLocaleString()} texts · {creditPercent}%
          </div>
          <div className="mt-2 h-[3px] w-full bg-(--color-line)">
            <div className="h-full bg-(--color-red)" style={{ width: `${creditPercent}%` }} />
          </div>
        </div>
      </div>
    </aside>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = ["Overview", "Compose", "Announcements", "Agents", "Sources", "Audiences", "Analytics"];

function hrefFor(label: string) {
  return label === "Overview" ? "/dashboard" : `/dashboard/${label.toLowerCase()}`;
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button
        className="grid h-9 w-9 place-items-center border border-(--color-line) text-(--color-ink-dim) transition hover:text-(--color-ink)"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-[16px] w-[16px]" strokeWidth={1.75} />
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="h-full w-80 max-w-[85vw] border-r border-(--color-line) bg-(--color-bg-2) p-5">
            <div className="mb-8 flex items-center justify-between">
              <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3">
                <Image src="/logo-light.png" alt="" width={28} height={24} className="h-6 w-7 object-contain" />
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700 }} className="text-[15px] tracking-[-0.025em] text-(--color-ink)">
                  Announcements
                </span>
              </Link>
              <button
                className="grid h-9 w-9 place-items-center border border-(--color-line) text-(--color-ink-dim) transition hover:text-(--color-ink)"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-[16px] w-[16px]" strokeWidth={1.75} />
              </button>
            </div>
            <nav className="space-y-px">
              {links.map((link) => (
                <Link
                  key={link}
                  href={hrefFor(link)}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 text-[13.5px] text-(--color-ink-dim) transition hover:bg-(--color-red-soft) hover:text-(--color-ink)"
                >
                  {link}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}

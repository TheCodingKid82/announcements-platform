"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "./button";

export function Dropdown({ label, items }: { label: string; items: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <Button variant="secondary" onClick={() => setOpen((value) => !value)}>
        {label}
        <ChevronDown className="h-4 w-4" />
      </Button>
      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-48 rounded-md border border-white/10 bg-zinc-950 p-2 shadow-xl">
          {items.map((item) => (
            <button key={item} className="block w-full rounded px-3 py-2 text-left text-sm text-zinc-300 hover:bg-white/8">
              {item}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

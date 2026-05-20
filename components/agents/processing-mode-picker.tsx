"use client";

import { cn } from "@/lib/utils/cn";

const modes = [
  { id: "passthrough", title: "Passthrough", detail: "Forward raw event content directly." },
  { id: "template", title: "Template", detail: "Insert event values into reusable copy." },
  { id: "transform", title: "Transform", detail: "Ask AI to rewrite event data." },
  { id: "agent", title: "Agent", detail: "Let an agent fetch context and decide." }
];

export function ProcessingModePicker({ value, onChange }: { value: string; onChange: (value: "passthrough" | "template" | "transform" | "agent") => void }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {modes.map((mode) => (
        <button key={mode.id} type="button" onClick={() => onChange(mode.id as "passthrough" | "template" | "transform" | "agent")} className={cn("rounded-md border p-4 text-left transition", value === mode.id ? "border-blue-400 bg-blue-500/10" : "border-white/10 bg-white/[0.03] hover:border-white/20")}>
          <div className="font-medium text-white">{mode.title}</div>
          <div className="mt-1 text-sm text-zinc-500">{mode.detail}</div>
        </button>
      ))}
    </div>
  );
}

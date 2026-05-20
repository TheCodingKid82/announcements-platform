"use client";

import type { ListRecord } from "@/lib/data/types";

export function AudiencePicker({ lists, selected, setSelected }: { lists: ListRecord[]; selected: string[]; setSelected: (value: string[]) => void }) {
  return (
    <div className="space-y-2">
      {lists.length === 0 ? (
        <div className="rounded-md border border-white/10 p-3 text-sm text-zinc-500">Create an audience list before sending.</div>
      ) : lists.map((list) => (
        <label key={list.id} className="flex items-center justify-between rounded-md border border-white/10 p-3 text-sm text-zinc-300">
          <span>{list.name}</span>
          <span className="flex items-center gap-3 text-zinc-500">
            {list.subscriberCount.toLocaleString()}
            <input
              type="checkbox"
              checked={selected.includes(list.id)}
              onChange={(event) => setSelected(event.target.checked ? [...selected, list.id] : selected.filter((item) => item !== list.id))}
            />
          </span>
        </label>
      ))}
    </div>
  );
}

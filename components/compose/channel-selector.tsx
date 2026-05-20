"use client";

import type { Channel } from "@/lib/data/types";

export function ChannelSelector({ channels, setChannels }: { channels: Channel[]; setChannels: (value: Channel[]) => void }) {
  const options: Channel[] = ["sms", "email", "imessage"];
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label key={option} className="flex items-center justify-between rounded-md border border-white/10 p-3 text-sm text-zinc-300">
          <span>{option === "sms" ? "SMS" : option === "email" ? "Email" : "iMessage"}</span>
          <input
            type="checkbox"
            checked={channels.includes(option)}
            onChange={(event) => setChannels(event.target.checked ? [...channels, option] : channels.filter((item) => item !== option))}
          />
        </label>
      ))}
    </div>
  );
}

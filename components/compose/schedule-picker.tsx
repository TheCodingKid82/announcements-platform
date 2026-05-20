"use client";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function SchedulePicker({ mode, setMode, scheduledFor, setScheduledFor }: { mode: string; setMode: (value: string) => void; scheduledFor: string; setScheduledFor: (value: string) => void }) {
  return (
    <div className="space-y-3">
      <Select value={mode} onChange={(event) => setMode(event.target.value)}>
        <option value="now">Send now</option>
        <option value="later">Schedule</option>
      </Select>
      {mode === "later" ? <Input type="datetime-local" value={scheduledFor} onChange={(event) => setScheduledFor(event.target.value)} /> : null}
    </div>
  );
}

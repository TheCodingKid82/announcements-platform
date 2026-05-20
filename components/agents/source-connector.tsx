"use client";

import { Select } from "@/components/ui/select";
import type { SourceRecord } from "@/lib/data/types";

export function SourceConnector({ sources, value, onChange }: { sources: SourceRecord[]; value: string; onChange: (value: string) => void }) {
  return (
    <Select value={value} onChange={(event) => onChange(event.target.value)}>
      {sources.map((source) => <option key={source.id} value={source.id}>{source.name}</option>)}
      <option value="new">Create new source</option>
    </Select>
  );
}

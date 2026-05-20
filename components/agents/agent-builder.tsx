"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { AudiencePicker } from "@/components/compose/audience-picker";
import { ChannelSelector } from "@/components/compose/channel-selector";
import { ProcessingModePicker } from "./processing-mode-picker";
import { SourceConnector } from "./source-connector";
import type { AgentRecord, Channel, ListRecord, SourceRecord } from "@/lib/data/types";

export function AgentBuilder({ lists: availableLists, sources, agent }: { lists: ListRecord[]; sources: SourceRecord[]; agent?: AgentRecord | null }) {
  const router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState(agent?.processingMode ?? "agent");
  const [name, setName] = useState(agent?.name ?? "");
  const [description, setDescription] = useState(agent?.description ?? "");
  const [triggerType, setTriggerType] = useState(agent?.triggerType ?? "source_event");
  const [sourceId, setSourceId] = useState(agent?.sourceIds[0] ?? sources[0]?.id ?? "");
  const [prompt, setPrompt] = useState(agent?.systemPrompt ?? "");
  const [lists, setLists] = useState<string[]>(agent?.defaultListIds ?? (availableLists[0] ? [availableLists[0].id] : []));
  const [channels, setChannels] = useState<Channel[]>(agent?.defaultChannels ?? ["sms", "email"]);
  const [saving, setSaving] = useState(false);

  async function create() {
    setSaving(true);
    const response = await fetch(agent ? `/api/internal/agents/${agent.id}` : "/api/internal/agents", {
      method: agent ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        processingMode: mode,
        triggerType,
        sourceIds: sourceId && sourceId !== "new" ? [sourceId] : [],
        systemPrompt: prompt,
        templateText: mode === "template" ? prompt : null,
        defaultListIds: lists,
        defaultChannels: channels
      })
    });
    setSaving(false);
    if (!response.ok) {
      toast.push("Agent was not saved", "error");
      return;
    }
    const payload = await response.json() as { data: { id: string } };
    toast.push(agent ? "Agent updated" : "Agent created");
    router.push(`/dashboard/agents/${payload.data.id}`);
  }

  return (
    <Card>
      <div className="mb-6 flex gap-2">
        {[1, 2, 3, 4].map((number) => (
          <button key={number} onClick={() => setStep(number)} className={step === number ? "h-2 flex-1 rounded bg-blue-500" : "h-2 flex-1 rounded bg-white/10"} aria-label={`Step ${number}`} />
        ))}
      </div>
      {step === 1 ? (
        <div className="space-y-4">
          <Input placeholder="Agent name" value={name} onChange={(event) => setName(event.target.value)} />
          <Textarea placeholder="Describe what this agent does" value={description} onChange={(event) => setDescription(event.target.value)} />
        </div>
      ) : null}
      {step === 2 ? (
        <div className="space-y-4">
          <Select value={triggerType} onChange={(event) => setTriggerType(event.target.value)}>
            <option value="source_event">Source event</option>
            <option value="schedule">Schedule</option>
            <option value="manual">Manual</option>
          </Select>
          <SourceConnector sources={sources} value={sourceId} onChange={setSourceId} />
          <Select defaultValue="morning">
            <option value="morning">Every morning at 9 AM</option>
            <option value="hour">Every hour</option>
            <option value="friday">Every Friday at 5 PM</option>
            <option value="custom">Custom cron</option>
          </Select>
        </div>
      ) : null}
      {step === 3 ? (
        <div className="space-y-4">
          <ProcessingModePicker value={mode} onChange={setMode} />
          <Textarea placeholder="Describe how the agent should process events" value={prompt} onChange={(event) => setPrompt(event.target.value)} />
        </div>
      ) : null}
      {step === 4 ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div><h3 className="mb-3 text-sm font-medium text-white">Default lists</h3><AudiencePicker lists={availableLists} selected={lists} setSelected={setLists} /></div>
          <div><h3 className="mb-3 text-sm font-medium text-white">Default channels</h3><ChannelSelector channels={channels} setChannels={setChannels} /></div>
        </div>
      ) : null}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" disabled={step === 1} onClick={() => setStep(step - 1)}>Back</Button>
        {step < 4 ? <Button onClick={() => setStep(step + 1)}>Continue</Button> : <Button onClick={create} disabled={saving || !name}>{saving ? "Saving" : agent ? "Update agent" : "Create agent"}</Button>}
      </div>
    </Card>
  );
}

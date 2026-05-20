"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiSourceSetup } from "@/components/sources/api-source-setup";
import { ScheduleSetup } from "@/components/sources/schedule-setup";
import { WebhookSetup } from "@/components/sources/webhook-setup";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";

export default function NewSourcePage() {
  const [type, setType] = useState("webhook");
  const [name, setName] = useState("");
  const [result, setResult] = useState<{ source: { id: string }; webhookUrl: string | null; webhook: { secret: string } | null } | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const toast = useToast();

  async function save() {
    setSaving(true);
    const response = await fetch("/api/internal/sources", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, type, config: {} })
    });
    setSaving(false);
    if (!response.ok) {
      toast.push("Source was not saved", "error");
      return;
    }
    const payload = await response.json() as { data: { source: { id: string }; webhookUrl: string | null; webhook: { secret: string } | null } };
    setResult(payload.data);
    toast.push("Source saved");
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-semibold tracking-tight text-white">Add Source</h1><p className="mt-2 text-zinc-500">Create a webhook, poller, feed, or schedule input.</p></div>
      <Card className="space-y-4">
        <Input placeholder="Source name" value={name} onChange={(event) => setName(event.target.value)} />
        <Select value={type} onChange={(event) => setType(event.target.value)}>
          <option value="webhook">Webhook</option>
          <option value="api_poll">API Poll</option>
          <option value="rss">RSS Feed</option>
          <option value="schedule">Schedule</option>
        </Select>
        {type === "webhook" ? <WebhookSetup url={result?.webhookUrl} secret={result?.webhook?.secret} /> : null}
        {type === "api_poll" || type === "rss" ? <ApiSourceSetup /> : null}
        {type === "schedule" ? <ScheduleSetup /> : null}
        <div className="flex gap-3">
          <Button onClick={save} disabled={saving || !name}>{saving ? "Saving" : "Save source"}</Button>
          {result ? <Button variant="secondary" onClick={() => router.push(`/dashboard/sources/${result.source.id}`)}>Open source</Button> : null}
        </div>
      </Card>
    </div>
  );
}

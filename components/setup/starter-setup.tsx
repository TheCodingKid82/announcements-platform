"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bot, Layers, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

export function StarterSetup({ show }: { show: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState<string | null>(null);

  if (!show) return null;

  async function setup() {
    setSaving(true);
    const response = await fetch("/api/internal/setup", { method: "POST" });
    setSaving(false);
    if (!response.ok) {
      toast.push("Setup was not completed", "error");
      return;
    }
    const payload = await response.json() as { data: { webhookUrl: string | null } };
    setWebhookUrl(payload.data.webhookUrl);
    toast.push("Workspace set up");
    router.refresh();
  }

  return (
    <Card className="border-(--color-red)/30 bg-(--color-bg-2)">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-(--color-red)">Start here</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Set up the workspace</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">Create a primary audience, an inbound webhook, and an announcement intake agent.</p>
          <div className="mt-4 grid gap-2 text-sm text-zinc-300 md:grid-cols-3">
            <div className="flex items-center gap-2"><Users className="h-4 w-4 text-(--color-red)" /> Audience list</div>
            <div className="flex items-center gap-2"><Layers className="h-4 w-4 text-(--color-red)" /> Webhook source</div>
            <div className="flex items-center gap-2"><Bot className="h-4 w-4 text-(--color-red)" /> Starter agent</div>
          </div>
          {webhookUrl ? <div className="mt-4 break-all border border-white/10 bg-black/30 p-3 font-mono text-xs text-zinc-300">{webhookUrl}</div> : null}
        </div>
        <Button onClick={setup} disabled={saving}>{saving ? "Setting up" : "Set up now"}</Button>
      </div>
    </Card>
  );
}

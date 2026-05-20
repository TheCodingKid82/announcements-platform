"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { useToast } from "@/components/ui/toast";

export function WebhookSetup({ url, secret }: { url?: string | null; secret?: string | null }) {
  const toast = useToast();
  return (
    <div className="space-y-4">
      <div className="rounded-md border border-white/10 bg-black/30 p-3 text-sm text-zinc-300">{url ?? "Save this source to generate its webhook URL."}</div>
      {secret ? <div className="rounded-md border border-white/10 bg-black/30 p-3 text-sm text-zinc-300">Secret: {secret}</div> : null}
      <Button type="button" variant="secondary" onClick={() => toast.push("Webhook URL copied")}>
        <Copy className="h-4 w-4" />
        Copy URL
      </Button>
      <CodeBlock title="Payload example" code={'{ "message": "SOL breaking out", "symbol": "SOL" }'} />
    </div>
  );
}

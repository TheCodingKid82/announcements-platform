"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Table, Td, Th, THead } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils/format";
import type { ApiKeyRecord } from "@/lib/data/types";

export function ApiKeysClient({ keys }: { keys: ApiKeyRecord[] }) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function create() {
    setSaving(true);
    const response = await fetch("/api/internal/api-keys", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, scopes: ["send", "agents", "lists", "sources", "analytics"] })
    });
    setSaving(false);
    if (!response.ok) {
      toast.push("API key was not created", "error");
      return;
    }
    const payload = await response.json() as { data: { token: string } };
    setToken(payload.data.token);
    toast.push("API key created");
    router.refresh();
  }

  return (
    <>
      <div className="flex justify-between gap-4"><div><h1 className="text-3xl font-semibold tracking-tight text-white">API Keys</h1><p className="mt-2 text-zinc-500">Create keys and manage scopes.</p></div><Button onClick={() => setOpen(true)}>Create key</Button></div>
      <Card><Table><THead><tr><Th>Name</Th><Th>Prefix</Th><Th>Scopes</Th><Th>Last used</Th></tr></THead><tbody>{keys.length === 0 ? <tr><Td colSpan={4} className="py-8 text-center text-zinc-500">No API keys yet.</Td></tr> : keys.map((key) => <tr key={key.id}><Td>{key.name}</Td><Td>{key.keyPrefix}</Td><Td>{key.scopes.join(", ")}</Td><Td>{formatDate(key.lastUsedAt)}</Td></tr>)}</tbody></Table></Card>
      <Modal open={open} title="New API key" onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Key name" />
          {token ? <div className="rounded-md border border-white/10 bg-black/30 p-3 text-sm text-zinc-300 break-all">{token}</div> : null}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setOpen(false)}>Done</Button>
            <Button onClick={create} disabled={saving || !name}>{saving ? "Creating" : "Create key"}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

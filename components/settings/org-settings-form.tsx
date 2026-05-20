"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

export function OrgSettingsForm({ name: initialName, slug: initialSlug }: { name: string; slug: string }) {
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState(initialName);
  const [slug, setSlug] = useState(initialSlug);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const response = await fetch("/api/internal/settings", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, slug })
    });
    setSaving(false);
    if (!response.ok) {
      toast.push("Settings were not saved", "error");
      return;
    }
    toast.push("Settings saved");
    router.refresh();
  }

  return (
    <Card className="max-w-2xl space-y-4">
      <Input value={name} onChange={(event) => setName(event.target.value)} />
      <Input value={slug} onChange={(event) => setSlug(event.target.value)} />
      <Button onClick={save} disabled={saving || !name || !slug}>{saving ? "Saving" : "Save changes"}</Button>
    </Card>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

export function AddSubscriberButton({ listId }: { listId?: string }) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/internal/subscribers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        listId,
        name: String(form.get("name") ?? ""),
        phoneE164: String(form.get("phoneE164") ?? ""),
        email: String(form.get("email") ?? ""),
        channels: ["sms", "email"]
      })
    });
    setSaving(false);
    if (!response.ok) {
      toast.push("Subscriber was not saved", "error");
      return;
    }
    toast.push("Subscriber saved");
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Subscriber</Button>
      <Modal open={open} title="Add subscriber" onClose={() => setOpen(false)}>
        <form className="space-y-3" onSubmit={submit}>
          <Input name="name" placeholder="Name" />
          <Input name="phoneE164" placeholder="Phone number" />
          <Input name="email" type="email" placeholder="Email" />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving" : "Save subscriber"}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

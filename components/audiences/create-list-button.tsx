"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";

export function CreateListButton() {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/internal/lists", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: String(form.get("name") ?? ""),
        description: String(form.get("description") ?? "")
      })
    });
    setSaving(false);
    if (!response.ok) {
      toast.push("List was not saved", "error");
      return;
    }
    toast.push("List saved");
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>New List</Button>
      <Modal open={open} title="New list" onClose={() => setOpen(false)}>
        <form className="space-y-3" onSubmit={submit}>
          <Input name="name" placeholder="List name" required />
          <Textarea name="description" placeholder="Description" />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving" : "Create list"}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

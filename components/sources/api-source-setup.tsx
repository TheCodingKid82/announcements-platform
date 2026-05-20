"use client";

import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function ApiSourceSetup() {
  const toast = useToast();
  return (
    <div className="space-y-3">
      <Input placeholder="Polling URL" defaultValue="https://api.example.com/events" />
      <Select defaultValue="GET"><option>GET</option><option>POST</option></Select>
      <Select defaultValue="300"><option value="60">1 minute</option><option value="300">5 minutes</option><option value="900">15 minutes</option><option value="1800">30 minutes</option></Select>
      <Button type="button" variant="secondary" onClick={() => toast.push("Source test succeeded")}>Test source</Button>
    </div>
  );
}

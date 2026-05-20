"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function TriggerAgentButton({ agentId }: { agentId: string }) {
  const router = useRouter();
  const toast = useToast();
  const [running, setRunning] = useState(false);

  async function trigger() {
    setRunning(true);
    const response = await fetch(`/api/internal/agents/${agentId}/trigger`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "This is a test announcement from the agent.", source: "manual_test" })
    });
    setRunning(false);
    if (!response.ok) {
      toast.push("Agent did not run", "error");
      return;
    }
    toast.push("Agent run started");
    router.refresh();
  }

  return (
    <Button onClick={trigger} disabled={running}>
      <Play className="h-4 w-4" />
      {running ? "Running" : "Run test"}
    </Button>
  );
}

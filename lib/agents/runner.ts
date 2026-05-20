import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { createId } from "@/lib/utils/id";
import { enqueueDeliveries } from "@/lib/delivery/router";
import { saveAgentRun } from "@/lib/data/platform";
import { agentTools } from "./tools";

export type AgentConfig = {
  id: string;
  orgId: string;
  processingMode: "passthrough" | "template" | "transform" | "agent";
  templateText?: string | null;
  systemPrompt?: string | null;
  userPromptTemplate?: string | null;
  model?: string | null;
  defaultListIds?: string[] | null;
  defaultChannels?: string[] | null;
};

function interpolate(template: string, input: unknown) {
  const source = typeof input === "object" && input !== null ? input as Record<string, unknown> : { message: input };
  return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, path: string) => {
    const value = path.split(".").reduce<unknown>((current, key) => current && typeof current === "object" ? (current as Record<string, unknown>)[key] : undefined, source);
    return value == null ? "" : String(value);
  });
}

export async function runAgent(agent: AgentConfig, input: unknown) {
  const started = Date.now();
  const runId = createId("run");
  let output = "";
  let reasoning = "";

  if (agent.processingMode === "passthrough") {
    output = typeof input === "string" ? input : JSON.stringify(input);
  }

  if (agent.processingMode === "template") {
    output = interpolate(agent.templateText ?? "{{message}}", input);
  }

  if (agent.processingMode === "transform" || agent.processingMode === "agent") {
    if (!process.env.ANTHROPIC_API_KEY) {
      output = typeof input === "object" && input !== null && "message" in input
        ? String((input as { message?: unknown }).message)
        : "Alert generated from the latest event.";
      reasoning = "Local model fallback used because no Anthropic key is configured.";
    } else {
      const result = await generateText({
        model: anthropic(agent.model ?? "claude-sonnet-4-20250514"),
        system: agent.systemPrompt ?? "Write a concise announcement from the input.",
        prompt: `${agent.userPromptTemplate ?? "Process this event"}\n\n${JSON.stringify(input, null, 2)}`,
        tools: agent.processingMode === "agent" ? agentTools : undefined,
        maxOutputTokens: 500
      });
      output = result.text;
      reasoning = "Model completed the run.";
    }
  }

  const announcementId = output ? createId("ann") : null;
  const jobs = announcementId
    ? await enqueueDeliveries({
        orgId: agent.orgId,
        announcementId,
        listIds: agent.defaultListIds ?? [],
        channels: (agent.defaultChannels ?? ["sms", "email"]) as never,
        text: output
      })
    : [];

  await saveAgentRun({
    id: runId,
    agentId: agent.id,
    sourceEventId: null,
    status: output ? "completed" : "skipped",
    input,
    reasoning,
    output,
    announcementId,
    durationMs: Date.now() - started,
    tokensUsed: null,
    error: null,
    createdAt: new Date().toISOString()
  });

  return {
    runId,
    status: output ? "completed" : "skipped",
    output,
    reasoning,
    announcementId,
    queuedDeliveries: jobs.length,
    durationMs: Date.now() - started
  };
}

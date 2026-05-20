import { listAgents, recordWebhookEvent } from "@/lib/data/platform";
import { runAgent } from "@/lib/agents/runner";

export async function handleInboundWebhook(webhookId: string, payload: Record<string, unknown>) {
  const { event, webhook } = await recordWebhookEvent(webhookId, payload);
  const agents = (await listAgents()).filter((agent) => agent.status === "active" && agent.sourceIds.includes(webhook.sourceId));
  const runs = [];

  for (const agent of agents) {
    runs.push(await runAgent({
      id: agent.id,
      orgId: agent.orgId,
      processingMode: agent.processingMode,
      templateText: agent.templateText,
      systemPrompt: agent.systemPrompt ?? agent.description,
      userPromptTemplate: agent.userPromptTemplate,
      model: agent.model,
      defaultListIds: agent.defaultListIds,
      defaultChannels: agent.defaultChannels
    }, payload));
  }

  return { eventId: event.id, webhookId: webhook.id, processed: true, agentRuns: runs };
}

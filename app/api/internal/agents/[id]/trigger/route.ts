import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api/responses";
import { getAgent } from "@/lib/data/platform";
import { runAgent } from "@/lib/agents/runner";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const agent = await getAgent(id);
    if (!agent) throw Object.assign(new Error("Agent not found"), { status: 404, code: "not_found" });
    const payload = await request.json().catch(() => ({
      message: "This is a test announcement from the agent.",
      source: "manual_test"
    }));
    const result = await runAgent({
      id: agent.id,
      orgId: agent.orgId,
      processingMode: agent.processingMode,
      templateText: agent.templateText,
      systemPrompt: agent.systemPrompt ?? agent.description,
      userPromptTemplate: agent.userPromptTemplate,
      model: agent.model,
      defaultListIds: agent.defaultListIds,
      defaultChannels: agent.defaultChannels
    }, payload);
    return ok(result, { status: 202 });
  } catch (error) {
    return fail(error);
  }
}

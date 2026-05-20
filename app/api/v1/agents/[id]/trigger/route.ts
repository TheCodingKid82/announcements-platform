import { NextRequest } from "next/server";
import { validateApiRequest } from "@/lib/api/middleware";
import { fail, ok } from "@/lib/api/responses";
import { getAgent } from "@/lib/data/platform";
import { runAgent } from "@/lib/agents/runner";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const apiContext = await validateApiRequest(request, "agents");
    const { id } = await context.params;
    const payload = await request.json().catch(() => ({}));
    const agent = await getAgent(id);
    if (!agent) throw Object.assign(new Error("Resource not found"), { status: 404, code: "not_found" });
    const result = await runAgent({
      id: agent.id,
      orgId: apiContext.orgId,
      processingMode: agent.processingMode,
      templateText: agent.templateText,
      systemPrompt: agent.systemPrompt ?? agent.description,
      defaultListIds: agent.defaultListIds,
      defaultChannels: agent.defaultChannels
    }, payload);
    return ok(result, { status: 202 });
  } catch (error) {
    return fail(error);
  }
}

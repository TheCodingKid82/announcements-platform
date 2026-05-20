import { NextRequest } from "next/server";
import { validateApiRequest } from "@/lib/api/middleware";
import { fail, ok } from "@/lib/api/responses";
import { getAgent } from "@/lib/data/platform";
import { updateLocalStore } from "@/lib/data/local-store";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await validateApiRequest(request, "agents");
    const { id } = await context.params;
    const agent = await getAgent(id);
    if (!agent) throw Object.assign(new Error("Resource not found"), { status: 404, code: "not_found" });
    return ok(agent);
  } catch (error) {
    return fail(error);
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await validateApiRequest(request, "agents");
    const { id } = await context.params;
    const patch = await request.json();
    const agent = await updateLocalStore((store) => {
      const row = store.agents.find((item) => item.id === id);
      if (!row) throw Object.assign(new Error("Resource not found"), { status: 404, code: "not_found" });
      Object.assign(row, patch, { updatedAt: new Date().toISOString() });
      return row;
    });
    return ok(agent);
  } catch (error) {
    return fail(error);
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await validateApiRequest(request, "agents");
    const { id } = await context.params;
    await updateLocalStore((store) => {
      store.agents = store.agents.filter((item) => item.id !== id);
      store.agentRuns = store.agentRuns.filter((item) => item.agentId !== id);
    });
    return ok({ id, deleted: true });
  } catch (error) {
    return fail(error);
  }
}

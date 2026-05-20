import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api/responses";
import { updateLocalStore } from "@/lib/data/local-store";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const patch = await request.json();
    const agent = await updateLocalStore((store) => {
      const row = store.agents.find((item) => item.id === id);
      if (!row) throw Object.assign(new Error("Agent not found"), { status: 404, code: "not_found" });
      Object.assign(row, patch, { updatedAt: new Date().toISOString() });
      return row;
    });
    return ok(agent);
  } catch (error) {
    return fail(error);
  }
}

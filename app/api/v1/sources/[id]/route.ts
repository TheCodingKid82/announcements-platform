import { NextRequest } from "next/server";
import { validateApiRequest } from "@/lib/api/middleware";
import { fail, ok } from "@/lib/api/responses";
import { getSource } from "@/lib/data/platform";
import { updateLocalStore } from "@/lib/data/local-store";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await validateApiRequest(request, "sources");
    const { id } = await context.params;
    const source = await getSource(id);
    if (!source) throw Object.assign(new Error("Resource not found"), { status: 404, code: "not_found" });
    return ok(source);
  } catch (error) {
    return fail(error);
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await validateApiRequest(request, "sources");
    const { id } = await context.params;
    const patch = await request.json();
    const source = await updateLocalStore((store) => {
      const row = store.sources.find((item) => item.id === id);
      if (!row) throw Object.assign(new Error("Resource not found"), { status: 404, code: "not_found" });
      Object.assign(row, patch, { updatedAt: new Date().toISOString() });
      return row;
    });
    return ok(source);
  } catch (error) {
    return fail(error);
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await validateApiRequest(request, "sources");
    const { id } = await context.params;
    await updateLocalStore((store) => {
      store.sources = store.sources.filter((item) => item.id !== id);
      store.sourceEvents = store.sourceEvents.filter((item) => item.sourceId !== id);
      store.webhooks = store.webhooks.filter((item) => item.sourceId !== id);
    });
    return ok({ id, deleted: true });
  } catch (error) {
    return fail(error);
  }
}

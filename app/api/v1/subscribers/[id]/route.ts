import { NextRequest } from "next/server";
import { validateApiRequest } from "@/lib/api/middleware";
import { fail, ok } from "@/lib/api/responses";
import { updateLocalStore } from "@/lib/data/local-store";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await validateApiRequest(request, "lists");
    const { id } = await context.params;
    const subscriber = await updateLocalStore((store) => {
      const row = store.subscribers.find((item) => item.id === id);
      if (!row) throw Object.assign(new Error("Resource not found"), { status: 404, code: "not_found" });
      return row;
    });
    return ok(subscriber);
  } catch (error) {
    return fail(error);
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await validateApiRequest(request, "lists");
    const { id } = await context.params;
    const patch = await request.json();
    const subscriber = await updateLocalStore((store) => {
      const row = store.subscribers.find((item) => item.id === id);
      if (!row) throw Object.assign(new Error("Resource not found"), { status: 404, code: "not_found" });
      Object.assign(row, patch, { updatedAt: new Date().toISOString() });
      return row;
    });
    return ok(subscriber);
  } catch (error) {
    return fail(error);
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await validateApiRequest(request, "lists");
    const { id } = await context.params;
    await updateLocalStore((store) => {
      store.subscribers = store.subscribers.filter((item) => item.id !== id);
      store.listSubscribers = store.listSubscribers.filter((item) => item.subscriberId !== id);
    });
    return ok({ id, deleted: true });
  } catch (error) {
    return fail(error);
  }
}

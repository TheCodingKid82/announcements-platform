import { NextRequest } from "next/server";
import { validateApiRequest } from "@/lib/api/middleware";
import { fail, ok } from "@/lib/api/responses";
import { createSubscriber, listSubscribersWithLists } from "@/lib/data/platform";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await validateApiRequest(request, "lists");
    const { id } = await context.params;
    return ok({ items: await listSubscribersWithLists(id), nextCursor: null });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await validateApiRequest(request, "lists");
    const { id } = await context.params;
    const body = await request.json();
    return ok(await createSubscriber({ ...body, listId: id }), { status: 201 });
  } catch (error) {
    return fail(error);
  }
}

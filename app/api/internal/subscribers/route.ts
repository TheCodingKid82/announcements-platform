import { NextRequest } from "next/server";
import { z } from "zod";
import { createSubscriber, listSubscribersWithLists } from "@/lib/data/platform";
import { fail, ok } from "@/lib/api/responses";

const schema = z.object({
  listId: z.string().optional(),
  name: z.string().optional(),
  phoneE164: z.string().optional(),
  email: z.string().email().optional(),
  channels: z.array(z.enum(["sms", "email", "imessage"])).optional()
});

export async function GET(request: NextRequest) {
  try {
    const listId = request.nextUrl.searchParams.get("listId") ?? undefined;
    return ok({ items: await listSubscribersWithLists(listId), nextCursor: null });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = schema.parse(await request.json());
    const subscriber = await createSubscriber(body);
    return ok(subscriber, { status: 201 });
  } catch (error) {
    return fail(error);
  }
}

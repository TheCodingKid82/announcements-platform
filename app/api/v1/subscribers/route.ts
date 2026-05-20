import { z } from "zod";
import { NextRequest } from "next/server";
import { validateApiRequest } from "@/lib/api/middleware";
import { createSubscriber, listSubscribersWithLists } from "@/lib/data/platform";
import { fail, ok } from "@/lib/api/responses";

const schema = z.object({ name: z.string().optional(), phoneE164: z.string().optional(), email: z.string().email().optional() });

export async function GET(request: NextRequest) {
  try {
    await validateApiRequest(request, "lists");
    return ok({ items: await listSubscribersWithLists(), nextCursor: null });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await validateApiRequest(request, "lists");
    return ok(await createSubscriber(schema.parse(await request.json())), { status: 201 });
  } catch (error) {
    return fail(error);
  }
}

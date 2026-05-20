import { z } from "zod";
import { NextRequest } from "next/server";
import { validateApiRequest } from "@/lib/api/middleware";
import { createList, listLists } from "@/lib/data/platform";
import { fail, ok } from "@/lib/api/responses";

const schema = z.object({ name: z.string(), description: z.string().optional() });

export async function GET(request: NextRequest) {
  try {
    await validateApiRequest(request, "lists");
    return ok({ items: await listLists(), nextCursor: null });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await validateApiRequest(request, "lists");
    return ok(await createList(schema.parse(await request.json())), { status: 201 });
  } catch (error) {
    return fail(error);
  }
}

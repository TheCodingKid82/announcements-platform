import { NextRequest } from "next/server";
import { z } from "zod";
import { createList, listLists } from "@/lib/data/platform";
import { fail, ok } from "@/lib/api/responses";

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional()
});

export async function GET() {
  try {
    return ok({ items: await listLists(), nextCursor: null });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = schema.parse(await request.json());
    const list = await createList(body);
    return ok(list, { status: 201 });
  } catch (error) {
    return fail(error);
  }
}

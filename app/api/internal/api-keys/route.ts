import { NextRequest } from "next/server";
import { z } from "zod";
import { createApiKey, listApiKeys } from "@/lib/data/platform";
import { fail, ok } from "@/lib/api/responses";

const schema = z.object({
  name: z.string().min(1),
  scopes: z.array(z.string()).optional()
});

export async function GET() {
  try {
    return ok({ items: await listApiKeys(), nextCursor: null });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = schema.parse(await request.json());
    const result = await createApiKey(body);
    return ok(result, { status: 201 });
  } catch (error) {
    return fail(error);
  }
}

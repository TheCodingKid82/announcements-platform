import { z } from "zod";
import { NextRequest } from "next/server";
import { validateApiRequest } from "@/lib/api/middleware";
import { createSource, listSources } from "@/lib/data/platform";
import { fail, ok } from "@/lib/api/responses";

const schema = z.object({ name: z.string(), type: z.enum(["webhook", "api_poll", "rss", "schedule"]), config: z.record(z.string(), z.unknown()).optional() });

export async function GET(request: NextRequest) {
  try {
    await validateApiRequest(request, "sources");
    return ok({ items: await listSources(), nextCursor: null });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await validateApiRequest(request, "sources");
    return ok(await createSource(schema.parse(await request.json())), { status: 201 });
  } catch (error) {
    return fail(error);
  }
}

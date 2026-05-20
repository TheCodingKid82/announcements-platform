import { NextRequest } from "next/server";
import { z } from "zod";
import { createSource, listSources } from "@/lib/data/platform";
import { fail, ok } from "@/lib/api/responses";

const schema = z.object({
  name: z.string().min(1),
  type: z.enum(["webhook", "api_poll", "rss", "schedule"]),
  config: z.record(z.string(), z.unknown()).optional()
});

export async function GET() {
  try {
    return ok({ items: await listSources(), nextCursor: null });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = schema.parse(await request.json());
    const source = await createSource(body);
    return ok(source, { status: 201 });
  } catch (error) {
    return fail(error);
  }
}

import { z } from "zod";
import { NextRequest } from "next/server";
import { validateApiRequest } from "@/lib/api/middleware";
import { createAgent, listAgents } from "@/lib/data/platform";
import { fail, ok } from "@/lib/api/responses";

const schema = z.object({
  name: z.string(),
  description: z.string().optional(),
  processingMode: z.enum(["passthrough", "template", "transform", "agent"]).default("agent")
});

export async function GET(request: NextRequest) {
  try {
    await validateApiRequest(request, "agents");
    return ok({ items: await listAgents(), nextCursor: null });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await validateApiRequest(request, "agents");
    const body = schema.parse(await request.json());
    return ok(await createAgent(body), { status: 201 });
  } catch (error) {
    return fail(error);
  }
}

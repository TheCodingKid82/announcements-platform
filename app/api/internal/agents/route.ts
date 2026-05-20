import { NextRequest } from "next/server";
import { z } from "zod";
import { createAgent, listAgents } from "@/lib/data/platform";
import { fail, ok } from "@/lib/api/responses";

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  processingMode: z.enum(["passthrough", "template", "transform", "agent"]),
  triggerType: z.string().optional(),
  sourceIds: z.array(z.string()).optional(),
  schedule: z.string().nullable().optional(),
  templateText: z.string().nullable().optional(),
  systemPrompt: z.string().nullable().optional(),
  defaultListIds: z.array(z.string()).optional(),
  defaultChannels: z.array(z.enum(["sms", "email", "imessage"])).optional()
});

export async function GET() {
  try {
    return ok({ items: await listAgents(), nextCursor: null });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = schema.parse(await request.json());
    const agent = await createAgent(body);
    return ok(agent, { status: 201 });
  } catch (error) {
    return fail(error);
  }
}

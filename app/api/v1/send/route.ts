import { NextRequest } from "next/server";
import { z } from "zod";
import { validateApiRequest } from "@/lib/api/middleware";
import { fail, ok } from "@/lib/api/responses";
import { createAnnouncement } from "@/lib/data/platform";

const sendSchema = z.object({
  list: z.string(),
  message: z.string().min(1),
  html: z.string().optional(),
  messages: z.record(z.enum(["sms", "email", "imessage"]), z.object({
    subject: z.string().optional(),
    preview: z.string().optional(),
    text: z.string().min(1),
    html: z.string().optional()
  })).optional(),
  channels: z.array(z.enum(["sms", "email", "imessage"])).optional(),
  schedule: z.string().datetime().optional()
});

export async function POST(request: NextRequest) {
  try {
    const context = await validateApiRequest(request, "send");
    const body = sendSchema.parse(await request.json());
    const result = await createAnnouncement({
      orgId: context.orgId,
      listIds: [body.list],
      channels: body.channels ?? ["sms", "email"],
      contentText: body.message,
      contentHtml: body.html,
      channelMessages: body.messages,
      scheduledFor: body.schedule ?? null,
      triggeredBy: "api"
    });

    return ok({ id: result.announcement.id, status: result.announcement.status, recipients: result.announcement.totalRecipients }, { status: 202 });
  } catch (error) {
    return fail(error);
  }
}

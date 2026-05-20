import { NextRequest } from "next/server";
import { z } from "zod";
import { createAnnouncement, listAnnouncements } from "@/lib/data/platform";
import { fail, ok } from "@/lib/api/responses";

const schema = z.object({
  title: z.string().optional(),
  contentText: z.string().min(1),
  contentHtml: z.string().optional(),
  channelMessages: z.record(z.enum(["sms", "email", "imessage"]), z.object({
    subject: z.string().nullable().optional(),
    preview: z.string().nullable().optional(),
    text: z.string().min(1),
    html: z.string().nullable().optional()
  })).optional(),
  channels: z.array(z.enum(["sms", "email", "imessage"])).min(1),
  listIds: z.array(z.string()).min(1),
  scheduledFor: z.string().nullable().optional()
});

export async function GET() {
  try {
    return ok({ items: await listAnnouncements(), nextCursor: null });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = schema.parse(await request.json());
    const result = await createAnnouncement({
      title: body.title,
      contentText: body.contentText,
      contentHtml: body.contentHtml,
      channelMessages: body.channelMessages,
      channels: body.channels,
      listIds: body.listIds,
      scheduledFor: body.scheduledFor,
      triggeredBy: "manual"
    });
    return ok(result, { status: 201 });
  } catch (error) {
    return fail(error);
  }
}

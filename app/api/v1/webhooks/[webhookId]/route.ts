import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/api/responses";
import { handleInboundWebhook } from "@/lib/webhooks/handler";
import { validateWebhookSignature } from "@/lib/webhooks/validator";
import { getWebhookByPath } from "@/lib/data/platform";

export async function POST(request: NextRequest, context: { params: Promise<{ webhookId: string }> }) {
  try {
    const { webhookId } = await context.params;
    const payload = await request.text();
    const signature = request.headers.get("x-announcements-signature");
    const webhook = await getWebhookByPath(webhookId);
    if (!webhook) throw Object.assign(new Error("Webhook not found"), { status: 404, code: "not_found" });
    if (signature && !validateWebhookSignature(payload, webhook.secret, signature)) {
      throw Object.assign(new Error("Invalid webhook signature"), { status: 401, code: "invalid_signature" });
    }
    const parsed = JSON.parse(payload || "{}") as Record<string, unknown>;
    const result = await handleInboundWebhook(webhookId, parsed);
    return ok(result, { status: 202 });
  } catch (error) {
    return fail(error);
  }
}

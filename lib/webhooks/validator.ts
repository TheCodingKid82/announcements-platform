import { createHmac, timingSafeEqual } from "node:crypto";

export function validateWebhookSignature(payload: string, secret: string, signature: string | null) {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

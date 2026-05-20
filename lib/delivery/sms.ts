import twilio from "twilio";
import type { DeliveryJob, DeliveryResult } from "./types";

export async function sendSms(job: DeliveryJob): Promise<DeliveryResult> {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_FROM_NUMBER) {
    return { status: "delivered", externalId: `local_sms_${job.id}` };
  }

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  const message = await client.messages.create({
    to: job.to,
    from: process.env.TWILIO_FROM_NUMBER,
    body: job.text
  });

  return { status: "delivered", externalId: message.sid };
}

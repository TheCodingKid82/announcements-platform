import { Resend } from "resend";
import type { DeliveryJob, DeliveryResult } from "./types";

export async function sendEmail(job: DeliveryJob): Promise<DeliveryResult> {
  if (!process.env.RESEND_API_KEY) {
    return { status: "delivered", externalId: `local_email_${job.id}` };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const result = await resend.emails.send({
    to: job.to,
    from: process.env.RESEND_FROM_ADDRESS ?? "alerts@announcementsapp.com",
    subject: job.subject ?? "Announcement",
    html: `${job.html ?? `<p>${job.text}</p>`}<p style="color:#777;font-size:12px">You can unsubscribe from your preferences page.</p>`
  });

  return { status: "delivered", externalId: result.data?.id };
}

import { createAnnouncement, processQueuedDeliveries } from "@/lib/data/platform";
import { sendEmail } from "./email";
import { sendSms } from "./sms";
import type { DeliveryChannel, DeliveryJob, DeliveryResult } from "./types";

export type AnnouncementFanout = {
  orgId: string;
  announcementId: string;
  listIds: string[];
  channels: DeliveryChannel[];
  text: string;
  html?: string;
};

export async function enqueueDeliveries(input: AnnouncementFanout) {
  const { deliveries } = await createAnnouncement({
    id: input.announcementId,
    orgId: input.orgId,
    title: input.text.slice(0, 60),
    contentText: input.text,
    contentHtml: input.html,
    channels: input.channels.filter((channel) => channel === "sms" || channel === "email" || channel === "imessage") as never,
    listIds: input.listIds,
    triggeredBy: "api"
  });

  return deliveries;
}

export async function processQueue() {
  return processQueuedDeliveries(async ({ delivery, announcement, subscriber }) => {
    const to = delivery.channel === "email" ? subscriber.email : subscriber.phoneE164;
    if (!to) return { status: "failed", failureReason: "Subscriber has no address for this channel" };
    const channelMessage = announcement.channelMessages?.[delivery.channel];
    const job: DeliveryJob = {
      id: delivery.id,
      orgId: announcement.orgId,
      announcementId: delivery.announcementId,
      subscriberId: delivery.subscriberId,
      channel: delivery.channel,
      to,
      subject: channelMessage?.subject ?? announcement.title ?? "Announcement",
      text: channelMessage?.text ?? announcement.contentText,
      html: channelMessage?.html ?? announcement.contentHtml ?? undefined
    };
    return dispatchDelivery(job);
  });
}

export async function dispatchDelivery(job: DeliveryJob): Promise<DeliveryResult> {
  if (job.channel === "email") return sendEmail(job);
  if (job.channel === "sms" || job.channel === "imessage") return sendSms(job);
  return { status: "failed", failureReason: "Channel adapter is not configured yet" };
}

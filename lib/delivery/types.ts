export type DeliveryChannel = "sms" | "imessage" | "email" | "whatsapp" | "telegram" | "slack" | "discord";

export type DeliveryJob = {
  id: string;
  orgId: string;
  announcementId: string;
  subscriberId: string;
  channel: DeliveryChannel;
  to: string;
  subject?: string;
  text: string;
  html?: string;
};

export type DeliveryResult = {
  status: "delivered" | "failed";
  externalId?: string;
  failureReason?: string;
};

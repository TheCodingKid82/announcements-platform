export type Channel = "sms" | "email" | "imessage";

export type ChannelMessage = {
  subject?: string | null;
  preview?: string | null;
  text: string;
  html?: string | null;
};

export type OrganizationRecord = {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  plan: string;
  smsCreditsIncluded: number;
  smsCreditsUsed: number;
  billingCycleStart: string | null;
  whopCompanyId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiKeyRecord = {
  id: string;
  orgId: string;
  name: string;
  keyHash: string;
  keyPrefix: string;
  scopes: string[];
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
};

export type ListRecord = {
  id: string;
  orgId: string;
  name: string;
  description: string | null;
  subscriberCount: number;
  createdAt: string;
  updatedAt: string;
};

export type SubscriberRecord = {
  id: string;
  orgId: string;
  phoneE164: string | null;
  email: string | null;
  name: string | null;
  metadata: Record<string, unknown> | null;
  channelPreferences: Partial<Record<Channel, boolean>>;
  whopUserId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ListSubscriberRecord = {
  id: string;
  listId: string;
  subscriberId: string;
  subscribedAt: string;
  unsubscribedAt: string | null;
};

export type AnnouncementRecord = {
  id: string;
  orgId: string;
  title: string | null;
  contentHtml: string | null;
  contentText: string;
  channelMessages: Partial<Record<Channel, ChannelMessage>>;
  channels: Channel[];
  listIds: string[];
  status: string;
  scheduledFor: string | null;
  sentAt: string | null;
  triggeredBy: string | null;
  totalRecipients: number;
  totalDelivered: number;
  totalOpened: number;
  totalFailed: number;
  createdAt: string;
  updatedAt: string;
};

export type DeliveryRecord = {
  id: string;
  announcementId: string;
  subscriberId: string;
  channel: Channel;
  status: string;
  externalId: string | null;
  deliveredAt: string | null;
  openedAt: string | null;
  failureReason: string | null;
  createdAt: string;
};

export type SourceRecord = {
  id: string;
  orgId: string;
  name: string;
  type: string;
  config: Record<string, unknown>;
  status: string;
  lastEventAt: string | null;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SourceEventRecord = {
  id: string;
  sourceId: string;
  payload: Record<string, unknown>;
  processedAt: string | null;
  agentId: string | null;
  announcementId: string | null;
  createdAt: string;
};

export type WebhookRecord = {
  id: string;
  orgId: string;
  sourceId: string;
  endpointPath: string;
  secret: string;
  description: string | null;
  lastReceivedAt: string | null;
  totalReceived: number;
  createdAt: string;
};

export type AgentRecord = {
  id: string;
  orgId: string;
  name: string;
  description: string | null;
  status: string;
  processingMode: "passthrough" | "template" | "transform" | "agent";
  sourceIds: string[];
  triggerType: string | null;
  schedule: string | null;
  timezone: string;
  templateText: string | null;
  systemPrompt: string | null;
  userPromptTemplate: string | null;
  model: string;
  tools: string[];
  maxTokens: number;
  defaultListIds: string[];
  defaultChannels: Channel[];
  totalRuns: number;
  totalMessagesSent: number;
  lastRunAt: string | null;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AgentRunRecord = {
  id: string;
  agentId: string;
  sourceEventId: string | null;
  status: string;
  input: unknown;
  reasoning: string | null;
  output: string | null;
  announcementId: string | null;
  durationMs: number | null;
  tokensUsed: number | null;
  error: string | null;
  createdAt: string;
};

export type PlatformStore = {
  organizations: OrganizationRecord[];
  apiKeys: ApiKeyRecord[];
  lists: ListRecord[];
  subscribers: SubscriberRecord[];
  listSubscribers: ListSubscriberRecord[];
  announcements: AnnouncementRecord[];
  deliveries: DeliveryRecord[];
  sources: SourceRecord[];
  sourceEvents: SourceEventRecord[];
  webhooks: WebhookRecord[];
  agents: AgentRecord[];
  agentRuns: AgentRunRecord[];
};

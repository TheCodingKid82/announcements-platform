import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { unstable_noStore as noStore } from "next/cache";
import { createId } from "@/lib/utils/id";
import { readLocalStore, updateLocalStore } from "./local-store";
import type {
  AgentRecord,
  AgentRunRecord,
  AnnouncementRecord,
  ApiKeyRecord,
  Channel,
  DeliveryRecord,
  ListRecord,
  SourceEventRecord,
  SourceRecord,
  SubscriberRecord,
  WebhookRecord,
  ChannelMessage
} from "./types";

const DEFAULT_ORG_ID = "org_local";
const ALL_SCOPES = ["send", "agents", "lists", "sources", "analytics"];

function now() {
  return new Date().toISOString();
}

export function hashApiKey(key: string) {
  return createHash("sha256").update(key).digest("hex");
}

function safeCompare(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && timingSafeEqual(aBuffer, bBuffer);
}

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3100";
}

export async function getActiveOrg() {
  noStore();
  const store = await readLocalStore();
  return store.organizations[0];
}

export async function getDashboardData() {
  noStore();
  const store = await readLocalStore();
  const org = store.organizations[0];
  const announcements = store.announcements
    .filter((item) => item.orgId === org.id)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const agents = store.agents.filter((item) => item.orgId === org.id);
  const lists = store.lists.filter((item) => item.orgId === org.id);
  const sources = store.sources.filter((item) => item.orgId === org.id);
  const subscribers = store.subscribers.filter((item) => item.orgId === org.id);
  const recent = announcements.slice(0, 10);
  const messagesSent = announcements
    .filter((item) => item.sentAt && Date.parse(item.sentAt) >= Date.now() - 30 * 24 * 60 * 60 * 1000)
    .reduce((sum, item) => sum + item.totalRecipients, 0);
  const delivered = announcements.reduce((sum, item) => sum + item.totalDelivered, 0);
  const opened = announcements.reduce((sum, item) => sum + item.totalOpened, 0);

  return {
    org,
    lists,
    sources,
    agents,
    recentAnnouncements: recent,
    stats: {
      totalSubscribers: subscribers.length,
      listCount: lists.length,
      messagesSent,
      openRate: delivered > 0 ? (opened / delivered) * 100 : 0,
      activeAgents: agents.filter((item) => item.status === "active").length,
      pausedAgents: agents.filter((item) => item.status === "paused").length
    },
    live: buildLiveActivity(store.deliveries, recent[0])
  };
}

export async function createStarterSetup() {
  return updateLocalStore((store) => {
    const timestamp = now();
    const orgId = store.organizations[0]?.id ?? DEFAULT_ORG_ID;
    let list = store.lists.find((item) => item.orgId === orgId && item.name === "Primary audience");
    if (!list) {
      list = {
        id: createId("lst"),
        orgId,
        name: "Primary audience",
        description: "Your main subscriber list",
        subscriberCount: 0,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      store.lists.unshift(list);
    }

    let source = store.sources.find((item) => item.orgId === orgId && item.name === "Inbound webhook");
    let webhook = source ? store.webhooks.find((item) => item.sourceId === source?.id) ?? null : null;
    if (!source) {
      source = {
        id: createId("src"),
        orgId,
        name: "Inbound webhook",
        type: "webhook",
        config: {},
        status: "active",
        lastEventAt: null,
        lastError: null,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      webhook = {
        id: createId("wh"),
        orgId,
        sourceId: source.id,
        endpointPath: createId("wh"),
        secret: randomBytes(24).toString("hex"),
        description: "Starter webhook",
        lastReceivedAt: null,
        totalReceived: 0,
        createdAt: timestamp
      };
      source.config = { webhookId: webhook.id, endpointPath: webhook.endpointPath };
      store.sources.unshift(source);
      store.webhooks.unshift(webhook);
    }

    let agent = store.agents.find((item) => item.orgId === orgId && item.name === "Announcement intake agent");
    if (!agent) {
      agent = {
        id: createId("agt"),
        orgId,
        name: "Announcement intake agent",
        description: "Turns webhook events into clear subscriber messages.",
        status: "active",
        processingMode: "transform",
        sourceIds: source ? [source.id] : [],
        triggerType: "source_event",
        schedule: null,
        timezone: "America/New_York",
        templateText: null,
        systemPrompt: "Write a clear subscriber announcement from the inbound event. Keep SMS concise and make email useful.",
        userPromptTemplate: null,
        model: "claude-sonnet-4-20250514",
        tools: [],
        maxTokens: 500,
        defaultListIds: list ? [list.id] : [],
        defaultChannels: ["sms", "email"],
        totalRuns: 0,
        totalMessagesSent: 0,
        lastRunAt: null,
        lastError: null,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      store.agents.unshift(agent);
    }

    return {
      list,
      source,
      webhook,
      agent,
      webhookUrl: webhook ? `${getAppUrl()}/api/v1/webhooks/${webhook.endpointPath}` : null
    };
  });
}

function buildLiveActivity(deliveries: DeliveryRecord[], announcement?: AnnouncementRecord) {
  const active = announcement?.status === "sending" || announcement?.status === "queued";
  const related = announcement ? deliveries.filter((item) => item.announcementId === announcement.id) : [];
  const processed = related.filter((item) => item.status !== "queued").length;
  const total = related.length;
  const byChannel = related.reduce<Record<string, number>>((acc, item) => {
    acc[item.channel] = (acc[item.channel] ?? 0) + 1;
    return acc;
  }, {});

  return { active, processed, total, byChannel };
}

export async function listAnnouncements(limit?: number) {
  noStore();
  const store = await readLocalStore();
  const rows = store.announcements
    .filter((item) => item.orgId === store.organizations[0].id)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  return typeof limit === "number" ? rows.slice(0, limit) : rows;
}

export async function getAnnouncement(id: string) {
  noStore();
  const store = await readLocalStore();
  return store.announcements.find((item) => item.id === id) ?? null;
}

export async function listDeliveriesWithSubscribers(announcementId: string) {
  noStore();
  const store = await readLocalStore();
  return store.deliveries
    .filter((item) => item.announcementId === announcementId)
    .map((delivery) => ({
      ...delivery,
      subscriber: store.subscribers.find((item) => item.id === delivery.subscriberId) ?? null
    }))
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export async function listLists() {
  noStore();
  const store = await readLocalStore();
  return store.lists.filter((item) => item.orgId === store.organizations[0].id);
}

export async function getList(id: string) {
  noStore();
  const store = await readLocalStore();
  return store.lists.find((item) => item.id === id) ?? null;
}

export async function listSubscribers(listId?: string) {
  noStore();
  const store = await readLocalStore();
  const orgId = store.organizations[0].id;
  if (!listId) return store.subscribers.filter((item) => item.orgId === orgId);
  const ids = new Set(
    store.listSubscribers
      .filter((item) => item.listId === listId && !item.unsubscribedAt)
      .map((item) => item.subscriberId)
  );
  return store.subscribers.filter((item) => ids.has(item.id));
}

export async function listSubscribersWithLists(listId?: string) {
  noStore();
  const store = await readLocalStore();
  const subscribers = await listSubscribers(listId);
  return subscribers.map((subscriber) => {
    const memberships = store.listSubscribers.filter((item) => item.subscriberId === subscriber.id && !item.unsubscribedAt);
    const listNames = memberships
      .map((membership) => store.lists.find((list) => list.id === membership.listId)?.name)
      .filter(Boolean)
      .join(", ");
    return { ...subscriber, listNames };
  });
}

export async function createList(input: { name: string; description?: string | null }) {
  return updateLocalStore((store) => {
    const timestamp = now();
    const list: ListRecord = {
      id: createId("lst"),
      orgId: store.organizations[0]?.id ?? DEFAULT_ORG_ID,
      name: input.name,
      description: input.description ?? null,
      subscriberCount: 0,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    store.lists.unshift(list);
    return list;
  });
}

export async function createSubscriber(input: {
  listId?: string | null;
  name?: string | null;
  phoneE164?: string | null;
  email?: string | null;
  channels?: Channel[];
}) {
  return updateLocalStore((store) => {
    const timestamp = now();
    const subscriber: SubscriberRecord = {
      id: createId("sub"),
      orgId: store.organizations[0]?.id ?? DEFAULT_ORG_ID,
      phoneE164: input.phoneE164 || null,
      email: input.email || null,
      name: input.name || null,
      metadata: null,
      channelPreferences: {
        sms: input.channels?.includes("sms") ?? Boolean(input.phoneE164),
        email: input.channels?.includes("email") ?? Boolean(input.email),
        imessage: input.channels?.includes("imessage") ?? false
      },
      whopUserId: null,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    store.subscribers.unshift(subscriber);
    if (input.listId) {
      store.listSubscribers.push({
        id: createId("sub"),
        listId: input.listId,
        subscriberId: subscriber.id,
        subscribedAt: timestamp,
        unsubscribedAt: null
      });
      refreshListCounts(store);
    }
    return subscriber;
  });
}

export async function listAgents() {
  noStore();
  const store = await readLocalStore();
  return store.agents.filter((item) => item.orgId === store.organizations[0].id);
}

export async function getAgent(id: string) {
  noStore();
  const store = await readLocalStore();
  return store.agents.find((item) => item.id === id) ?? null;
}

export async function listAgentRuns(agentId: string) {
  noStore();
  const store = await readLocalStore();
  return store.agentRuns
    .filter((item) => item.agentId === agentId)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export async function createAgent(input: {
  name: string;
  description?: string | null;
  processingMode: AgentRecord["processingMode"];
  triggerType?: string | null;
  sourceIds?: string[];
  schedule?: string | null;
  templateText?: string | null;
  systemPrompt?: string | null;
  defaultListIds?: string[];
  defaultChannels?: Channel[];
}) {
  return updateLocalStore((store) => {
    const timestamp = now();
    const agent: AgentRecord = {
      id: createId("agt"),
      orgId: store.organizations[0]?.id ?? DEFAULT_ORG_ID,
      name: input.name,
      description: input.description ?? null,
      status: "active",
      processingMode: input.processingMode,
      sourceIds: input.sourceIds ?? [],
      triggerType: input.triggerType ?? "manual",
      schedule: input.schedule ?? null,
      timezone: "America/New_York",
      templateText: input.templateText ?? null,
      systemPrompt: input.systemPrompt ?? null,
      userPromptTemplate: null,
      model: "claude-sonnet-4-20250514",
      tools: input.processingMode === "agent" ? ["fetch_url", "query_api", "send_announcement", "skip"] : [],
      maxTokens: 500,
      defaultListIds: input.defaultListIds ?? [],
      defaultChannels: input.defaultChannels ?? ["sms", "email"],
      totalRuns: 0,
      totalMessagesSent: 0,
      lastRunAt: null,
      lastError: null,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    store.agents.unshift(agent);
    return agent;
  });
}

export async function saveAgentRun(run: AgentRunRecord) {
  return updateLocalStore((store) => {
    store.agentRuns.unshift(run);
    const agent = store.agents.find((item) => item.id === run.agentId);
    if (agent) {
      agent.totalRuns += 1;
      agent.lastRunAt = run.createdAt;
      agent.lastError = run.error;
      agent.updatedAt = now();
      if (run.announcementId) {
        const announcement = store.announcements.find((item) => item.id === run.announcementId);
        agent.totalMessagesSent += announcement?.totalRecipients ?? 0;
      }
    }
    return run;
  });
}

export async function listSources() {
  noStore();
  const store = await readLocalStore();
  return store.sources.filter((item) => item.orgId === store.organizations[0].id);
}

export async function getSource(id: string) {
  noStore();
  const store = await readLocalStore();
  return store.sources.find((item) => item.id === id) ?? null;
}

export async function listSourceEvents(sourceId: string) {
  noStore();
  const store = await readLocalStore();
  return store.sourceEvents
    .filter((item) => item.sourceId === sourceId)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export async function createSource(input: { name: string; type: string; config?: Record<string, unknown> }) {
  return updateLocalStore((store) => {
    const timestamp = now();
    const source: SourceRecord = {
      id: createId("src"),
      orgId: store.organizations[0]?.id ?? DEFAULT_ORG_ID,
      name: input.name,
      type: input.type,
      config: input.config ?? {},
      status: "active",
      lastEventAt: null,
      lastError: null,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    store.sources.unshift(source);

    let webhook: WebhookRecord | null = null;
    if (source.type === "webhook") {
      webhook = {
        id: createId("wh"),
        orgId: source.orgId,
        sourceId: source.id,
        endpointPath: createId("wh"),
        secret: randomBytes(24).toString("hex"),
        description: `${source.name} webhook`,
        lastReceivedAt: null,
        totalReceived: 0,
        createdAt: timestamp
      };
      store.webhooks.unshift(webhook);
      source.config = { ...source.config, webhookId: webhook.id, endpointPath: webhook.endpointPath };
    }

    return { source, webhook, webhookUrl: webhook ? `${getAppUrl()}/api/v1/webhooks/${webhook.endpointPath}` : null };
  });
}

export async function getWebhookByPath(pathOrId: string) {
  noStore();
  const store = await readLocalStore();
  return store.webhooks.find((item) => item.endpointPath === pathOrId || item.id === pathOrId) ?? null;
}

export async function recordWebhookEvent(webhookIdOrPath: string, payload: Record<string, unknown>) {
  return updateLocalStore((store) => {
    const timestamp = now();
    const webhook = store.webhooks.find((item) => item.endpointPath === webhookIdOrPath || item.id === webhookIdOrPath);
    if (!webhook) throw Object.assign(new Error("Webhook not found"), { status: 404, code: "not_found" });
    const event: SourceEventRecord = {
      id: createId("evt"),
      sourceId: webhook.sourceId,
      payload,
      processedAt: null,
      agentId: null,
      announcementId: null,
      createdAt: timestamp
    };
    store.sourceEvents.unshift(event);
    webhook.lastReceivedAt = timestamp;
    webhook.totalReceived += 1;
    const source = store.sources.find((item) => item.id === webhook.sourceId);
    if (source) {
      source.lastEventAt = timestamp;
      source.updatedAt = timestamp;
    }
    return { webhook, event };
  });
}

export async function createAnnouncement(input: {
  id?: string;
  orgId?: string;
  title?: string | null;
  contentText: string;
  contentHtml?: string | null;
  channelMessages?: Partial<Record<Channel, ChannelMessage>>;
  channels: Channel[];
  listIds: string[];
  scheduledFor?: string | null;
  triggeredBy?: string | null;
}) {
  return updateLocalStore((store) => {
    const timestamp = now();
    const orgId = input.orgId ?? store.organizations[0]?.id ?? DEFAULT_ORG_ID;
    const selectedListIds = resolveListIds(store.lists, input.listIds);
    const recipientIds = new Set(
      store.listSubscribers
        .filter((item) => selectedListIds.includes(item.listId) && !item.unsubscribedAt)
        .map((item) => item.subscriberId)
    );
    const recipients = store.subscribers.filter((item) => recipientIds.has(item.id));
    const totalRecipients = recipients.length;
    const scheduledFor = input.scheduledFor ?? null;
    const status = scheduledFor ? "scheduled" : "queued";
    const channelMessages = buildChannelMessages(input.channels, input.contentText, input.contentHtml ?? null, input.title ?? null, input.channelMessages);
    const announcement: AnnouncementRecord = {
      id: input.id ?? createId("ann"),
      orgId,
      title: input.title ?? input.contentText.slice(0, 60),
      contentHtml: input.contentHtml ?? null,
      contentText: input.contentText,
      channelMessages,
      channels: input.channels,
      listIds: selectedListIds,
      status,
      scheduledFor,
      sentAt: scheduledFor ? null : timestamp,
      triggeredBy: input.triggeredBy ?? "manual",
      totalRecipients,
      totalDelivered: 0,
      totalOpened: 0,
      totalFailed: 0,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    store.announcements.unshift(announcement);

    for (const subscriber of recipients) {
      for (const channel of input.channels) {
        if (!subscriber.channelPreferences?.[channel]) continue;
        if (channel === "email" && !subscriber.email) continue;
        if ((channel === "sms" || channel === "imessage") && !subscriber.phoneE164) continue;
        store.deliveries.push({
          id: createId("del"),
          announcementId: announcement.id,
          subscriberId: subscriber.id,
          channel,
          status: scheduledFor ? "scheduled" : "queued",
          externalId: null,
          deliveredAt: null,
          openedAt: null,
          failureReason: null,
          createdAt: timestamp
        });
      }
    }

    return { announcement, deliveries: store.deliveries.filter((item) => item.announcementId === announcement.id) };
  });
}

function buildChannelMessages(
  channels: Channel[],
  fallbackText: string,
  fallbackHtml: string | null,
  fallbackTitle: string | null,
  input?: Partial<Record<Channel, ChannelMessage>>
) {
  return channels.reduce<Partial<Record<Channel, ChannelMessage>>>((acc, channel) => {
    const provided = input?.[channel];
    acc[channel] = {
      subject: channel === "email" ? provided?.subject ?? fallbackTitle ?? "Announcement" : provided?.subject ?? null,
      preview: provided?.preview ?? null,
      text: provided?.text?.trim() || fallbackText,
      html: channel === "email" ? provided?.html ?? fallbackHtml : provided?.html ?? null
    };
    return acc;
  }, {});
}

function resolveListIds(lists: ListRecord[], requested: string[]) {
  return requested
    .map((value) => lists.find((list) => list.id === value || list.name.toLowerCase() === value.toLowerCase())?.id)
    .filter((value): value is string => Boolean(value));
}

export async function processQueuedDeliveries(dispatch: (job: {
  delivery: DeliveryRecord;
  announcement: AnnouncementRecord;
  subscriber: SubscriberRecord;
}) => Promise<{ status: string; externalId?: string | null; failureReason?: string | null }>) {
  return updateLocalStore(async (store) => {
    const queued = store.deliveries.filter((item) => item.status === "queued").slice(0, 100);
    for (const delivery of queued) {
      delivery.status = "processing";
    }
    for (const delivery of queued) {
      try {
        const announcement = store.announcements.find((item) => item.id === delivery.announcementId);
        const subscriber = store.subscribers.find((item) => item.id === delivery.subscriberId);
        if (!announcement || !subscriber) throw new Error("Delivery is missing its announcement or subscriber");
        const result = await dispatch({ delivery, announcement, subscriber });
        delivery.status = result.status;
        delivery.externalId = result.externalId ?? null;
        delivery.failureReason = result.failureReason ?? null;
        if (result.status === "delivered" || result.status === "opened") delivery.deliveredAt = now();
        if (result.status === "opened") delivery.openedAt = now();
      } catch (error) {
        delivery.status = "failed";
        delivery.failureReason = error instanceof Error ? error.message : "Delivery failed";
      }
    }
    refreshAnnouncementCounters(store);
    return { processed: queued.length };
  });
}

export async function listApiKeys() {
  noStore();
  const store = await readLocalStore();
  return store.apiKeys.filter((item) => item.orgId === store.organizations[0].id);
}

export async function createApiKey(input: { name: string; scopes?: string[] }) {
  const token = `ann_k_${randomBytes(24).toString("base64url")}`;
  const key = await updateLocalStore((store) => {
    const timestamp = now();
    const apiKey: ApiKeyRecord = {
      id: createId("key"),
      orgId: store.organizations[0]?.id ?? DEFAULT_ORG_ID,
      name: input.name,
      keyHash: hashApiKey(token),
      keyPrefix: `${token.slice(0, 14)}...`,
      scopes: input.scopes?.length ? input.scopes : ALL_SCOPES,
      lastUsedAt: null,
      expiresAt: null,
      createdAt: timestamp
    };
    store.apiKeys.unshift(apiKey);
    return apiKey;
  });
  return { key, token };
}

export async function validateStoredApiKey(token: string, scope: string) {
  const hashed = hashApiKey(token);
  return updateLocalStore((store) => {
    const key = store.apiKeys.find((item) => safeCompare(item.keyHash, hashed));
    if (!key) throw Object.assign(new Error("Invalid API key"), { status: 401, code: "invalid_api_key" });
    if (!key.scopes.includes(scope)) {
      throw Object.assign(new Error("API key does not include this scope"), { status: 403, code: "missing_scope" });
    }
    key.lastUsedAt = now();
    return { orgId: key.orgId, keyPrefix: key.keyPrefix, scopes: key.scopes };
  });
}

export async function getAnalyticsData() {
  noStore();
  const store = await readLocalStore();
  const announcements = await listAnnouncements();
  const lastFive = announcements.slice(0, 5).reverse();
  const series = lastFive.map((item) => ({
    label: item.sentAt ? new Intl.DateTimeFormat("en", { weekday: "short" }).format(new Date(item.sentAt)) : "Queued",
    sent: item.totalRecipients,
    opened: item.totalOpened
  }));
  const channelCounts = store.deliveries.reduce<Record<string, number>>((acc, item) => {
    acc[item.channel] = (acc[item.channel] ?? 0) + 1;
    return acc;
  }, {});
  const totalChannels = Object.values(channelCounts).reduce((sum, value) => sum + value, 0);
  const channels = Object.entries(channelCounts).map(([label, value]) => ({
    label: label === "sms" ? "SMS" : label === "email" ? "Email" : "iMessage",
    value: totalChannels ? Math.round((value / totalChannels) * 100) : 0
  }));
  return { series, channels, topAnnouncements: announcements.slice(0, 10) };
}

function refreshListCounts(store: { lists: ListRecord[]; listSubscribers: { listId: string; unsubscribedAt: string | null }[] }) {
  for (const list of store.lists) {
    list.subscriberCount = store.listSubscribers.filter((item) => item.listId === list.id && !item.unsubscribedAt).length;
  }
}

function refreshAnnouncementCounters(store: { announcements: AnnouncementRecord[]; deliveries: DeliveryRecord[] }) {
  for (const announcement of store.announcements) {
    const related = store.deliveries.filter((item) => item.announcementId === announcement.id);
    announcement.totalDelivered = related.filter((item) => item.status === "delivered" || item.status === "opened").length;
    announcement.totalOpened = related.filter((item) => item.status === "opened").length;
    announcement.totalFailed = related.filter((item) => item.status === "failed" || item.status === "bounced").length;
    if (related.length > 0 && related.every((item) => item.status !== "queued" && item.status !== "processing")) {
      announcement.status = announcement.totalFailed === related.length ? "failed" : "sent";
    }
    announcement.updatedAt = now();
  }
}

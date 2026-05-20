import { integer, jsonb, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";

// Hand-rolled phone-OTP auth.
//   user      — one row per verified phone number
//   session   — one row per active login; id is the opaque cookie value
//   phoneOtp  — one row per phone number with an outstanding OTP

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  phoneNumber: text("phone_number").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const phoneOtp = pgTable("phone_otp", {
  phoneNumber: text("phone_number").primaryKey(),
  codeHash: text("code_hash").notNull(),
  attempts: integer("attempts").notNull().default(0),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const organizations = pgTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  ownerId: text("owner_id").notNull(),
  plan: text("plan").default("starter"),
  smsCreditsIncluded: integer("sms_credits_included").default(300),
  smsCreditsUsed: integer("sms_credits_used").default(0),
  billingCycleStart: timestamp("billing_cycle_start"),
  whopCompanyId: text("whop_company_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const orgMembers = pgTable("org_members", {
  id: text("id").primaryKey(),
  orgId: text("org_id").references(() => organizations.id),
  userId: text("user_id").notNull(),
  role: text("role").default("member"),
  createdAt: timestamp("created_at").defaultNow()
});

export const apiKeys = pgTable("api_keys", {
  id: text("id").primaryKey(),
  orgId: text("org_id").references(() => organizations.id),
  name: text("name").notNull(),
  keyHash: text("key_hash").notNull(),
  keyPrefix: text("key_prefix").notNull(),
  scopes: text("scopes").array(),
  lastUsedAt: timestamp("last_used_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow()
});

export const lists = pgTable("lists", {
  id: text("id").primaryKey(),
  orgId: text("org_id").references(() => organizations.id),
  name: text("name").notNull(),
  description: text("description"),
  subscriberCount: integer("subscriber_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const subscribers = pgTable("subscribers", {
  id: text("id").primaryKey(),
  orgId: text("org_id").references(() => organizations.id),
  phoneE164: text("phone_e164"),
  email: text("email"),
  name: text("name"),
  metadata: jsonb("metadata"),
  channelPreferences: jsonb("channel_preferences"),
  whopUserId: text("whop_user_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const listSubscribers = pgTable(
  "list_subscribers",
  {
    id: text("id").primaryKey(),
    listId: text("list_id").references(() => lists.id),
    subscriberId: text("subscriber_id").references(() => subscribers.id),
    subscribedAt: timestamp("subscribed_at").defaultNow(),
    unsubscribedAt: timestamp("unsubscribed_at")
  },
  (table) => ({
    unique: unique().on(table.listId, table.subscriberId)
  })
);

export const announcements = pgTable("announcements", {
  id: text("id").primaryKey(),
  orgId: text("org_id").references(() => organizations.id),
  title: text("title"),
  contentHtml: text("content_html"),
  contentText: text("content_text").notNull(),
  channels: text("channels").array(),
  listIds: text("list_ids").array(),
  status: text("status").default("draft"),
  scheduledFor: timestamp("scheduled_for"),
  sentAt: timestamp("sent_at"),
  triggeredBy: text("triggered_by"),
  totalRecipients: integer("total_recipients").default(0),
  totalDelivered: integer("total_delivered").default(0),
  totalOpened: integer("total_opened").default(0),
  totalFailed: integer("total_failed").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const deliveries = pgTable("deliveries", {
  id: text("id").primaryKey(),
  announcementId: text("announcement_id").references(() => announcements.id),
  subscriberId: text("subscriber_id").references(() => subscribers.id),
  channel: text("channel").notNull(),
  status: text("status").default("queued"),
  externalId: text("external_id"),
  deliveredAt: timestamp("delivered_at"),
  openedAt: timestamp("opened_at"),
  failureReason: text("failure_reason"),
  createdAt: timestamp("created_at").defaultNow()
});

export const sources = pgTable("sources", {
  id: text("id").primaryKey(),
  orgId: text("org_id").references(() => organizations.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  config: jsonb("config").notNull(),
  status: text("status").default("active"),
  lastEventAt: timestamp("last_event_at"),
  lastError: text("last_error"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const sourceEvents = pgTable("source_events", {
  id: text("id").primaryKey(),
  sourceId: text("source_id").references(() => sources.id),
  payload: jsonb("payload").notNull(),
  processedAt: timestamp("processed_at"),
  agentId: text("agent_id"),
  announcementId: text("announcement_id"),
  createdAt: timestamp("created_at").defaultNow()
});

export const webhooks = pgTable("webhooks", {
  id: text("id").primaryKey(),
  orgId: text("org_id").references(() => organizations.id),
  sourceId: text("source_id").references(() => sources.id),
  endpointPath: text("endpoint_path").unique().notNull(),
  secret: text("secret").notNull(),
  description: text("description"),
  lastReceivedAt: timestamp("last_received_at"),
  totalReceived: integer("total_received").default(0),
  createdAt: timestamp("created_at").defaultNow()
});

export const agents = pgTable("agents", {
  id: text("id").primaryKey(),
  orgId: text("org_id").references(() => organizations.id),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").default("active"),
  processingMode: text("processing_mode").notNull(),
  sourceIds: text("source_ids").array(),
  triggerType: text("trigger_type"),
  schedule: text("schedule"),
  timezone: text("timezone").default("America/New_York"),
  templateText: text("template_text"),
  systemPrompt: text("system_prompt"),
  userPromptTemplate: text("user_prompt_template"),
  model: text("model").default("claude-sonnet-4-20250514"),
  tools: text("tools").array(),
  maxTokens: integer("max_tokens").default(500),
  defaultListIds: text("default_list_ids").array(),
  defaultChannels: text("default_channels").array(),
  totalRuns: integer("total_runs").default(0),
  totalMessagesSent: integer("total_messages_sent").default(0),
  lastRunAt: timestamp("last_run_at"),
  lastError: text("last_error"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const agentRuns = pgTable("agent_runs", {
  id: text("id").primaryKey(),
  agentId: text("agent_id").references(() => agents.id),
  sourceEventId: text("source_event_id"),
  status: text("status").default("running"),
  input: jsonb("input"),
  reasoning: text("reasoning"),
  output: text("output"),
  announcementId: text("announcement_id"),
  durationMs: integer("duration_ms"),
  tokensUsed: integer("tokens_used"),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow()
});

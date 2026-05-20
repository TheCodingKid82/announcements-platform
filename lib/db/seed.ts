import { db, client } from "./index";
import { agents, announcements, deliveries, listSubscribers, lists, orgMembers, organizations, subscribers, sources } from "./schema";
import { createId } from "@/lib/utils/id";

async function main() {
  if (!db || !client) {
    throw new Error("DATABASE_URL is required to seed data");
  }

  const orgId = "org_seed";
  await db.insert(organizations).values({
    id: orgId,
    name: "Vertigo Apps",
    slug: "vertigo",
    ownerId: "usr_seed",
    plan: "growth",
    smsCreditsIncluded: 1500,
    smsCreditsUsed: 842,
    billingCycleStart: new Date()
  }).onConflictDoNothing();

  await db.insert(orgMembers).values({
    id: createId("usr"),
    orgId,
    userId: "usr_seed",
    role: "owner"
  }).onConflictDoNothing();

  await db.insert(lists).values([
    { id: "lst_signals", orgId, name: "Premium Signals", description: "Traders who need urgent alerts", subscriberCount: 4219 },
    { id: "lst_briefings", orgId, name: "AI Daily", description: "Daily product summaries", subscriberCount: 12847 },
    { id: "lst_drops", orgId, name: "Drop Alerts", description: "Inventory watchers", subscriberCount: 6402 }
  ]).onConflictDoNothing();

  await db.insert(subscribers).values([
    { id: "sub_alex", orgId, name: "Alex Park", phoneE164: "+14155550120", email: "alex@example.com", channelPreferences: { sms: true, email: true } },
    { id: "sub_maria", orgId, name: "Maria Sosa", phoneE164: "+12125550188", email: "maria@example.com", channelPreferences: { imessage: true, email: true } },
    { id: "sub_jordan", orgId, name: "Jordan Kim", phoneE164: "+13105550104", email: "jordan@example.com", channelPreferences: { sms: true } }
  ]).onConflictDoNothing();

  await db.insert(listSubscribers).values([
    { id: createId("sub"), listId: "lst_signals", subscriberId: "sub_alex" },
    { id: createId("sub"), listId: "lst_briefings", subscriberId: "sub_maria" },
    { id: createId("sub"), listId: "lst_drops", subscriberId: "sub_jordan" }
  ]).onConflictDoNothing();

  await db.insert(announcements).values([
    {
      id: "ann_seed_signal",
      orgId,
      title: "SOL breakout alert",
      contentText: "SOL long entry at $182.41. Breaking 50d MA on high volume.",
      contentHtml: "<p>SOL long entry at $182.41. Breaking 50d MA on high volume.</p>",
      channels: ["sms", "email"],
      listIds: ["lst_signals"],
      status: "sent",
      sentAt: new Date(),
      triggeredBy: "agent:agt_seed_trading",
      totalRecipients: 4219,
      totalDelivered: 4138,
      totalOpened: 4072,
      totalFailed: 81
    }
  ]).onConflictDoNothing();

  await db.insert(deliveries).values([
    { id: "del_alex_sms", announcementId: "ann_seed_signal", subscriberId: "sub_alex", channel: "sms", status: "opened", deliveredAt: new Date(), openedAt: new Date() },
    { id: "del_maria_email", announcementId: "ann_seed_signal", subscriberId: "sub_maria", channel: "email", status: "delivered", deliveredAt: new Date() }
  ]).onConflictDoNothing();

  await db.insert(sources).values([
    { id: "src_tradingview", orgId, name: "TradingView alerts", type: "webhook", config: { secret: "seed_secret" }, status: "active", lastEventAt: new Date() }
  ]).onConflictDoNothing();

  await db.insert(agents).values([
    {
      id: "agt_seed_trading",
      orgId,
      name: "Trading signal filter",
      description: "Reads webhook events, checks risk rules, and sends high conviction alerts.",
      status: "active",
      processingMode: "agent",
      sourceIds: ["src_tradingview"],
      triggerType: "source_event",
      systemPrompt: "Decide if this signal is urgent enough to send.",
      tools: ["fetch_url", "send_announcement", "skip"],
      defaultListIds: ["lst_signals"],
      defaultChannels: ["sms", "email"],
      totalRuns: 183,
      totalMessagesSent: 62014,
      lastRunAt: new Date()
    }
  ]).onConflictDoNothing();

  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

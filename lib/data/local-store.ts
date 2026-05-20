import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { createId } from "@/lib/utils/id";
import type { PlatformStore, Channel } from "./types";

const dataDir = path.join(process.cwd(), ".data");
const storePath = path.join(dataDir, "platform.json");

function now() {
  return new Date().toISOString();
}

function hashKey(key: string) {
  return createHash("sha256").update(key).digest("hex");
}

function seedStore(): PlatformStore {
  const createdAt = now();
  const orgId = "org_local";
  const key = process.env.LOCAL_API_KEY ?? "ann_k_local_test_key";

  return {
    organizations: [
      {
        id: orgId,
        name: "Local workspace",
        slug: "local",
        ownerId: "usr_local",
        plan: "starter",
        smsCreditsIncluded: 300,
        smsCreditsUsed: 0,
        billingCycleStart: createdAt,
        whopCompanyId: null,
        createdAt,
        updatedAt: createdAt
      }
    ],
    apiKeys: [
      {
        id: createId("key"),
        orgId,
        name: "Local test key",
        keyHash: hashKey(key),
        keyPrefix: `${key.slice(0, 14)}...`,
        scopes: ["send", "agents", "lists", "sources", "analytics"],
        lastUsedAt: null,
        expiresAt: null,
        createdAt
      }
    ],
    lists: [],
    subscribers: [],
    listSubscribers: [],
    announcements: [],
    deliveries: [],
    sources: [],
    sourceEvents: [],
    webhooks: [],
    agents: [],
    agentRuns: []
  };
}

export async function readLocalStore(): Promise<PlatformStore> {
  await mkdir(dataDir, { recursive: true });
  try {
    const raw = await readFile(storePath, "utf8");
    return normalizeStore(JSON.parse(raw) as PlatformStore);
  } catch {
    const store = seedStore();
    await writeLocalStore(store);
    return store;
  }
}

function normalizeStore(store: PlatformStore): PlatformStore {
  for (const announcement of store.announcements ?? []) {
    const existing = announcement.channelMessages ?? {};
    announcement.channelMessages = {};
    for (const channel of announcement.channels ?? []) {
      const typedChannel = channel as Channel;
      announcement.channelMessages[typedChannel] = existing[typedChannel] ?? {
        subject: typedChannel === "email" ? announcement.title ?? "Announcement" : null,
        preview: null,
        text: announcement.contentText,
        html: typedChannel === "email" ? announcement.contentHtml : null
      };
    }
  }
  return store;
}

export async function writeLocalStore(store: PlatformStore) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(storePath, `${JSON.stringify(store, null, 2)}\n`);
}

export async function updateLocalStore<T>(mutate: (store: PlatformStore) => T | Promise<T>) {
  const store = await readLocalStore();
  const result = await mutate(store);
  await writeLocalStore(store);
  return result;
}

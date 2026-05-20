import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { session, user } from "@/lib/db/schema";

export const SESSION_COOKIE = "platform_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export type SessionUser = {
  id: string;
  phoneNumber: string;
  name: string;
};

function generateSessionId(): string {
  return `sess_${randomBytes(32).toString("base64url")}`;
}

export async function createSession(userId: string): Promise<{ id: string; expiresAt: Date }> {
  if (!db) throw new Error("DATABASE_URL is not set.");
  const id = generateSessionId();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(session).values({ id, userId, expiresAt });

  const jar = await cookies();
  jar.set(SESSION_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt
  });

  return { id, expiresAt };
}

export async function destroyCurrentSession(): Promise<void> {
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  jar.delete(SESSION_COOKIE);
  if (!id || !db) return;
  await db.delete(session).where(eq(session.id, id));
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  if (!db) return null;
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  if (!id) return null;

  const rows = await db
    .select({
      sessionId: session.id,
      expiresAt: session.expiresAt,
      userId: user.id,
      phoneNumber: user.phoneNumber,
      name: user.name
    })
    .from(session)
    .innerJoin(user, eq(user.id, session.userId))
    .where(eq(session.id, id))
    .limit(1);

  const row = rows[0];
  if (!row) return null;
  if (row.expiresAt.getTime() < Date.now()) {
    await db.delete(session).where(eq(session.id, id));
    return null;
  }
  return { id: row.userId, phoneNumber: row.phoneNumber, name: row.name };
}

export async function requireUser(): Promise<SessionUser> {
  const u = await getCurrentUser();
  if (!u) {
    throw new Error("Unauthenticated.");
  }
  return u;
}

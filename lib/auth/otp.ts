import { createHmac, randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { phoneOtp, user } from "@/lib/db/schema";
import { sendLinqOtpSms } from "./linq-sms";

// 6-digit OTP with 5-minute expiry, 5 verification attempts, 30-second
// resend cooldown. Codes are stored as HMAC(SHA-256, AUTH_SECRET) so a
// DB read alone cannot reveal an in-flight code.

const OTP_LENGTH = 6;
const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 30 * 1000;
const MAX_ATTEMPTS = 5;

export type RequestOtpResult =
  | { ok: true }
  | { ok: false; reason: "invalid_phone" | "rate_limited" | "send_failed"; message: string };

export type VerifyOtpResult =
  | { ok: true; userId: string }
  | {
      ok: false;
      reason: "invalid_phone" | "no_code" | "expired" | "too_many_attempts" | "wrong_code";
      message: string;
    };

export function normalizePhone(input: string): string | null {
  const trimmed = input.trim().replace(/[\s().-]/g, "");
  if (/^\+[1-9]\d{6,14}$/.test(trimmed)) return trimmed;
  if (/^[2-9]\d{9}$/.test(trimmed)) return `+1${trimmed}`;
  return null;
}

function hashCode(phone: string, code: string): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set.");
  return createHmac("sha256", secret).update(`${phone}:${code}`).digest("hex");
}

function generateCode(): string {
  const max = 10 ** OTP_LENGTH;
  return randomInt(0, max).toString().padStart(OTP_LENGTH, "0");
}

export async function requestOtp(rawPhone: string): Promise<RequestOtpResult> {
  if (!db) throw new Error("DATABASE_URL is not set.");
  const phone = normalizePhone(rawPhone);
  if (!phone) {
    return { ok: false, reason: "invalid_phone", message: "Enter a valid phone number with country code." };
  }

  const existing = await db.select().from(phoneOtp).where(eq(phoneOtp.phoneNumber, phone)).limit(1);
  if (existing.length > 0) {
    const ageMs = Date.now() - existing[0].createdAt.getTime();
    if (ageMs < RESEND_COOLDOWN_MS) {
      const wait = Math.ceil((RESEND_COOLDOWN_MS - ageMs) / 1000);
      return { ok: false, reason: "rate_limited", message: `Please wait ${wait}s before requesting a new code.` };
    }
  }

  const code = generateCode();
  const codeHash = hashCode(phone, code);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await db
    .insert(phoneOtp)
    .values({ phoneNumber: phone, codeHash, attempts: 0, expiresAt })
    .onConflictDoUpdate({
      target: phoneOtp.phoneNumber,
      set: { codeHash, attempts: 0, expiresAt, createdAt: new Date() }
    });

  try {
    await sendLinqOtpSms(phone, code);
  } catch (err) {
    // Roll back the row so the user can retry without waiting out the
    // cooldown after a delivery failure.
    await db.delete(phoneOtp).where(eq(phoneOtp.phoneNumber, phone));
    return {
      ok: false,
      reason: "send_failed",
      message: err instanceof Error ? err.message : "Could not send the code. Try again."
    };
  }

  return { ok: true };
}

export async function verifyOtp(rawPhone: string, rawCode: string): Promise<VerifyOtpResult> {
  if (!db) throw new Error("DATABASE_URL is not set.");
  const phone = normalizePhone(rawPhone);
  if (!phone) {
    return { ok: false, reason: "invalid_phone", message: "Enter a valid phone number." };
  }
  const code = rawCode.trim();
  if (!/^\d{4,8}$/.test(code)) {
    return { ok: false, reason: "wrong_code", message: "Enter the code we texted you." };
  }

  const rows = await db.select().from(phoneOtp).where(eq(phoneOtp.phoneNumber, phone)).limit(1);
  const row = rows[0];
  if (!row) {
    return { ok: false, reason: "no_code", message: "Request a new code." };
  }
  if (row.expiresAt.getTime() < Date.now()) {
    await db.delete(phoneOtp).where(eq(phoneOtp.phoneNumber, phone));
    return { ok: false, reason: "expired", message: "That code expired. Request a new one." };
  }
  if (row.attempts >= MAX_ATTEMPTS) {
    await db.delete(phoneOtp).where(eq(phoneOtp.phoneNumber, phone));
    return { ok: false, reason: "too_many_attempts", message: "Too many attempts. Request a new code." };
  }

  const expected = Buffer.from(row.codeHash, "hex");
  const actual = Buffer.from(hashCode(phone, code), "hex");
  const matches = expected.length === actual.length && timingSafeEqual(expected, actual);

  if (!matches) {
    await db.update(phoneOtp).set({ attempts: row.attempts + 1 }).where(eq(phoneOtp.phoneNumber, phone));
    return { ok: false, reason: "wrong_code", message: "That code didn't match. Try again." };
  }

  // One-time use — burn the row before we mint anything.
  await db.delete(phoneOtp).where(eq(phoneOtp.phoneNumber, phone));

  const existing = await db.select().from(user).where(eq(user.phoneNumber, phone)).limit(1);
  if (existing[0]) {
    return { ok: true, userId: existing[0].id };
  }

  const id = `usr_${randomUUID().replace(/-/g, "").slice(0, 24)}`;
  await db.insert(user).values({ id, phoneNumber: phone, name: phone }).onConflictDoNothing();
  const created = await db.select().from(user).where(eq(user.phoneNumber, phone)).limit(1);
  if (!created[0]) {
    throw new Error("Failed to materialise user after OTP verify.");
  }
  return { ok: true, userId: created[0].id };
}


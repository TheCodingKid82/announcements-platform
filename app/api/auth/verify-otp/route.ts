import { NextResponse } from "next/server";
import { createSession, verifyOtp } from "@/lib/auth";

export async function POST(request: Request) {
  let body: { phoneNumber?: string; code?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const phoneNumber = typeof body.phoneNumber === "string" ? body.phoneNumber : "";
  const code = typeof body.code === "string" ? body.code : "";

  try {
    const result = await verifyOtp(phoneNumber, code);
    if (!result.ok) {
      const status = result.reason === "wrong_code" || result.reason === "expired" ? 401 : 400;
      return NextResponse.json({ ok: false, reason: result.reason, message: result.message }, { status });
    }
    await createSession(result.userId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown server error.";
    console.error("[verify-otp] failed", err);
    return NextResponse.json(
      { ok: false, reason: "server_error", message: `Server error: ${message}` },
      { status: 500 }
    );
  }
}

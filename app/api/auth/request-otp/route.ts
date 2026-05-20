import { NextResponse } from "next/server";
import { requestOtp } from "@/lib/auth";

export async function POST(request: Request) {
  let body: { phoneNumber?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const phoneNumber = typeof body.phoneNumber === "string" ? body.phoneNumber : "";

  try {
    const result = await requestOtp(phoneNumber);
    if (!result.ok) {
      const status = result.reason === "rate_limited" ? 429 : result.reason === "send_failed" ? 502 : 400;
      return NextResponse.json({ ok: false, reason: result.reason, message: result.message }, { status });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown server error.";
    console.error("[request-otp] failed", err);
    return NextResponse.json(
      { ok: false, reason: "server_error", message: `Server error: ${message}` },
      { status: 500 }
    );
  }
}

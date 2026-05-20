"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

type Step = "phone" | "code";

function normalizePhoneForDisplay(input: string): string | null {
  const trimmed = input.trim().replace(/[\s().-]/g, "");
  if (/^\+[1-9]\d{6,14}$/.test(trimmed)) return trimmed;
  if (/^[2-9]\d{9}$/.test(trimmed)) return `+1${trimmed}`;
  return null;
}

async function postJson(path: string, body: Record<string, unknown>) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string };
  return { ok: res.ok && data.ok !== false, message: data.message };
}

export function AuthForm() {
  const router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const e164 = normalizePhoneForDisplay(phone);
    if (!e164) {
      toast.push("Enter a valid phone number with country code, e.g. +14155551234");
      return;
    }
    setLoading(true);
    const { ok, message } = await postJson("/api/auth/request-otp", { phoneNumber: e164 });
    setLoading(false);
    if (!ok) {
      toast.push(message ?? "Could not send code. Try again.");
      return;
    }
    setPhone(e164);
    setStep("code");
    toast.push(`Code sent to ${e164}`);
  }

  async function verifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (code.trim().length < 4) {
      toast.push("Enter the 6-digit code we texted you.");
      return;
    }
    setLoading(true);
    const { ok, message } = await postJson("/api/auth/verify-otp", {
      phoneNumber: phone,
      code: code.trim()
    });
    setLoading(false);
    if (!ok) {
      toast.push(message ?? "Invalid code. Try again.");
      return;
    }
    toast.push("Welcome to Announcements");
    router.push("/dashboard");
    router.refresh();
  }

  if (step === "code") {
    return (
      <form onSubmit={verifyCode} className="space-y-4">
        <p className="text-sm text-zinc-400">
          We texted a 6-digit code to <span className="font-medium text-white">{phone}</span>.
        </p>
        <Input
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="123456"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <Button className="w-full" disabled={loading}>
          {loading ? "Verifying" : "Verify and continue"}
        </Button>
        <button
          type="button"
          onClick={() => {
            setCode("");
            setStep("phone");
          }}
          className="block w-full text-center text-sm text-zinc-500 hover:text-white"
        >
          Use a different number
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={sendCode} className="space-y-4">
      <Input
        name="phone"
        type="tel"
        autoComplete="tel"
        placeholder="+1 415 555 1234"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <Button className="w-full" disabled={loading}>
        {loading ? "Sending code" : "Send code"}
      </Button>
      <p className="text-xs text-zinc-500">
        We will text you a 6-digit code. Standard rates apply. Reply STOP to opt out.
      </p>
    </form>
  );
}

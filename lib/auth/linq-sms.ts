const LINQ_ENDPOINT = "https://api.linqapp.com/api/partner/v3/chats";

export function isLinqConfigured(): boolean {
  return Boolean(process.env.LINQ_API_TOKEN && process.env.LINQ_FROM_NUMBER);
}

export async function sendLinqOtpSms(phoneNumber: string, code: string): Promise<void> {
  if (!isLinqConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[linq-sms] dev fallback — OTP for ${phoneNumber}: ${code}`);
      return;
    }
    throw new Error("Linq SMS is not configured. Set LINQ_API_TOKEN and LINQ_FROM_NUMBER.");
  }

  const body = `Your Announcements code is ${code}. It expires in 5 minutes. Reply STOP to opt out.`;

  const res = await fetch(LINQ_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.LINQ_API_TOKEN as string}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      from: process.env.LINQ_FROM_NUMBER as string,
      to: [phoneNumber],
      message: { parts: [{ type: "text", value: body }] }
    })
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Linq OTP send failed: ${res.status} ${errText.slice(0, 300)}`);
  }
}

import { NextRequest } from "next/server";
import { validateStoredApiKey } from "@/lib/data/platform";
import { checkRateLimit } from "@/lib/utils/rate-limit";

export type ApiContext = {
  orgId: string;
  keyPrefix: string;
  scopes: string[];
};

export async function validateApiRequest(request: NextRequest, scope: string): Promise<ApiContext> {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    throw Object.assign(new Error("Missing API key"), { status: 401, code: "missing_api_key" });
  }

  const rate = checkRateLimit(token);
  if (!rate.ok) {
    throw Object.assign(new Error("Rate limit exceeded"), { status: 429, code: "rate_limited" });
  }

  return validateStoredApiKey(token, scope);
}

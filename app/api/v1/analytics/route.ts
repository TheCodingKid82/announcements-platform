import { NextRequest } from "next/server";
import { validateApiRequest } from "@/lib/api/middleware";
import { ok, fail } from "@/lib/api/responses";
import { getAnalyticsData } from "@/lib/data/platform";

export async function GET(request: NextRequest) {
  try {
    await validateApiRequest(request, "analytics");
    return ok(await getAnalyticsData());
  } catch (error) {
    return fail(error);
  }
}

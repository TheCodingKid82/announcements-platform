import { NextRequest } from "next/server";
import { validateApiRequest } from "@/lib/api/middleware";
import { ok, fail } from "@/lib/api/responses";
import { getAnnouncement, listDeliveriesWithSubscribers } from "@/lib/data/platform";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await validateApiRequest(request, "analytics");
    const { id } = await context.params;
    const announcement = await getAnnouncement(id);
    if (!announcement) throw Object.assign(new Error("Resource not found"), { status: 404, code: "not_found" });
    return ok({ announcement, deliveries: await listDeliveriesWithSubscribers(id) });
  } catch (error) {
    return fail(error);
  }
}

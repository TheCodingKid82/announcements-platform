import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api/responses";
import { listSources } from "@/lib/data/platform";

export async function POST(request: NextRequest) {
  try {
    if (request.headers.get("x-cron-secret") !== process.env.CRON_SECRET) throw Object.assign(new Error("Unauthorized"), { status: 401, code: "unauthorized" });
    const sources = await listSources();
    return ok({ checked: sources.length, eventsCreated: 0 });
  } catch (error) {
    return fail(error);
  }
}

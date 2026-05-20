import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api/responses";
import { processQueue } from "@/lib/delivery/router";

export async function POST(request: NextRequest) {
  try {
    if (request.headers.get("x-cron-secret") !== process.env.CRON_SECRET) throw Object.assign(new Error("Unauthorized"), { status: 401, code: "unauthorized" });
    const result = await processQueue();
    return ok(result);
  } catch (error) {
    return fail(error);
  }
}

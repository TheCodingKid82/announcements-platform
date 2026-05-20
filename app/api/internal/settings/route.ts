import { NextRequest } from "next/server";
import { z } from "zod";
import { fail, ok } from "@/lib/api/responses";
import { updateLocalStore } from "@/lib/data/local-store";

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1)
});

export async function PATCH(request: NextRequest) {
  try {
    const body = schema.parse(await request.json());
    const org = await updateLocalStore((store) => {
      const row = store.organizations[0];
      if (!row) throw Object.assign(new Error("Organization not found"), { status: 404, code: "not_found" });
      row.name = body.name;
      row.slug = body.slug;
      row.updatedAt = new Date().toISOString();
      return row;
    });
    return ok(org);
  } catch (error) {
    return fail(error);
  }
}

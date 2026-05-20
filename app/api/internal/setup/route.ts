import { createStarterSetup } from "@/lib/data/platform";
import { fail, ok } from "@/lib/api/responses";

export async function POST() {
  try {
    return ok(await createStarterSetup(), { status: 201 });
  } catch (error) {
    return fail(error);
  }
}

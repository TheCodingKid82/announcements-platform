import { NextRequest } from "next/server";
import { z } from "zod";
import { ok, fail } from "./responses";
import { validateApiRequest } from "./middleware";
import { createId, IdPrefix } from "@/lib/utils/id";

type CollectionConfig<T extends { id: string }> = {
  scope: string;
  prefix: IdPrefix;
  items: T[];
  schema: z.ZodTypeAny;
};

export function collectionHandlers<T extends { id: string }>(config: CollectionConfig<T>) {
  return {
    GET: async (request: NextRequest) => {
      try {
        await validateApiRequest(request, config.scope);
        return ok({ items: config.items, nextCursor: null });
      } catch (error) {
        return fail(error);
      }
    },
    POST: async (request: NextRequest) => {
      try {
        await validateApiRequest(request, config.scope);
        const body = config.schema.parse(await request.json()) as Record<string, unknown>;
        const created = { id: createId(config.prefix), ...body };
        return ok(created, { status: 201 });
      } catch (error) {
        return fail(error);
      }
    }
  };
}

export function itemHandlers<T extends { id: string }>(config: { scope: string; items: T[] }) {
  return {
    GET: async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
      try {
        await validateApiRequest(request, config.scope);
        const { id } = await context.params;
        const item = config.items.find((entry) => entry.id === id);
        if (!item) throw Object.assign(new Error("Resource not found"), { status: 404, code: "not_found" });
        return ok(item);
      } catch (error) {
        return fail(error);
      }
    },
    PATCH: async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
      try {
        await validateApiRequest(request, config.scope);
        const { id } = await context.params;
        const patch = await request.json();
        return ok({ id, ...patch });
      } catch (error) {
        return fail(error);
      }
    },
    DELETE: async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
      try {
        await validateApiRequest(request, config.scope);
        const { id } = await context.params;
        return ok({ id, deleted: true });
      } catch (error) {
        return fail(error);
      }
    }
  };
}

import { tool } from "ai";
import { z } from "zod";

export const agentTools = {
  fetch_url: tool({
    description: "Fetch a URL and return text content",
    inputSchema: z.object({ url: z.string().url() }),
    execute: async ({ url }) => {
      const response = await fetch(url);
      return response.text();
    }
  }),
  query_api: tool({
    description: "Call a JSON API",
    inputSchema: z.object({ url: z.string().url(), method: z.enum(["GET", "POST"]).default("GET") }),
    execute: async ({ url, method }) => {
      const response = await fetch(url, { method });
      return response.json();
    }
  }),
  send_announcement: tool({
    description: "Queue an announcement for delivery",
    inputSchema: z.object({ message: z.string(), listId: z.string(), channels: z.array(z.string()) }),
    execute: async (input) => ({ queued: true, ...input })
  }),
  skip: tool({
    description: "Skip sending because the event is not important",
    inputSchema: z.object({ reason: z.string() }),
    execute: async ({ reason }) => ({ skipped: true, reason })
  })
};

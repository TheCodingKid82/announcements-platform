import { CodeBlock } from "@/components/ui/code-block";

const apiCode = `await fetch("https://announcementsapp.com/api/v1/send", {
  method: "POST",
  headers: {
    authorization: "Bearer ann_k_live_xxxxx",
    contentType: "application/json"
  },
  body: JSON.stringify({
    list: "premium_signals",
    message: "SOL breaking out.",
    channels: ["sms", "email"]
  })
})`;

const mcpCode = `await announcements.send({
  list: "ai_daily",
  message: brief,
  channels: ["sms", "imessage"]
})`;

export function DeveloperSection() {
  return (
    <section id="developers" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm uppercase tracking-[0.18em] text-blue-300">Developers</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white">API and MCP first.</h2>
        <p className="mt-4 text-zinc-400">Drop Announcements into agents, scripts, cron jobs, and dashboards.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <CodeBlock title="Send with API" code={apiCode} />
        <CodeBlock title="Send from an agent" code={mcpCode} />
      </div>
    </section>
  );
}

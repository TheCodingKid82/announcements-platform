import { Card } from "@/components/ui/card";

const layers = [
  { title: "Inputs", detail: "Trigger messages from time, webhooks, API calls, MCP tools, compose screens, or replies." },
  { title: "Intelligence", detail: "Choose passthrough, templates, transforms, or agents that fetch context and decide." },
  { title: "Delivery", detail: "Fan out to SMS, iMessage, email, and future channels with subscriber preferences." }
];

export function PlatformOverview() {
  return (
    <section id="platform" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm uppercase tracking-[0.18em] text-blue-300">Platform</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white">Three layers from signal to human.</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {layers.map((layer) => (
          <Card key={layer.title}>
            <h3 className="text-xl font-semibold text-white">{layer.title}</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{layer.detail}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

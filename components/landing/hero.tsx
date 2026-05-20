import { ArrowRight, Brain, Cable, Send } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="mx-auto grid min-h-[760px] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <div className="mb-6 inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-sm text-blue-200">
          Agentic communications for urgent moments
        </div>
        <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
          The communication layer for the AI age.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          Connect data sources, let agents decide what matters, and reach people instantly across SMS, iMessage, email, and every channel your audience opens.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href="/auth/login">
            Start building
            <ArrowRight className="h-4 w-4" />
          </LinkButton>
          <LinkButton href="#developers" variant="secondary">View API</LinkButton>
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="grid gap-3">
          {[
            { icon: Cable, title: "Inputs", text: "Webhooks, schedules, API calls, MCP tools, manual compose, and replies." },
            { icon: Brain, title: "Intelligence", text: "Passthrough rules, templates, AI transforms, and autonomous agents." },
            { icon: Send, title: "Delivery", text: "SMS, iMessage, email, and future channels from one routing layer." }
          ].map((item, index) => (
            <div key={item.title} className="relative rounded-lg border border-white/10 bg-[#111111] p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-blue-500/15 text-blue-200">
                  <item.icon className="h-5 w-5" />
                </span>
                <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">Layer 0{index + 1}</span>
              </div>
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

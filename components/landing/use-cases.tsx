import { Activity, Bell, GraduationCap, Server, Sparkles, Trophy } from "lucide-react";

const cases = [
  { icon: Activity, title: "Trading Signals", text: "Turn market events into fast alerts with risk rules and subscriber routing." },
  { icon: Sparkles, title: "AI Briefings", text: "Let an agent monitor sources and write concise daily updates." },
  { icon: Trophy, title: "Sports Picks", text: "Watch odds movement and notify subscribers before lines change." },
  { icon: Bell, title: "Drop Alerts", text: "Detect inventory changes and send the purchase link first." },
  { icon: GraduationCap, title: "Course and Coaching", text: "Schedule lessons, accountability messages, and habit reminders." },
  { icon: Server, title: "Developer Alerts", text: "Route deploys, incidents, and system events to the people on call." }
];

export function UseCases() {
  return (
    <section id="uses" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm uppercase tracking-[0.18em] text-blue-300">Use cases</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white">Built for messages people cannot miss.</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cases.map((item) => (
          <div key={item.title} className="rounded-lg border border-white/10 bg-[#111111] p-5">
            <item.icon className="h-5 w-5 text-blue-300" />
            <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

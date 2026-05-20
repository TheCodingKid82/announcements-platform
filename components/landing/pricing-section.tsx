import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const plans = [
  { name: "Starter", price: "$49", detail: "300 texts, unlimited email, one agent" },
  { name: "Growth", price: "$149", detail: "1,500 texts, five agents, priority support" },
  { name: "Pro", price: "$399", detail: "5,000 texts, unlimited agents, SLA support" },
  { name: "Enterprise", price: "Talk to us", detail: "Volume sending, custom channels, dedicated support" }
];

export function PricingSection() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm uppercase tracking-[0.18em] text-blue-300">Pricing</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white">Pay for texts. Everything else is included.</h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.name === "Growth" ? "border-blue-400/40 bg-blue-500/10" : undefined}>
            <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
            <div className="mt-5 text-4xl font-semibold tracking-tight text-white">{plan.price}</div>
            {plan.price.startsWith("$") ? <div className="mt-1 text-sm text-zinc-500">per month</div> : null}
            <p className="mt-5 min-h-16 text-sm leading-6 text-zinc-400">{plan.detail}</p>
            <LinkButton href="/auth/login" variant={plan.name === "Growth" ? "primary" : "secondary"} className="mt-6 w-full">
              Get started
            </LinkButton>
          </Card>
        ))}
      </div>
    </section>
  );
}

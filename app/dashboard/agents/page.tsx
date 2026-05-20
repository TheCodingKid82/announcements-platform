import { AgentCard } from "@/components/agents/agent-card";
import { LinkButton } from "@/components/ui/button";
import { listAgents } from "@/lib/data/platform";

export default async function AgentsPage() {
  const agents = await listAgents();
  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-4"><div><h1 className="text-3xl font-semibold tracking-tight text-white">Agents</h1><p className="mt-2 text-zinc-500">Automation that decides what to send.</p></div><LinkButton href="/dashboard/agents/new">New Agent</LinkButton></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{agents.length === 0 ? <div className="text-sm text-zinc-500">No agents yet.</div> : agents.map((agent) => <AgentCard key={agent.id} agent={agent} />)}</div>
    </div>
  );
}

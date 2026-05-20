import { AgentRunLog } from "@/components/agents/agent-run-log";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAgent, listAgentRuns } from "@/lib/data/platform";
import { formatDate } from "@/lib/utils/format";
import { notFound } from "next/navigation";
import { TriggerAgentButton } from "@/components/agents/trigger-agent-button";

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = await getAgent(id);
  if (!agent) notFound();
  const runs = await listAgentRuns(id);
  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-4"><div><h1 className="text-3xl font-semibold tracking-tight text-white">{agent.name}</h1><p className="mt-2 text-zinc-500">{agent.description}</p></div><div className="flex gap-3"><TriggerAgentButton agentId={agent.id} /><LinkButton href={`/dashboard/agents/${agent.id}/edit`} variant="secondary">Edit</LinkButton></div></div>
      <div className="grid gap-4 md:grid-cols-4"><Card><Badge>{agent.status}</Badge><div className="mt-4 text-sm text-zinc-500">Status</div></Card><Card><div className="text-xl text-white">{agent.processingMode}</div><div className="mt-2 text-sm text-zinc-500">Mode</div></Card><Card><div className="text-xl text-white">{agent.defaultChannels.join(", ") || "None"}</div><div className="mt-2 text-sm text-zinc-500">Channels</div></Card><Card><div className="text-xl text-white">{formatDate(agent.lastRunAt)}</div><div className="mt-2 text-sm text-zinc-500">Last run</div></Card></div>
      <Card><h2 className="mb-4 font-semibold text-white">Run history</h2><AgentRunLog rows={runs} /></Card>
    </div>
  );
}

import { AgentBuilder } from "@/components/agents/agent-builder";
import { getAgent, listLists, listSources } from "@/lib/data/platform";
import { notFound } from "next/navigation";

export default async function EditAgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [agent, lists, sources] = await Promise.all([getAgent(id), listLists(), listSources()]);
  if (!agent) notFound();
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-semibold tracking-tight text-white">Edit Agent</h1><p className="mt-2 text-zinc-500">Update trigger, processing, and output rules.</p></div>
      <AgentBuilder agent={agent} lists={lists} sources={sources} />
    </div>
  );
}

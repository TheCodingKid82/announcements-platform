import { AgentBuilder } from "@/components/agents/agent-builder";
import { listLists, listSources } from "@/lib/data/platform";

export default async function NewAgentPage() {
  const [lists, sources] = await Promise.all([listLists(), listSources()]);
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-semibold tracking-tight text-white">New Agent</h1><p className="mt-2 text-zinc-500">Create a trigger, processing path, and delivery target.</p></div>
      <AgentBuilder lists={lists} sources={sources} />
    </div>
  );
}

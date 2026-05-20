import { LinkButton } from "@/components/ui/button";
import { SourceCard } from "@/components/sources/source-card";
import { listSourceEvents, listSources } from "@/lib/data/platform";

export default async function SourcesPage() {
  const sources = await listSources();
  const sourcesWithCounts = await Promise.all(sources.map(async (source) => ({ ...source, totalEvents: (await listSourceEvents(source.id)).length })));
  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-4"><div><h1 className="text-3xl font-semibold tracking-tight text-white">Sources</h1><p className="mt-2 text-zinc-500">Inputs that trigger messages and agents.</p></div><LinkButton href="/dashboard/sources/new">Add Source</LinkButton></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{sourcesWithCounts.length === 0 ? <div className="text-sm text-zinc-500">No sources yet.</div> : sourcesWithCounts.map((source) => <SourceCard key={source.id} source={source} />)}</div>
    </div>
  );
}

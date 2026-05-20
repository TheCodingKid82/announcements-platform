import { ListCard } from "@/components/audiences/list-card";
import { LinkButton } from "@/components/ui/button";
import { listLists } from "@/lib/data/platform";
import { CreateListButton } from "@/components/audiences/create-list-button";

export default async function AudiencesPage() {
  const lists = await listLists();
  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-4"><div><h1 className="text-3xl font-semibold tracking-tight text-white">Audiences</h1><p className="mt-2 text-zinc-500">Lists, subscribers, segments, and subscribe links.</p></div><div className="flex gap-3"><CreateListButton /><LinkButton href="/dashboard/audiences/subscribers" variant="secondary">All Subscribers</LinkButton></div></div>
      <div className="grid gap-4 md:grid-cols-3">{lists.length === 0 ? <div className="text-sm text-zinc-500">No lists yet. Create one through the API or add subscribers from a list detail page.</div> : lists.map((list) => <ListCard key={list.id} list={list} />)}</div>
    </div>
  );
}

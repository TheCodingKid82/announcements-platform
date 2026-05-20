import { ImportSubscribers } from "@/components/audiences/import-subscribers";
import { SubscribeLinkGenerator } from "@/components/audiences/subscribe-link-generator";
import { SubscriberTable } from "@/components/audiences/subscriber-table";
import { Card } from "@/components/ui/card";
import { getList, listSubscribersWithLists } from "@/lib/data/platform";
import { notFound } from "next/navigation";
import { AddSubscriberButton } from "@/components/audiences/add-subscriber-button";

export default async function ListDetailPage({ params }: { params: Promise<{ listId: string }> }) {
  const { listId } = await params;
  const list = await getList(listId);
  if (!list) notFound();
  const subscribers = await listSubscribersWithLists(listId);
  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-4"><div><h1 className="text-3xl font-semibold tracking-tight text-white">{list.name}</h1><p className="mt-2 text-zinc-500">{list.subscriberCount.toLocaleString()} subscribers.</p></div><div className="flex gap-3"><ImportSubscribers /><AddSubscriberButton listId={list.id} /></div></div>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card><h2 className="mb-4 font-semibold text-white">Subscribers</h2><SubscriberTable subscribers={subscribers} /></Card>
        <Card><h2 className="mb-4 font-semibold text-white">Subscribe link</h2><SubscribeLinkGenerator listId={list.id} /><div className="mt-6 rounded-md bg-black/30 p-3 text-sm text-zinc-400">&lt;form action=&quot;https://announcementsapp.com/subscribe/{list.id}&quot;&gt;</div></Card>
      </div>
    </div>
  );
}

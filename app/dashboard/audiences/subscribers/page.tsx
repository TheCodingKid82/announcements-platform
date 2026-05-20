import { ImportSubscribers } from "@/components/audiences/import-subscribers";
import { SubscriberTable } from "@/components/audiences/subscriber-table";
import { Card } from "@/components/ui/card";
import { listSubscribersWithLists } from "@/lib/data/platform";
import { AddSubscriberButton } from "@/components/audiences/add-subscriber-button";

export default async function SubscribersPage() {
  const subscribers = await listSubscribersWithLists();
  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-4"><div><h1 className="text-3xl font-semibold tracking-tight text-white">Subscribers</h1><p className="mt-2 text-zinc-500">Every subscriber across every list.</p></div><div className="flex gap-3"><ImportSubscribers /><AddSubscriberButton /></div></div>
      <Card><SubscriberTable subscribers={subscribers} /></Card>
    </div>
  );
}

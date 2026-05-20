import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, Td, Th, THead } from "@/components/ui/table";
import { getSource, listSourceEvents } from "@/lib/data/platform";
import { formatDate } from "@/lib/utils/format";
import { notFound } from "next/navigation";

export default async function SourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const source = await getSource(id);
  if (!source) notFound();
  const events = await listSourceEvents(id);
  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-4"><div><h1 className="text-3xl font-semibold tracking-tight text-white">{source.name}</h1><p className="mt-2 text-zinc-500">{source.type} source. Last event {formatDate(source.lastEventAt)}.</p></div><Button variant="secondary">Send Test Event</Button></div>
      <Card><h2 className="mb-4 font-semibold text-white">Configuration</h2><pre className="overflow-auto rounded-md bg-black/30 p-4 text-sm text-zinc-300">{JSON.stringify({ type: source.type, status: source.status, config: source.config }, null, 2)}</pre></Card>
      <Card><h2 className="mb-4 font-semibold text-white">Event log</h2><Table><THead><tr><Th>Time</Th><Th>Payload</Th><Th>Agent</Th><Th>Announcement</Th></tr></THead><tbody>{events.length === 0 ? <tr><Td colSpan={4} className="py-8 text-center text-zinc-500">No events yet.</Td></tr> : events.map((event) => <tr key={event.id}><Td>{formatDate(event.createdAt)}</Td><Td>{JSON.stringify(event.payload).slice(0, 120)}</Td><Td>{event.agentId ?? "None"}</Td><Td>{event.announcementId ?? "None"}</Td></tr>)}</tbody></Table></Card>
    </div>
  );
}

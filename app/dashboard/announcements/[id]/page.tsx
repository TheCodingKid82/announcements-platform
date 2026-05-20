import { AnnouncementStatsRow } from "@/components/analytics/announcement-stats-row";
import { ChannelBreakdown } from "@/components/analytics/channel-breakdown";
import { Card } from "@/components/ui/card";
import { Table, Td, Th, THead } from "@/components/ui/table";
import { getAnalyticsData, getAnnouncement, listDeliveriesWithSubscribers } from "@/lib/data/platform";
import { formatDate } from "@/lib/utils/format";
import { notFound } from "next/navigation";

export default async function AnnouncementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const announcement = await getAnnouncement(id);
  if (!announcement) notFound();
  const deliveries = await listDeliveriesWithSubscribers(id);
  const { channels } = await getAnalyticsData();
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-semibold tracking-tight text-white">{announcement.title}</h1><p className="mt-2 text-zinc-500">Triggered by {announcement.triggeredBy}. Sent {formatDate(announcement.sentAt)}.</p></div>
      <AnnouncementStatsRow recipients={announcement.totalRecipients} delivered={announcement.totalDelivered} opened={announcement.totalOpened} failed={announcement.totalFailed} />
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card><h2 className="mb-4 font-semibold text-white">Channel breakdown</h2><ChannelBreakdown channels={channels} /></Card>
        <Card>
          <h2 className="mb-4 font-semibold text-white">Delivery log</h2>
          <Table><THead><tr><Th>Subscriber</Th><Th>Channel</Th><Th>Status</Th><Th>Delivered</Th><Th>Opened</Th></tr></THead><tbody>{deliveries.length === 0 ? <tr><Td colSpan={5} className="py-8 text-center text-zinc-500">No delivery records yet.</Td></tr> : deliveries.map((row) => <tr key={row.id}><Td>{row.subscriber?.name ?? row.subscriber?.email ?? row.subscriberId}</Td><Td>{row.channel}</Td><Td>{row.status}</Td><Td>{formatDate(row.deliveredAt)}</Td><Td>{formatDate(row.openedAt)}</Td></tr>)}</tbody></Table>
        </Card>
      </div>
    </div>
  );
}

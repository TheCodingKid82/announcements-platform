import Link from "next/link";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Table, Td, Th, THead } from "@/components/ui/table";
import { listAnnouncements } from "@/lib/data/platform";
import { formatDate } from "@/lib/utils/format";

export default async function AnnouncementsPage() {
  const announcements = await listAnnouncements();
  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-4">
        <div><h1 className="text-3xl font-semibold tracking-tight text-white">Announcements</h1><p className="mt-2 text-zinc-500">Sent, scheduled, and draft messages.</p></div>
        <LinkButton href="/dashboard/compose">New Announcement</LinkButton>
      </div>
      <Card>
        <div className="mb-4 grid gap-3 md:grid-cols-3"><Select><option>All statuses</option><option>Sent</option><option>Scheduled</option><option>Draft</option></Select><Select><option>Last 30 days</option><option>Last 7 days</option></Select></div>
        <Table>
          <THead><tr><Th>Title</Th><Th>Status</Th><Th>Recipients</Th><Th>Open rate</Th><Th>Sent at</Th><Th>Triggered by</Th></tr></THead>
          <tbody>
            {announcements.length === 0 ? (
              <tr><Td colSpan={6} className="py-10 text-center text-zinc-500">No announcements yet.</Td></tr>
            ) : announcements.map((item) => {
              const openRate = item.totalDelivered > 0 ? (item.totalOpened / item.totalDelivered) * 100 : 0;
              return (
              <tr key={item.id}>
                <Td><Link href={`/dashboard/announcements/${item.id}`} className="text-white hover:text-blue-300">{item.title}</Link></Td>
                <Td>{item.status}</Td><Td>{item.totalRecipients.toLocaleString()}</Td><Td>{openRate > 0 ? `${openRate.toFixed(1)}%` : "Pending"}</Td><Td>{formatDate(item.sentAt)}</Td><Td>{item.triggeredBy}</Td>
              </tr>
            )})}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}

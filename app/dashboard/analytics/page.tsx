import { ChannelBreakdown } from "@/components/analytics/channel-breakdown";
import { DeliveryChart } from "@/components/analytics/delivery-chart";
import { OpenRateChart } from "@/components/analytics/open-rate-chart";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Table, Td, Th, THead } from "@/components/ui/table";
import { getAnalyticsData } from "@/lib/data/platform";

export default async function AnalyticsPage() {
  const { series, channels, topAnnouncements } = await getAnalyticsData();
  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-4"><div><h1 className="text-3xl font-semibold tracking-tight text-white">Analytics</h1><p className="mt-2 text-zinc-500">Delivery, opens, and channel performance.</p></div><Select className="w-48"><option>Last 30 days</option><option>Last 7 days</option></Select></div>
      <div className="grid gap-6 lg:grid-cols-3"><Card className="lg:col-span-2"><h2 className="mb-4 font-semibold text-white">Messages over time</h2><DeliveryChart series={series} /></Card><Card><h2 className="mb-4 font-semibold text-white">Channel mix</h2><ChannelBreakdown channels={channels} /></Card></div>
      <div className="grid gap-6 lg:grid-cols-2"><Card><h2 className="mb-4 font-semibold text-white">Open rates</h2><OpenRateChart series={series} /></Card><Card><h2 className="mb-4 font-semibold text-white">Top announcements</h2><Table><THead><tr><Th>Title</Th><Th>Recipients</Th><Th>Open rate</Th></tr></THead><tbody>{topAnnouncements.length === 0 ? <tr><Td colSpan={3} className="py-8 text-center text-zinc-500">No announcements yet.</Td></tr> : topAnnouncements.map((item) => { const rate = item.totalDelivered > 0 ? (item.totalOpened / item.totalDelivered) * 100 : 0; return <tr key={item.id}><Td>{item.title}</Td><Td>{item.totalRecipients.toLocaleString()}</Td><Td>{rate > 0 ? `${rate.toFixed(1)}%` : "Pending"}</Td></tr>; })}</tbody></Table></Card></div>
    </div>
  );
}

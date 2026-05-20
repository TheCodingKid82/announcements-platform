import { StatCard } from "@/components/ui/stat-card";

export function AnnouncementStatsRow({ recipients, delivered, opened, failed }: { recipients: number; delivered: number; opened: number; failed: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <StatCard label="Recipients" value={recipients.toLocaleString()} detail="Total targets" />
      <StatCard label="Delivered" value={delivered.toLocaleString()} detail="Provider accepted" />
      <StatCard label="Opened" value={opened.toLocaleString()} detail="Tracked opens" />
      <StatCard label="Failed" value={failed.toLocaleString()} detail="Needs review" />
    </div>
  );
}

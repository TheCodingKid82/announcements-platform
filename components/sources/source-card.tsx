import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/format";
import type { SourceRecord } from "@/lib/data/types";

export function SourceCard({ source }: { source: SourceRecord & { totalEvents?: number } }) {
  return (
    <Link href={`/dashboard/sources/${source.id}`}>
      <Card className="transition hover:border-blue-400/40">
        <div className="mb-4 flex justify-between">
          <Badge>{source.type}</Badge>
          <span className="text-sm text-zinc-500">{source.status}</span>
        </div>
        <h3 className="text-lg font-semibold text-white">{source.name}</h3>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div><div className="text-zinc-500">Last event</div><div className="mt-1 text-white">{formatDate(source.lastEventAt)}</div></div>
          <div><div className="text-zinc-500">Events</div><div className="mt-1 text-white">{source.totalEvents ?? 0}</div></div>
        </div>
      </Card>
    </Link>
  );
}

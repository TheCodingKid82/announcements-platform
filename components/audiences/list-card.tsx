import Link from "next/link";
import { Card } from "@/components/ui/card";

export function ListCard({ list }: { list: { id: string; name: string; description: string | null; subscriberCount: number } }) {
  return (
    <Link href={`/dashboard/audiences/${list.id}`}>
      <Card className="transition hover:border-blue-400/40">
        <h3 className="text-lg font-semibold text-white">{list.name}</h3>
        <p className="mt-2 text-sm text-zinc-400">{list.description ?? "No description yet"}</p>
        <div className="mt-5 text-3xl font-semibold text-white">{list.subscriberCount.toLocaleString()}</div>
        <div className="mt-1 text-sm text-zinc-500">Subscribers</div>
      </Card>
    </Link>
  );
}

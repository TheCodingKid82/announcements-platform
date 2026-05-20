import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/format";
import type { AgentRecord } from "@/lib/data/types";

export function AgentCard({ agent }: { agent: AgentRecord }) {
  return (
    <Link href={`/dashboard/agents/${agent.id}`}>
      <Card className="h-full transition hover:border-blue-400/40">
        <div className="mb-4 flex items-center justify-between">
          <Badge className={agent.status === "paused" ? "border-zinc-500/30 bg-zinc-500/10 text-zinc-300" : undefined}>{agent.status}</Badge>
          <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">{agent.processingMode}</span>
        </div>
        <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
        <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-400">{agent.description ?? "No description yet"}</p>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-zinc-500">Last run</div>
            <div className="mt-1 text-white">{formatDate(agent.lastRunAt)}</div>
          </div>
          <div>
            <div className="text-zinc-500">Messages</div>
            <div className="mt-1 text-white">{agent.totalMessagesSent.toLocaleString()}</div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

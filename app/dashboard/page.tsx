import Link from "next/link";
import { ArrowUpRight, Bot, Megaphone, Radio } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Table, Td, Th, THead, Tr } from "@/components/ui/table";
import { getDashboardData } from "@/lib/data/platform";
import { formatDate, formatNumber } from "@/lib/utils/format";
import { StarterSetup } from "@/components/setup/starter-setup";

export default async function DashboardPage() {
  const { agents, lists, sources, recentAnnouncements, stats, live } = await getDashboardData();
  const openRate = stats.openRate > 0 ? `${stats.openRate.toFixed(1)}%` : "Pending";
  const liveTotal = live.total || 0;
  const liveProcessed = live.processed || 0;
  const liveProgress = liveTotal > 0 ? Math.round((liveProcessed / liveTotal) * 100) : 0;

  return (
    <div className="space-y-10">
      <StarterSetup show={lists.length === 0 || sources.length === 0 || agents.length === 0} />

      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="eyebrow mb-5">Overview · 001</div>
          <h1
            className="text-(--color-ink)"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(40px, 5vw, 64px)",
              lineHeight: 0.94,
              letterSpacing: "-0.04em"
            }}
          >
            Your communications
            <br />
            <span className="text-(--color-red) italic">at a glance.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15.5px] text-(--color-ink-dim) leading-relaxed">
            One platform. Three layers. Every signal that fires today, every agent that
            decided, every subscriber that opened.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <LinkButton href="/dashboard/compose">
            <Megaphone className="h-4 w-4" strokeWidth={2} />
            New broadcast
          </LinkButton>
          <LinkButton href="/dashboard/agents/new" variant="secondary">
            <Bot className="h-4 w-4" strokeWidth={2} />
            New agent
          </LinkButton>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-px bg-(--color-line) border border-(--color-line) md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Subscribers" value={formatNumber(stats.totalSubscribers)} detail={`Across ${stats.listCount} lists`} />
        <StatCard label="Messages sent" value={formatNumber(stats.messagesSent)} detail="Last 30 days" />
        <StatCard label="Open rate" value={openRate} detail="Weighted average" />
        <StatCard label="Active agents" value={formatNumber(stats.activeAgents)} detail={`${stats.pausedAgents} paused`} />
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Recent announcements */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Recent broadcasts</CardTitle>
              <p className="mt-2 font-mono text-[11px] tracking-[0.12em] uppercase text-(--color-ink-mute)">
                Last 14 days
              </p>
            </div>
            <Link
              href="/dashboard/announcements"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.14em] uppercase text-(--color-red) hover:text-(--color-red-bright)"
            >
              View all
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Link>
          </CardHeader>

          <div className="-mx-5 -mb-5">
            <Table className="border-0 border-t border-(--color-line)">
              <THead>
                <tr>
                  <Th>Broadcast</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Recipients</Th>
                  <Th className="text-right">Open</Th>
                  <Th>Sent</Th>
                </tr>
              </THead>
              <tbody>
                {recentAnnouncements.length === 0 ? (
                  <Tr>
                    <Td colSpan={5} className="py-10 text-center text-(--color-ink-mute)">
                      No broadcasts yet. Create your first announcement to populate this table.
                    </Td>
                  </Tr>
                ) : recentAnnouncements.map((item) => {
                  const openRate = item.totalDelivered > 0 ? (item.totalOpened / item.totalDelivered) * 100 : 0;
                  return (
                  <Tr key={item.id}>
                    <Td>
                      <Link
                        href={`/dashboard/announcements/${item.id}`}
                        className="block"
                      >
                        <div
                          className="text-(--color-ink) hover:text-(--color-red)"
                          style={{ fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "-0.01em" }}
                        >
                          {item.title}
                        </div>
                        <div className="mt-0.5 font-mono text-[10.5px] tracking-[0.1em] uppercase text-(--color-ink-mute)">
                          {item.triggeredBy}
                        </div>
                      </Link>
                    </Td>
                    <Td>
                      <Badge tone={item.status === "sent" ? "red" : "amber"}>
                        {item.status}
                      </Badge>
                    </Td>
                    <Td className="text-right font-mono text-(--color-ink-2)">
                      {formatNumber(item.totalRecipients)}
                    </Td>
                    <Td className="text-right font-mono">
                      {openRate > 0 ? (
                        <span className="text-(--color-red-bright)">{openRate.toFixed(1)}%</span>
                      ) : (
                        <span className="text-(--color-ink-mute)">Pending</span>
                      )}
                    </Td>
                    <Td className="font-mono text-[12.5px] text-(--color-ink-mute)">
                      {formatDate(item.sentAt)}
                    </Td>
                  </Tr>
                )})}
              </tbody>
            </Table>
          </div>
        </Card>

        {/* Live activity + agent status */}
        <div className="space-y-6">
          {/* Live broadcast */}
          <div className="relative border border-(--color-red)/30 bg-(--color-bg-2) p-5">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(255,36,36,0.08),transparent_60%)]" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-(--color-ink-mute)">
                  Live broadcast
                </div>
                <span className="inline-flex items-center gap-2 font-mono text-[10.5px] tracking-[0.16em] uppercase text-(--color-red)">
                  <span className="live-dot" />
                  {live.active ? "Broadcasting" : "Idle"}
                </span>
              </div>
              <div
                className="mt-4 text-(--color-ink)"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "32px", lineHeight: 1, letterSpacing: "-0.04em" }}
              >
                {formatNumber(liveProcessed)}<span className="text-(--color-ink-mute)"> / {formatNumber(liveTotal)}</span>
              </div>
              <div className="mt-3 h-[3px] w-full bg-(--color-line)">
                <div className="h-full bg-(--color-red) shadow-[0_0_12px_rgba(255,36,36,0.45)]" style={{ width: `${liveProgress}%` }} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 border-t border-(--color-line) pt-4">
                <div>
                  <div className="font-mono text-[9.5px] tracking-[0.18em] uppercase text-(--color-ink-mute)">iMessage</div>
                  <div
                    className="mt-1 text-(--color-ink)"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "16px" }}
                  >
                    {formatNumber(live.byChannel.imessage ?? 0)}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[9.5px] tracking-[0.18em] uppercase text-(--color-ink-mute)">SMS</div>
                  <div
                    className="mt-1 text-(--color-ink)"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "16px" }}
                  >
                    {formatNumber(live.byChannel.sms ?? 0)}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[9.5px] tracking-[0.18em] uppercase text-(--color-ink-mute)">Email</div>
                  <div
                    className="mt-1 text-(--color-ink)"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "16px" }}
                  >
                    {formatNumber(live.byChannel.email ?? 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Agent status */}
          <Card>
            <CardHeader>
              <CardTitle>Agent status</CardTitle>
              <Radio className="h-4 w-4 text-(--color-ink-mute)" />
            </CardHeader>
            <div className="space-y-px bg-(--color-line)">
              {agents.length === 0 ? (
                <div className="bg-(--color-bg-2) px-4 py-8 text-center text-sm text-(--color-ink-mute)">
                  No agents yet.
                </div>
              ) : agents.map((agent) => (
                <Link
                  key={agent.id}
                  href={`/dashboard/agents/${agent.id}`}
                  className="flex items-center justify-between bg-(--color-bg-2) px-4 py-3 transition hover:bg-(--color-bg-3)"
                >
                  <div className="min-w-0">
                    <div
                      className="truncate text-(--color-ink)"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "14px" }}
                    >
                      {agent.name}
                    </div>
                    <div className="mt-0.5 font-mono text-[10.5px] tracking-[0.1em] uppercase text-(--color-ink-mute)">
                      {agent.triggerType ?? "manual"} · {agent.totalRuns} runs
                    </div>
                  </div>
                  <Badge tone={agent.status === "active" ? "red" : "default"}>
                    {agent.status}
                  </Badge>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

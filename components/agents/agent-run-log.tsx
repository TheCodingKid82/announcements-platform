import { Table, Td, Th, THead } from "@/components/ui/table";
import { formatDate } from "@/lib/utils/format";
import type { AgentRunRecord } from "@/lib/data/types";

export function AgentRunLog({ rows }: { rows: AgentRunRecord[] }) {
  return (
    <Table>
      <THead>
        <tr><Th>Time</Th><Th>Status</Th><Th>Input</Th><Th>Output</Th><Th>Duration</Th><Th>Tokens</Th></tr>
      </THead>
      <tbody>
        {rows.length === 0 ? (
          <tr><Td colSpan={6} className="py-8 text-center text-zinc-500">No runs yet.</Td></tr>
        ) : rows.map((row) => (
          <tr key={row.id}><Td>{formatDate(row.createdAt)}</Td><Td>{row.status}</Td><Td>{JSON.stringify(row.input).slice(0, 80)}</Td><Td>{row.output ?? "No output"}</Td><Td>{row.durationMs ? `${row.durationMs}ms` : "Pending"}</Td><Td>{row.tokensUsed ?? "None"}</Td></tr>
        ))}
      </tbody>
    </Table>
  );
}

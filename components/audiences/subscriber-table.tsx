import { Table, Td, Th, THead } from "@/components/ui/table";
import type { SubscriberRecord } from "@/lib/data/types";

export function SubscriberTable({ subscribers }: { subscribers: (SubscriberRecord & { listNames?: string })[] }) {
  return (
    <Table>
      <THead><tr><Th>Name</Th><Th>Phone</Th><Th>Email</Th><Th>Preferences</Th><Th>List</Th></tr></THead>
      <tbody>
        {subscribers.length === 0 ? (
          <tr><Td colSpan={5} className="py-8 text-center text-zinc-500">No subscribers yet.</Td></tr>
        ) : subscribers.map((subscriber) => {
          const preferences = Object.entries(subscriber.channelPreferences ?? {})
            .filter(([, enabled]) => enabled)
            .map(([channel]) => channel === "sms" ? "SMS" : channel === "email" ? "Email" : "iMessage")
            .join(", ");
          return <tr key={subscriber.id}><Td>{subscriber.name ?? "Unnamed"}</Td><Td>{subscriber.phoneE164 ?? "None"}</Td><Td>{subscriber.email ?? "None"}</Td><Td>{preferences || "None"}</Td><Td>{subscriber.listNames || "None"}</Td></tr>;
        })}
      </tbody>
    </Table>
  );
}

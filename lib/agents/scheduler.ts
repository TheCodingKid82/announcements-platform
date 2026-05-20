import { listAgents } from "@/lib/data/platform";

export async function findDueAgents() {
  const agents = await listAgents();
  return agents.filter((agent) => agent.status === "active" && agent.triggerType === "schedule");
}

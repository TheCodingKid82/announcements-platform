import { createId } from "@/lib/utils/id";

export async function pollApiSource(url: string) {
  const response = await fetch(url);
  const payload = await response.json();
  return { id: createId("evt"), payload };
}

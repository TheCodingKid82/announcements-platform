import { Composer } from "@/components/compose/composer";
import { listLists } from "@/lib/data/platform";

export default async function ComposePage() {
  const lists = await listLists();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Compose</h1>
        <p className="mt-2 text-zinc-500">Create the right version for each channel.</p>
      </div>
      <Composer lists={lists} />
    </div>
  );
}

import { ApiKeysClient } from "@/components/settings/api-keys-client";
import { listApiKeys } from "@/lib/data/platform";

export default async function ApiKeysPage() {
  const keys = await listApiKeys();
  return (
    <div className="space-y-6">
      <ApiKeysClient keys={keys} />
    </div>
  );
}

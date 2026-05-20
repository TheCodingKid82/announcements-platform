import { getActiveOrg } from "@/lib/data/platform";
import { OrgSettingsForm } from "@/components/settings/org-settings-form";

export default async function SettingsPage() {
  const org = await getActiveOrg();
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-semibold tracking-tight text-white">Settings</h1><p className="mt-2 text-zinc-500">Organization profile, members, and account controls.</p></div>
      <OrgSettingsForm name={org.name} slug={org.slug} />
    </div>
  );
}

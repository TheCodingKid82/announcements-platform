import { Card } from "@/components/ui/card";
import { getActiveOrg } from "@/lib/data/platform";
import { ToastActionButton } from "@/components/settings/action-card";

export default async function BillingPage() {
  const org = await getActiveOrg();
  const percent = org.smsCreditsIncluded > 0 ? Math.min(100, Math.round((org.smsCreditsUsed / org.smsCreditsIncluded) * 100)) : 0;
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-semibold tracking-tight text-white">Billing</h1><p className="mt-2 text-zinc-500">Plan, usage, and billing history.</p></div>
      <Card><h2 className="text-xl font-semibold text-white">{org.plan}</h2><p className="mt-2 text-zinc-500">{org.smsCreditsUsed.toLocaleString()} of {org.smsCreditsIncluded.toLocaleString()} SMS credits used.</p><div className="mt-4 h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-blue-500" style={{ width: `${percent}%` }} /></div><div className="mt-5"><ToastActionButton message="Plan changes are ready for billing checkout">Change plan</ToastActionButton></div></Card>
    </div>
  );
}

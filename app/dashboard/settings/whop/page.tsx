import { Card } from "@/components/ui/card";
import { ToastActionButton } from "@/components/settings/action-card";

export default function WhopSettingsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-semibold tracking-tight text-white">Whop Integration</h1><p className="mt-2 text-zinc-500">Sync subscribers from Whop experiences into platform lists.</p></div>
      <Card><h2 className="font-semibold text-white">Connect Whop</h2><p className="mt-2 text-sm text-zinc-500">Choose experiences, map them to lists, and turn on automatic sync.</p><div className="mt-5"><ToastActionButton message="Whop connection flow started">Connect Whop account</ToastActionButton></div></Card>
    </div>
  );
}

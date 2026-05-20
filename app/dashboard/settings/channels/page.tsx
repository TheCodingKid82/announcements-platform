import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ToastActionButton } from "@/components/settings/action-card";

export default function ChannelsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-semibold tracking-tight text-white">Channels</h1><p className="mt-2 text-zinc-500">Configure SMS and email providers.</p></div>
      <div className="grid gap-6 lg:grid-cols-2"><Card className="space-y-3"><h2 className="font-semibold text-white">Twilio</h2><Input placeholder="Account SID" /><Input placeholder="Auth token" /><Input placeholder="From number" /><ToastActionButton message="SMS settings checked">Test SMS</ToastActionButton></Card><Card className="space-y-3"><h2 className="font-semibold text-white">Resend</h2><Input placeholder="API key" /><Input placeholder="From address" /><ToastActionButton message="Email settings checked">Test email</ToastActionButton></Card></div>
    </div>
  );
}

export function ChannelBreakdown({ channels }: { channels: { label: string; value: number }[] }) {
  if (channels.length === 0) return <div className="py-10 text-center text-sm text-zinc-500">No channel data yet.</div>;
  return (
    <div className="space-y-4">
      {channels.map((channel) => (
        <div key={channel.label}>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-zinc-400">{channel.label}</span>
            <span className="text-white">{channel.value}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/8">
            <div className="h-2 rounded-full bg-blue-500" style={{ width: `${channel.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

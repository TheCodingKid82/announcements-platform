export function DeliveryChart({ series }: { series: { label: string; sent: number; opened: number }[] }) {
  if (series.length === 0) return <div className="py-10 text-center text-sm text-zinc-500">No delivery data yet.</div>;
  const max = Math.max(...series.map((item) => item.sent));
  return (
    <div className="space-y-4">
      {series.map((item) => (
        <div key={item.label}>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-zinc-400">{item.label}</span>
            <span className="text-white">{item.sent}</span>
          </div>
          <div className="h-2 rounded-full bg-white/8">
            <div className="h-2 rounded-full bg-blue-500" style={{ width: `${max > 0 ? (item.sent / max) * 100 : 0}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

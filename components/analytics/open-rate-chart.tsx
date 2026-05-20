export function OpenRateChart({ series }: { series: { label: string; sent: number; opened: number }[] }) {
  if (series.length === 0) return <div className="py-10 text-center text-sm text-zinc-500">No open data yet.</div>;
  return (
    <div className="grid grid-cols-5 items-end gap-3 pt-8">
      {series.map((item) => {
        const rate = item.sent > 0 ? item.opened / item.sent : 0;
        return (
          <div key={item.label} className="text-center">
            <div className="mx-auto w-full rounded-t bg-blue-400/80" style={{ height: `${rate * 180}px` }} />
            <div className="mt-2 text-xs text-zinc-500">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}

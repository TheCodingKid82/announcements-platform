export function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded bg-zinc-900 px-2 py-1 text-xs text-white shadow-xl group-hover:block">
        {label}
      </span>
    </span>
  );
}

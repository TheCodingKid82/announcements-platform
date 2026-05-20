export function CodeBlock({ title, code, tag }: { title: string; code: string; tag?: string }) {
  return (
    <div className="overflow-hidden border border-(--color-line-2) bg-(--color-bg-2)">
      <div className="flex items-center gap-3 border-b border-(--color-line-2) px-4 py-3 font-mono text-[11px] tracking-[0.14em] uppercase text-(--color-ink-mute)">
        <span className="text-(--color-ink)">{title}</span>
        {tag ? (
          <span className="ml-auto bg-(--color-red) px-2 py-[2px] text-[10px] tracking-[0.16em] text-white">
            {tag}
          </span>
        ) : null}
      </div>
      <pre className="scrollarea overflow-x-auto px-5 py-5 font-mono text-[13px] leading-[1.75] text-(--color-ink-2)">
        <code>{code}</code>
      </pre>
    </div>
  );
}

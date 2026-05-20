import { cn } from "@/lib/utils/cn";
import type { TableHTMLAttributes, HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from "react";

export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={cn(
        "w-full border-collapse text-left text-[13.5px] border border-(--color-line)",
        className
      )}
      {...props}
    />
  );
}

export function THead(props: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className="bg-(--color-bg-3) font-mono text-[10.5px] tracking-[0.16em] uppercase text-(--color-ink-mute)"
      {...props}
    />
  );
}

export function Th({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "border-b border-(--color-line) px-4 py-3 font-medium text-left",
        className
      )}
      {...props}
    />
  );
}

export function Td({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        "border-b border-(--color-line) px-4 py-3 text-(--color-ink-2) align-middle",
        className
      )}
      {...props}
    />
  );
}

export function Tr({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "transition hover:bg-(--color-red-soft)/40",
        className
      )}
      {...props}
    />
  );
}

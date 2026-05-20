import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          "h-10 w-full border border-(--color-line) bg-(--color-bg-2) px-3 text-[13.5px] text-(--color-ink) outline-none transition focus:border-(--color-red) focus:bg-(--color-bg-3)",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);

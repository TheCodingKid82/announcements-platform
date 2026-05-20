import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full border border-(--color-line) bg-(--color-bg-2) px-3 text-[13.5px] text-(--color-ink) outline-none transition placeholder:text-(--color-ink-mute) focus:border-(--color-red) focus:bg-(--color-bg-3)",
          className
        )}
        {...props}
      />
    );
  }
);

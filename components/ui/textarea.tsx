import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-32 w-full border border-(--color-line) bg-(--color-bg-2) px-3 py-3 text-[13.5px] text-(--color-ink) outline-none transition placeholder:text-(--color-ink-mute) focus:border-(--color-red) focus:bg-(--color-bg-3)",
          className
        )}
        {...props}
      />
    );
  }
);

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-(--color-red) text-white hover:bg-(--color-red-bright) shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_28px_-10px_rgba(255,36,36,0.5)]",
  secondary:
    "bg-(--color-bg-2) text-(--color-ink) border border-(--color-line-2) hover:border-(--color-line-3) hover:bg-(--color-bg-3)",
  ghost: "text-(--color-ink-dim) hover:text-(--color-ink) hover:bg-white/[0.04]",
  danger:
    "bg-(--color-red-deep) text-white hover:bg-(--color-red) border border-(--color-red)/40",
  outline:
    "border border-(--color-red)/40 text-(--color-red) hover:bg-(--color-red-soft)"
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[12.5px]",
  md: "h-10 px-4 text-[13.5px]",
  lg: "h-12 px-6 text-[14.5px]"
};

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition disabled:cursor-not-allowed disabled:opacity-50 rounded-none whitespace-nowrap";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        base,
        variants[variant],
        sizes[size],
        className
      )}
      style={{ fontFamily: "var(--font-display)" }}
      {...props}
    />
  );
}

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

export function LinkButton({ href, className, variant = "primary", size = "md", children, ...props }: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      style={{ fontFamily: "var(--font-display)" }}
      {...props}
    >
      {children}
    </Link>
  );
}

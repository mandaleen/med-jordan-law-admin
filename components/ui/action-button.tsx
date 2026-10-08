import React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";

export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: React.ReactNode;
}

/** Page-level pill action (header buttons). */
export function ActionButton({
  variant = "secondary",
  icon,
  className,
  children,
  type = "button",
  ...props
}: ActionButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center gap-2 h-10 rounded-full text-[13px] font-semibold whitespace-nowrap cursor-pointer transition-all active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600/50 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none",
        variant === "primary"
          ? "ps-4 pe-5 bg-navy-900 text-white shadow-[0_10px_22px_-10px_rgba(26,39,68,0.7)] hover:bg-navy-800 hover:-translate-y-px"
          : "px-5 bg-white text-navy-900 border border-navy-900/25 hover:bg-navy-50",
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

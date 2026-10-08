import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatTone = "navy" | "success" | "warning" | "error" | "info";

const TONE: Record<StatTone, { chip: string; value: string }> = {
  navy: { chip: "bg-navy-50 text-navy-700", value: "text-navy-950" },
  success: { chip: "bg-success/10 text-success", value: "text-navy-950" },
  warning: { chip: "bg-gold-100 text-gold-700", value: "text-navy-950" },
  error: { chip: "bg-error/10 text-error", value: "text-navy-950" },
  info: { chip: "bg-info/10 text-info", value: "text-navy-950" },
};

export interface StatTileProps {
  title: string;
  value: React.ReactNode;
  /** Small unit/label next to the value, e.g. "Registered" */
  unit?: string;
  /** Footer text */
  caption?: React.ReactNode;
  /** Tinted pill shown before the caption */
  chip?: React.ReactNode;
  chipTone?: StatTone;
  icon: LucideIcon;
  /** Dark hero treatment (use for at most one tile per row) */
  dark?: boolean;
  onClick?: () => void;
  selected?: boolean;
  /** Entrance stagger in ms */
  delay?: number;
  className?: string;
}

/** Dashboard-style metric tile. Renders a button when `onClick` is given. */
export function StatTile({
  title,
  value,
  unit,
  caption,
  chip,
  chipTone = "navy",
  icon: Icon,
  dark = false,
  onClick,
  selected,
  delay = 0,
  className,
}: StatTileProps) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      {...(onClick ? { type: "button" as const, onClick, "aria-pressed": !!selected } : {})}
      style={{ "--rise-delay": `${delay}ms` } as React.CSSProperties}
      className={cn(
        "rise-in group relative text-start flex flex-col justify-between min-h-[148px] p-5 min-w-0",
        dark ? "surface-dark" : "surface-card",
        onClick &&
          "cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600/50 focus-visible:ring-offset-2",
        onClick && !dark && "hover:shadow-[0_14px_30px_-14px_rgba(26,39,68,0.2)]",
        selected && (dark ? "ring-2 ring-navy-300 ring-offset-2" : "ring-2 ring-navy-900 ring-offset-2"),
        className
      )}
    >
      {dark && (
        <svg
          aria-hidden="true"
          className="absolute -end-8 -bottom-10 w-48 h-48 text-white/[0.06] pointer-events-none"
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="100" cy="100" r="28" />
          <circle cx="100" cy="100" r="54" />
          <circle cx="100" cy="100" r="80" />
          <circle cx="100" cy="100" r="106" />
        </svg>
      )}

      <div className="relative flex items-start justify-between gap-3">
        <span className={cn("text-[14px] font-medium tracking-tight", dark ? "text-white/90" : "text-navy-900")}>
          {title}
        </span>
        <span
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
            dark
              ? "bg-white text-navy-900"
              : "border border-navy-900/15 text-navy-900",
            onClick && !dark && "group-hover:bg-navy-900 group-hover:text-white group-hover:border-navy-900"
          )}
        >
          <Icon className="w-4 h-4" strokeWidth={2} />
        </span>
      </div>

      <div className="relative mt-3 flex items-baseline gap-2 min-w-0">
        <span
          className={cn(
            "text-[40px] sm:text-[44px] leading-none font-semibold tracking-[-0.04em] tabular-nums truncate",
            dark ? "text-white" : TONE[chipTone].value
          )}
        >
          {value}
        </span>
        {unit && <span className={cn("text-[13px] font-medium", dark ? "text-white/60" : "text-gray-500")}>{unit}</span>}
      </div>

      {(chip || caption) && (
        <div className="relative mt-4 flex items-center gap-2 min-w-0 text-[12px]">
          {chip && (
            <span
              className={cn(
                "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-semibold whitespace-nowrap shrink-0",
                dark ? "bg-white/15 text-gold-300" : TONE[chipTone].chip
              )}
            >
              {chip}
            </span>
          )}
          {caption && <span className={cn("truncate", dark ? "text-white/65" : "text-gray-500")}>{caption}</span>}
        </div>
      )}
    </Tag>
  );
}

/** Responsive grid for StatTile rows. */
export function StatGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0", className)}>{children}</div>
  );
}

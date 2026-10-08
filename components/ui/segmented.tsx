import React from "react";
import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
  id: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
  count?: number;
  title?: string;
}

interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (id: T) => void;
  label: string;
  className?: string;
}

/** Pill segmented control (tabs / filters / layout toggles). */
export function Segmented<T extends string>({ options, value, onChange, label, className }: SegmentedProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn("inline-flex items-center gap-1 p-1 bg-gray-100 rounded-full max-w-full overflow-x-auto no-scrollbar", className)}
    >
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            role="tab"
            title={o.title}
            aria-selected={active}
            onClick={() => onChange(o.id)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap cursor-pointer transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600/40",
              active
                ? "bg-white text-navy-900 font-semibold shadow-xs"
                : "text-gray-500 hover:text-navy-900 font-medium"
            )}
          >
            {o.icon}
            {o.label}
            {typeof o.count === "number" && (
              <span
                className={cn(
                  "text-[10.5px] px-1.5 rounded-full font-semibold tabular-nums",
                  active ? "bg-navy-900 text-white" : "bg-gray-200 text-gray-600"
                )}
              >
                {o.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

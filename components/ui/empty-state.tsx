import React from "react";
import { LucideIcon, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 max-w-md mx-auto my-auto animate-in fade-in duration-200 select-none",
        className
      )}
    >
      <div className="w-14 h-14 rounded-full pattern-hatch text-navy-800 border border-navy-200 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-navy-700" />
      </div>

      <h3 className="text-[15px] font-semibold text-navy-950 tracking-tight mb-1">{title}</h3>
      <p className="text-[13px] text-gray-500 leading-relaxed mb-5 max-w-xs">{description}</p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-full text-xs font-semibold press transition-all cursor-pointer"
          >
            {actionLabel}
          </button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="px-4 py-2 bg-white hover:bg-navy-50 text-navy-900 border border-navy-900/20 rounded-full text-xs font-semibold press transition-all cursor-pointer"
          >
            {secondaryActionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

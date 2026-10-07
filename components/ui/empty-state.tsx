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
      <div className="w-12 h-12 rounded-2xl bg-navy-50 text-navy-800 border border-navy-200/60 flex items-center justify-center shadow-2xs mb-3.5">
        <Icon className="w-6 h-6 text-navy-700" />
      </div>

      <h3 className="text-sm font-bold text-navy-950 tracking-tight mb-1">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed mb-4 max-w-xs">{description}</p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="px-3.5 py-1.5 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            {actionLabel}
          </button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-navy-900 border border-gray-300 rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            {secondaryActionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

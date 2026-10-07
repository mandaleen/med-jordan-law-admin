import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "card" | "text" | "avatar";
}

export function Skeleton({ className, variant = "default", ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-gray-200/80 rounded-lg",
        variant === "avatar" && "rounded-full",
        variant === "card" && "rounded-2xl border border-gray-200/60 shadow-2xs",
        variant === "text" && "h-3.5 rounded-md",
        className
      )}
      {...props}
    />
  );
}

/** Pre-composed Skeleton for Dashboard Stat Cards */
export function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="apple-glass-card p-4 rounded-[18px] flex flex-col justify-between h-[125px] animate-pulse bg-white/70"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-7 w-7 rounded-xl" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-2.5 w-28 mt-1" />
        </div>
      ))}
    </div>
  );
}

/** Pre-composed Skeleton for Data Tables */
export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="apple-table-card flex-1 flex flex-col animate-pulse bg-white">
      {/* Table Header Skeleton */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-24 rounded-lg" />
          <Skeleton className="h-7 w-20 rounded-lg" />
        </div>
      </div>
      {/* Rows */}
      <div className="divide-y divide-gray-100 p-2">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="py-3 px-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1 max-w-xs">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2.5 w-1/2" />
              </div>
            </div>
            {Array.from({ length: cols - 1 }).map((_, c) => (
              <Skeleton key={c} className="h-3.5 w-20 hidden sm:block" />
            ))}
            <Skeleton className="h-6 w-16 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

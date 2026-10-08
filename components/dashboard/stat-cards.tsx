"use client";

import React from "react";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { StatItem } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface StatCardsProps {
  stats: StatItem[];
  activeCardId?: string;
  onCardClick?: (id: string) => void;
}

export function StatCards({ stats, activeCardId, onCardClick }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const isDark = !!stat.isAccentDark;
        const isSelected = activeCardId === stat.id;
        const accent = stat.accentColor || "#3D5390";

        return (
          <button
            key={stat.id}
            type="button"
            onClick={() => onCardClick?.(stat.id)}
            aria-pressed={isSelected}
            style={{ "--rise-delay": `${i * 60}ms` } as React.CSSProperties}
            className={cn(
              "rise-in group relative text-start flex flex-col justify-between min-h-[172px] p-5 cursor-pointer",
              "transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600/50 focus-visible:ring-offset-2",
              isDark ? "surface-dark" : "surface-card hover:shadow-[0_14px_30px_-14px_rgba(26,39,68,0.2)]",
              isSelected && (isDark ? "ring-2 ring-navy-300 ring-offset-2" : "ring-2 ring-navy-900 ring-offset-2")
            )}
          >
            {isDark && (
              <svg
                aria-hidden="true"
                className="absolute -end-8 -bottom-10 w-52 h-52 text-white/[0.06] pointer-events-none"
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
              <span
                className={cn(
                  "text-[15px] font-medium tracking-tight",
                  isDark ? "text-white/90" : "text-navy-900"
                )}
              >
                {stat.title}
              </span>
              <span
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                  isDark
                    ? "bg-white text-navy-900 group-hover:rotate-12"
                    : "border border-navy-900/15 text-navy-900 group-hover:bg-navy-900 group-hover:text-white group-hover:border-navy-900 group-hover:rotate-12"
                )}
              >
                <ArrowUpRight className="w-4 h-4 rtl:-scale-x-100" strokeWidth={2} />
              </span>
            </div>

            <div className="relative mt-3">
              <div
                className={cn(
                  "text-[52px] leading-none font-semibold tracking-[-0.04em] tabular-nums",
                  isDark ? "text-white" : "text-navy-950"
                )}
              >
                {stat.value}
              </div>
            </div>

            <div className="relative mt-4 flex items-center gap-2 min-w-0 text-[12px]">
              {stat.trendValue && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 ps-1 pe-1.5 py-0.5 rounded-md font-semibold whitespace-nowrap shrink-0",
                    isDark ? "bg-white/15 text-gold-300" : ""
                  )}
                  style={isDark ? undefined : { backgroundColor: `${accent}18`, color: accent }}
                >
                  <TrendingUp className="w-3 h-3" strokeWidth={2.4} />
                  {stat.trendValue}
                </span>
              )}
              <span className={cn("truncate", isDark ? "text-white/65" : "text-gray-500")}>
                {stat.subMetric || stat.trendText}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

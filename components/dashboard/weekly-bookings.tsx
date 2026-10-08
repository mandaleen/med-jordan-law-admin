"use client";

import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import { WEEKLY_CHART_DATA, DayBarData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface WeeklyBookingsProps {
  initialData?: DayBarData[];
}

export function WeeklyBookings({ initialData = WEEKLY_CHART_DATA }: WeeklyBookingsProps) {
  const [data] = useState<DayBarData[]>(initialData);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(3); // Wednesday
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");

  const totalBookings = data.reduce((acc, curr) => acc + curr.bookings, 0);
  const peak = Math.max(...data.map((d) => d.bookings));

  return (
    <section
      className="surface-card rise-in p-6 flex flex-col h-full min-h-[340px]"
      style={{ "--rise-delay": "240ms" } as React.CSSProperties}
      aria-label="Booking volume"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-[17px] font-semibold tracking-tight text-navy-950">Booking Volume</h3>
          <div className="mt-2 flex items-center gap-2.5">
            <span className="text-[34px] leading-none font-semibold tracking-[-0.03em] tabular-nums text-navy-950">
              {totalBookings}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success bg-success/10 px-1.5 py-0.5 rounded-md">
              <TrendingUp className="w-3 h-3" strokeWidth={2.4} />
              14.2%
            </span>
            <span className="text-xs text-gray-500">Avg 5.4 / day</span>
          </div>
        </div>

        <div className="inline-flex p-1 bg-gray-100 rounded-full" role="tablist" aria-label="Range">
          {(["week", "month"] as const).map((range) => (
            <button
              key={range}
              type="button"
              role="tab"
              aria-selected={timeRange === range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-3.5 py-1 text-xs rounded-full transition-all cursor-pointer capitalize",
                timeRange === range
                  ? "bg-white text-navy-900 font-semibold shadow-xs"
                  : "text-gray-500 hover:text-navy-900 font-medium"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Capsule bars */}
      <div className="flex-1 grid grid-cols-7 gap-2 sm:gap-4 items-end mt-6 pt-8 min-h-[200px]">
        {data.map((item, index) => {
          const isActive = activeDayIndex === index;
          const isPeak = item.bookings === peak;
          return (
            <button
              key={item.day + index}
              type="button"
              onClick={() => setActiveDayIndex(index)}
              onMouseEnter={() => setActiveDayIndex(index)}
              onFocus={() => setActiveDayIndex(index)}
              aria-label={`${item.fullDay}: ${item.bookings} bookings`}
              aria-pressed={isActive}
              className="group relative flex flex-col items-center justify-end h-full cursor-pointer focus-visible:outline-none"
            >
              <div className="relative w-full flex-1 flex items-end justify-center">
                {isActive && (
                  <span className="absolute z-10 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 -translate-y-2 px-2 py-0.5 rounded-full bg-white border border-navy-900/10 shadow-sm text-[11px] font-semibold text-navy-900 tabular-nums whitespace-nowrap"
                    style={{ bottom: `${item.heightPercent}%` }}
                  >
                    {item.bookings}
                    <span className="text-gray-400 font-medium"> · {item.fullDay.slice(0, 3)}</span>
                  </span>
                )}
                <div
                  className={cn(
                    "w-full max-w-[56px] rounded-full transition-all duration-500 ease-out group-focus-visible:ring-2 group-focus-visible:ring-navy-600/50",
                    isActive
                      ? "bg-gradient-to-b from-navy-700 to-navy-950 shadow-[0_10px_22px_-8px_rgba(26,39,68,0.6)]"
                      : isPeak
                      ? "bg-gold-500"
                      : "pattern-hatch group-hover:opacity-80"
                  )}
                  style={{ height: `${item.heightPercent}%` }}
                />
              </div>
              <span
                className={cn(
                  "mt-3 text-xs transition-colors",
                  isActive ? "text-navy-950 font-semibold" : "text-gray-500 font-medium"
                )}
              >
                {item.day}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

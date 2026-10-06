"use client";

import React, { useState } from "react";
import { WEEKLY_CHART_DATA, DayBarData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface WeeklyBookingsProps {
  initialData?: DayBarData[];
}

export function WeeklyBookings({ initialData = WEEKLY_CHART_DATA }: WeeklyBookingsProps) {
  const [data, setData] = useState<DayBarData[]>(initialData);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(3); // Wednesday active by default

  const handleBarClick = (index: number) => {
    setActiveDayIndex(index);
  };

  return (
    <div className="rounded-[22px] bg-white border border-[#EBEFF3] p-5 shadow-2xs flex flex-col justify-between h-full min-h-[300px]">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-slate-900">
          Weekly bookings
        </h3>
        <span className="text-xs text-slate-400 font-medium">This Week</span>
      </div>

      {/* Bar Chart Container */}
      <div className="relative flex-1 flex flex-col justify-end pt-8 pb-1">
        {/* SVG Patterns Definition */}
        <svg className="w-0 h-0 absolute pointer-events-none" aria-hidden="true">
          <defs>
            <pattern
              id="diagonalHatch"
              width="6"
              height="6"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="6"
                stroke="#CBD5E1"
                strokeWidth="2.5"
              />
            </pattern>
            <pattern
              id="diagonalHatchHover"
              width="6"
              height="6"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="6"
                stroke="#94A3B8"
                strokeWidth="2.5"
              />
            </pattern>
          </defs>
        </svg>

        {/* 7 Bars Grid */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end h-[180px] px-1">
          {data.map((item, index) => {
            const isActive = activeDayIndex === index;
            // Height calculation
            const barHeight = `${item.heightPercent}%`;

            return (
              <div
                key={item.day + index}
                onClick={() => handleBarClick(index)}
                className="flex flex-col items-center h-full justify-end cursor-pointer group"
              >
                {/* Floating percentage badge above active bar */}
                {isActive && (
                  <div className="mb-2 animate-in fade-in zoom-in-95 duration-200">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[#0A2342] text-[11px] font-bold shadow-xs">
                      {item.activeLabel || `${item.heightPercent}%`}
                    </span>
                  </div>
                )}

                {/* The Pill Bar */}
                <div
                  className="w-full max-w-[34px] transition-all duration-300 rounded-full overflow-hidden relative"
                  style={{ height: barHeight }}
                >
                  {isActive ? (
                    /* Active Solid Navy Bar */
                    <div className="w-full h-full bg-[#0A2342] rounded-full shadow-xs group-hover:bg-[#133863] transition-colors" />
                  ) : (
                    /* Hatched Inactive Bar matching reference */
                    <svg
                      className="w-full h-full rounded-full transition-opacity group-hover:opacity-90"
                      preserveAspectRatio="none"
                      viewBox="0 0 34 100"
                    >
                      <rect
                        width="34"
                        height="100"
                        rx="17"
                        ry="17"
                        fill="#F8FAFC"
                      />
                      <rect
                        width="34"
                        height="100"
                        rx="17"
                        ry="17"
                        fill="url(#diagonalHatch)"
                        className="transition-all"
                      />
                    </svg>
                  )}
                </div>

                {/* Day Label below bar */}
                <div className="mt-3">
                  <span
                    className={cn(
                      "text-xs font-semibold transition-colors",
                      isActive
                        ? "text-[#0A2342] font-bold"
                        : "text-slate-400 group-hover:text-slate-600"
                    )}
                  >
                    {item.day}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

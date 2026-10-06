"use client";

import React, { useState } from "react";
import { WEEKLY_CHART_DATA, DayBarData } from "@/lib/mock-data";
import { TrendingUp } from "lucide-react";

interface WeeklyBookingsProps {
  initialData?: DayBarData[];
}

export function WeeklyBookings({ initialData = WEEKLY_CHART_DATA }: WeeklyBookingsProps) {
  const [data] = useState<DayBarData[]>(initialData);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(3); // Wednesday active
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");

  const activeItem = data[activeDayIndex] || data[3];

  const handleBarClick = (index: number) => {
    setActiveDayIndex(index);
  };

  const totalBookings = data.reduce((acc, curr) => acc + curr.bookings, 0);

  return (
    <div className="rounded-xl apple-glass-card p-6 flex flex-col justify-between h-full min-h-[330px]">
      {/* Header: Title, Total & Segmented Range Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-[#0A2342] tracking-tight">
              Weekly Bookings
            </h3>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#34C759] bg-[#34C759]/10 px-2 py-0.5 rounded-md border border-[#34C759]/20 whitespace-nowrap shrink-0">
              <TrendingUp className="w-3 h-3 shrink-0" /> +14.2%
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#0A2342] font-mono apple-mono">
              {totalBookings}
            </span>
            <span className="text-xs text-slate-500 whitespace-nowrap">
              Consultations logged • Avg 5.4 / day
            </span>
          </div>
        </div>

        {/* Minimal Segmented Switcher */}
        <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setTimeRange("week")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              timeRange === "week"
                ? "bg-white text-[#0A2342] shadow-xs font-semibold"
                : "text-slate-500 hover:text-[#0A2342]"
            }`}
          >
            This Week
          </button>
          <button
            type="button"
            onClick={() => setTimeRange("month")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              timeRange === "month"
                ? "bg-white text-[#0A2342] shadow-xs font-semibold"
                : "text-slate-500 hover:text-[#0A2342]"
            }`}
          >
            Past 30 Days
          </button>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="relative flex-1 flex flex-col justify-end pt-6 pb-2">
        {/* Floating Tooltip for Active Day */}
        <div className="flex justify-center mb-3">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-md bg-white border border-slate-200 shadow-xs text-xs font-medium whitespace-nowrap shrink-0">
            <span className="w-2 h-2 rounded-sm bg-[#0A2342] shrink-0" />
            <span className="font-semibold text-[#0A2342] whitespace-nowrap">
              {activeItem.fullDay}:
            </span>
            <span className="font-mono font-bold text-[#1D4ED8] whitespace-nowrap">
              {activeItem.bookings} Bookings
            </span>
            <span className="text-[10px] text-slate-400 whitespace-nowrap">
              ({activeItem.heightPercent}%)
            </span>
          </div>
        </div>

        {/* 7 Day Column Pillar Bars */}
        <div className="grid grid-cols-7 gap-3 sm:gap-4 items-end h-[160px] px-2">
          {data.map((item, index) => {
            const isActive = activeDayIndex === index;
            const barHeight = `${item.heightPercent}%`;

            return (
              <div
                key={item.day + index}
                onClick={() => handleBarClick(index)}
                className="flex flex-col items-center h-full justify-end cursor-pointer group"
              >
                {/* Outer Column Track */}
                <div className="w-full max-w-[28px] h-full flex items-end justify-center bg-slate-100 hover:bg-slate-200/80 rounded-t-sm p-0.5 border-b border-slate-300">
                  {/* Inner Filled Pillar */}
                  <div
                    className={`w-full rounded-t-sm transition-all ${
                      isActive
                        ? "bg-[#0A2342] shadow-xs"
                        : "bg-slate-300 group-hover:bg-slate-400"
                    }`}
                    style={{ height: barHeight }}
                  />
                </div>

                {/* Day Label with Active Indicator */}
                <span
                  className={`text-xs font-semibold mt-2.5 transition-colors ${
                    isActive ? "text-[#0A2342] font-bold" : "text-slate-400 group-hover:text-slate-700"
                  }`}
                >
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatItem {
  id: string;
  title: string;
  value: string;
  trendText: string;
  trendValue?: string;
  isAccentDark?: boolean;
}

interface StatCardsProps {
  stats?: StatItem[];
  onCardClick?: (id: string) => void;
}

const DEFAULT_STATS: StatItem[] = [
  {
    id: "total-bookings",
    title: "Total bookings",
    value: "24",
    trendText: "Increased from last month",
    trendValue: "5",
    isAccentDark: true,
  },
  {
    id: "completed-consultations",
    title: "Ended Consultations",
    value: "10",
    trendText: "Increased from last month",
    trendValue: "6",
    isAccentDark: false,
  },
  {
    id: "active-cases",
    title: "Active cases",
    value: "12",
    trendText: "Increased from last month",
    trendValue: "2",
    isAccentDark: false,
  },
  {
    id: "pending-approval",
    title: "Pending approval",
    value: "2",
    trendText: "Needs review",
    isAccentDark: false,
  },
];

export function StatCards({ stats = DEFAULT_STATS, onCardClick }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => {
        if (stat.isAccentDark) {
          return (
            <div
              key={stat.id}
              onClick={() => onCardClick?.(stat.id)}
              className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#061426] via-[#0A2342] to-[#0F2D54] p-5 text-white shadow-md hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between min-h-[160px]"
            >
              {/* Subtle background glow */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Header: Title and Circular Arrow Button */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">
                  {stat.title}
                </span>
                <div className="w-8 h-8 rounded-full bg-white text-[#0A2342] flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shadow-2xs">
                  <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                </div>
              </div>

              {/* Stat Value */}
              <div className="my-2">
                <span className="text-4xl font-extrabold text-white tracking-tight">
                  {stat.value}
                </span>
              </div>

              {/* Trend Footer */}
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                {stat.trendValue && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-white/20 bg-white/10 text-[11px] font-bold">
                    {stat.trendValue}
                  </span>
                )}
                <span>{stat.trendText}</span>
              </div>
            </div>
          );
        }

        return (
          <div
            key={stat.id}
            onClick={() => onCardClick?.(stat.id)}
            className="rounded-[22px] bg-white border border-[#EBEFF3] p-5 shadow-2xs hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between min-h-[160px]"
          >
            {/* Header: Title and Circular Arrow Button */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800">
                {stat.title}
              </span>
              <div className="w-8 h-8 rounded-full border border-slate-200 text-slate-600 flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-slate-300 group-hover:text-slate-900 bg-white">
                <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
              </div>
            </div>

            {/* Stat Value */}
            <div className="my-2">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {stat.value}
              </span>
            </div>

            {/* Trend Footer */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              {stat.trendValue ? (
                <>
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-700">
                    {stat.trendValue}
                  </span>
                  <span>{stat.trendText}</span>
                </>
              ) : (
                <span>{stat.trendText}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

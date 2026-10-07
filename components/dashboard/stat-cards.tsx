"use client";

import React from "react";
import { ArrowUpRight, Users, Briefcase, AlertCircle, Calendar } from "lucide-react";
import { StatItem } from "@/lib/mock-data";

interface StatCardsProps {
  stats: StatItem[];
  activeCardId?: string;
  onCardClick?: (id: string) => void;
}

export function StatCards({
  stats,
  activeCardId,
  onCardClick,
}: StatCardsProps) {
  const getIcon = (id: string, color: string = "#3D5390") => {
    switch (id) {
      case "bookings-today":
      case "total-bookings":
        return <Calendar className="w-3.5 h-3.5 text-white" />;
      case "total-clients":
        return <Users className="w-3.5 h-3.5" style={{ color }} />;
      case "open-cases":
      case "active-cases":
        return <Briefcase className="w-3.5 h-3.5" style={{ color }} />;
      case "pending-approval":
        return <AlertCircle className="w-3.5 h-3.5" style={{ color }} />;
      default:
        return <Briefcase className="w-3.5 h-3.5" style={{ color }} />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      {stats.map((stat) => {
        const isSelected = activeCardId === stat.id;

        // Dark obsidian accent card (e.g. Bookings Today)
        if (stat.isAccentDark) {
          return (
            <div
              key={stat.id}
              onClick={() => onCardClick?.(stat.id)}
              className={`relative overflow-hidden rounded-xl apple-obsidian-card p-5 text-white cursor-pointer group flex flex-col justify-between min-h-[160px] apple-press transition-all ${
                isSelected ? "ring-2 ring-navy-400 ring-offset-2 ring-offset-gray-50" : ""
              }`}
            >
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-navy-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between z-10">
                <span className="text-[11px] font-bold text-white/70 tracking-wider uppercase whitespace-nowrap">
                  {stat.title}
                </span>
                <div className="w-7 h-7 rounded-lg bg-white/10 group-hover:bg-white text-white group-hover:text-navy-900 flex items-center justify-center transition-all shadow-xs ring-1 ring-white/10 shrink-0">
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>

              <div className="my-2 z-10">
                <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-mono apple-mono leading-tight">
                  {stat.value}
                </div>
                {stat.subMetric && (
                  <div className="text-[11px] text-white/60 font-medium truncate mt-0.5" title={stat.subMetric}>
                    {stat.subMetric}
                  </div>
                )}
              </div>

              <div className="pt-2.5 border-t border-white/10 flex items-center gap-2 text-xs font-medium z-10 min-w-0">
                {stat.trendValue && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-navy-500/20 text-navy-200 text-[10px] font-semibold border border-navy-400/30 whitespace-nowrap shrink-0">
                    {stat.trendValue}
                  </span>
                )}
                {stat.trendText && (
                  <span className="text-[11px] text-white/70 font-medium whitespace-nowrap truncate" title={stat.trendText}>
                    {stat.trendText}
                  </span>
                )}
              </div>
            </div>
          );
        }

        // White crisp cards
        return (
          <div
            key={stat.id}
            onClick={() => onCardClick?.(stat.id)}
            className={`relative rounded-xl apple-glass-card p-5 cursor-pointer group flex flex-col justify-between min-h-[160px] apple-press transition-all ${
              isSelected ? "ring-2 ring-navy-900 ring-offset-2 ring-offset-gray-50" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 tracking-wider uppercase whitespace-nowrap">
                {stat.title}
              </span>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 shrink-0"
                style={{
                  backgroundColor: `${stat.accentColor || "#3D5390"}15`,
                }}
              >
                {getIcon(stat.id, stat.accentColor)}
              </div>
            </div>

            <div className="my-2">
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-navy-900 font-mono apple-mono leading-tight">
                {stat.value}
              </div>
              {stat.subMetric && (
                <div className="text-[11px] text-gray-500 font-medium truncate mt-0.5" title={stat.subMetric}>
                  {stat.subMetric}
                </div>
              )}
            </div>

            <div className="pt-2.5 border-t border-gray-100 flex items-center gap-2 text-xs font-medium min-w-0">
              {stat.trendValue && (
                <span
                  className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap shrink-0"
                  style={{
                    backgroundColor: `${stat.accentColor || "#3D5390"}14`,
                    color: stat.accentColor || "#3D5390",
                  }}
                >
                  {stat.trendValue}
                </span>
              )}
              {stat.trendText && (
                <span className="text-[11px] text-gray-500 font-medium whitespace-nowrap truncate" title={stat.trendText}>
                  {stat.trendText}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

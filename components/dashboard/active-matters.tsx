"use client";

import React from "react";
import { Plus, Briefcase, FileCheck, Scale, Award, FileText } from "lucide-react";
import { ACTIVE_MATTERS, MatterItem } from "@/lib/mock-data";

interface ActiveMattersProps {
  matters?: MatterItem[];
  onNewMatter?: () => void;
}

const categoryIcons: Record<string, React.ElementType> = {
  Commercial: Briefcase,
  "Real Estate": Scale,
  "Patent & IP": Award,
  Employment: FileCheck,
  Arbitration: FileText,
};

export function ActiveMatters({
  matters = ACTIVE_MATTERS,
  onNewMatter,
}: ActiveMattersProps) {
  return (
    <div className="rounded-[22px] bg-white border border-[#EBEFF3] p-5 shadow-2xs flex flex-col justify-between h-full min-h-[300px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-slate-900">
          Key cases
        </h3>
        <button
          type="button"
          onClick={onNewMatter}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New</span>
        </button>
      </div>

      {/* Case Matters List */}
      <div className="flex flex-col divide-y divide-slate-100">
        {matters.map((item) => {
          const Icon = categoryIcons[item.category] || Briefcase;
          return (
            <div
              key={item.id}
              className="flex items-center justify-between py-2.5 first:pt-1 last:pb-1 group hover:bg-slate-50/50 rounded-lg px-1 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-2xs"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0A2342] transition-colors line-clamp-1">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {item.dueDate}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

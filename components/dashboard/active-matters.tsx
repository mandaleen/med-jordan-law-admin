"use client";

import React, { useState } from "react";
import { Plus, Briefcase, Scale, Award, FileCheck, FileText, Check } from "lucide-react";
import { MatterItem } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface ActiveMattersProps {
  matters: MatterItem[];
  onToggleComplete: (id: string) => void;
  onNewMatter?: () => void;
}

const categoryIcons: Record<string, React.ElementType> = {
  Commercial: Briefcase,
  "Real Estate": Scale,
  "Patent & IP": Award,
  Employment: FileCheck,
  Arbitration: FileText,
};

const FILTERS = [
  { label: "All", value: "All" },
  { label: "Commercial", value: "Commercial" },
  { label: "Real Estate", value: "Real Estate" },
  { label: "IP", value: "Patent & IP" },
];

export function ActiveMatters({ matters, onToggleComplete, onNewMatter }: ActiveMattersProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredMatters =
    selectedCategory === "All" ? matters : matters.filter((m) => m.category === selectedCategory);

  return (
    <section
      className="surface-card rise-in p-5 flex flex-col h-full min-h-[340px]"
      style={{ "--rise-delay": "480ms" } as React.CSSProperties}
      aria-label="Active matters"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <h3 className="text-[17px] font-semibold tracking-tight text-navy-950">Matters</h3>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-navy-50 text-navy-700 tabular-nums">
            {matters.filter((m) => !m.isCompleted).length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onNewMatter?.()}
          className="inline-flex items-center gap-1 ps-2.5 pe-3 py-1.5 rounded-full border border-navy-900/20 text-xs font-semibold text-navy-900 hover:bg-navy-900 hover:text-white hover:border-navy-900 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          New
        </button>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => setSelectedCategory(f.value)}
            aria-pressed={selectedCategory === f.value}
            className={cn(
              "px-3 py-1 rounded-full text-[11.5px] shrink-0 transition-all cursor-pointer",
              selectedCategory === f.value
                ? "bg-navy-900 text-white font-semibold"
                : "bg-gray-100 text-gray-500 hover:text-navy-900 font-medium"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="flex-1 overflow-y-auto custom-scrollbar flex flex-col divide-y divide-navy-900/[0.06] -me-1 pe-1">
        {filteredMatters.length === 0 && (
          <li className="py-10 text-center text-xs text-gray-500">No matters in this category.</li>
        )}
        {filteredMatters.map((item) => {
          const Icon = categoryIcons[item.category] || Briefcase;
          return (
            <li
              key={item.id}
              className={cn("flex items-center gap-3 py-3 transition-opacity", item.isCompleted && "opacity-50")}
            >
              <button
                type="button"
                onClick={() => onToggleComplete(item.id)}
                aria-label={item.isCompleted ? "Mark incomplete" : "Mark complete"}
                aria-pressed={!!item.isCompleted}
                className={cn(
                  "w-[22px] h-[22px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-all cursor-pointer active:scale-90",
                  item.isCompleted
                    ? "bg-navy-900 border-navy-900 text-white"
                    : "border-navy-300 hover:border-navy-900 bg-white"
                )}
              >
                {item.isCompleted && <Check className="w-3 h-3" strokeWidth={3} />}
              </button>

              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-[13px] font-semibold tracking-tight truncate",
                    item.isCompleted ? "line-through text-gray-400" : "text-navy-950"
                  )}
                >
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-1.5 py-0.5 rounded-md shrink-0"
                    style={{ backgroundColor: `${item.color}18`, color: item.color }}
                  >
                    <Icon className="w-2.5 h-2.5" />
                    {item.category}
                  </span>
                  <span className="text-[11px] text-gray-500 truncate">{item.dueDate}</span>
                </div>
              </div>

              <div className="w-12 shrink-0 flex flex-col items-end gap-1">
                <span className="text-[11px] font-semibold text-navy-800 tabular-nums">
                  {item.isCompleted ? 100 : item.progress}%
                </span>
                <div className="w-full h-1.5 rounded-full bg-navy-50 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.isCompleted ? 100 : item.progress}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import { Plus, Briefcase, Scale, Award, FileCheck, FileText, Check } from "lucide-react";
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
  matters: initialMatters = ACTIVE_MATTERS,
  onNewMatter,
}: ActiveMattersProps) {
  const [matters, setMatters] = useState<MatterItem[]>(initialMatters);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const toggleComplete = (id: string) => {
    setMatters((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, isCompleted: !m.isCompleted } : m
      )
    );
  };

  const filteredMatters =
    selectedCategory === "All"
      ? matters
      : matters.filter((m) => m.category === selectedCategory);

  return (
    <div className="rounded-xl apple-glass-card p-6 flex flex-col justify-between h-full min-h-[330px]">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-navy-900 tracking-tight whitespace-nowrap">
              Active Matters
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 border border-gray-300 whitespace-nowrap shrink-0">
              {matters.filter((m) => !m.isCompleted).length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNewMatter?.()}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 hover:bg-navy-100 text-navy-900 text-xs font-semibold transition-all border border-gray-300 apple-press cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span>New</span>
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto apple-scrollbar pb-2 mb-2">
          {["All", "Commercial", "Real Estate", "Patent & IP"].map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-navy-900 text-white font-semibold shadow-xs"
                    : "bg-gray-100 text-gray-500 hover:text-navy-900"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Inset Grouped Matters List */}
      <div className="flex-1 overflow-y-auto apple-scrollbar divide-y divide-gray-100 my-1 pr-1">
        {filteredMatters.map((item) => {
          const Icon = categoryIcons[item.category] || Briefcase;
          return (
            <div
              key={item.id}
              className={`flex items-center justify-between py-2.5 px-2 rounded-lg transition-all group hover:bg-gray-50 ${
                item.isCompleted ? "opacity-45" : ""
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Tactile Check Box */}
                <button
                  type="button"
                  onClick={() => toggleComplete(item.id)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all apple-press-sm cursor-pointer ${
                    item.isCompleted
                      ? "bg-success border-success text-white"
                      : "border-gray-300 hover:border-navy-300 bg-white"
                  }`}
                  title={item.isCompleted ? "Mark incomplete" : "Mark complete"}
                >
                  {item.isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                </button>

                <div className="flex flex-col min-w-0 text-left">
                  <span
                    className={`text-xs font-semibold tracking-tight truncate leading-tight ${
                      item.isCompleted
                        ? "line-through text-gray-400"
                        : "text-navy-900 group-hover:text-navy-600"
                    }`}
                  >
                    {item.title}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-md whitespace-nowrap shrink-0"
                      style={{
                        backgroundColor: `${item.color}15`,
                        color: item.color,
                      }}
                    >
                      <Icon className="w-2.5 h-2.5 mr-1" />
                      {item.category}
                    </span>
                    <span className="text-[10px] text-gray-500 whitespace-nowrap shrink-0">
                      {item.dueDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Mini Capsule */}
              <div className="hidden sm:flex flex-col items-end shrink-0 pl-2">
                <span className="text-[10px] font-mono text-gray-500">
                  {item.progress}%
                </span>
                <div className="w-12 h-1.5 bg-gray-100 rounded-sm overflow-hidden mt-1 border border-gray-300">
                  <div
                    className="h-full rounded-sm"
                    style={{
                      width: `${item.progress}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 text-center border-t border-black/[0.04]">
        <span className="text-[11px] text-gray-500 whitespace-nowrap truncate block">
          Court docket synchronized with Ministry of Justice
        </span>
      </div>
    </div>
  );
}

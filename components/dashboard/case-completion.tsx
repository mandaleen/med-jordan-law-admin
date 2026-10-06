"use client";

import React from "react";
import { TrendingUp } from "lucide-react";

interface CaseCompletionProps {
  percentage?: number;
  label?: string;
}

export function CaseCompletion({
  percentage = 74,
  label = "Cases Closed",
}: CaseCompletionProps) {
  // Half-circle arch geometry
  // Radius R = 72, Center = (100, 95)
  // Arc length = PI * R ≈ 226.2
  const radius = 72;
  const strokeWidth = 14;
  const circumference = Math.PI * radius;

  return (
    <div className="rounded-xl apple-glass-card p-6 flex flex-col justify-between h-full min-h-[330px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-[#1D1D1F] tracking-tight">
            Case Resolution
          </h3>
          <p className="text-xs text-[#86868B]">Litigation clearance rate</p>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#34C759] bg-[#34C759]/10 px-2 py-0.5 rounded-full">
          <TrendingUp className="w-3 h-3" /> Target Met
        </span>
      </div>

      {/* Apple Activity Ring Arch */}
      <div className="relative flex flex-col items-center justify-center my-auto py-2">
        <svg
          className="w-52 h-32 overflow-visible"
          viewBox="0 0 200 110"
        >
          <defs>
            {/* Apple Blue Gradient */}
            <linearGradient id="appleBlueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#007AFF" />
              <stop offset="100%" stopColor="#30B0C7" />
            </linearGradient>

            {/* Apple Teal Gradient */}
            <linearGradient id="appleTealGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#30B0C7" />
              <stop offset="100%" stopColor="#34C759" />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <path
            d="M 28 95 A 72 72 0 0 1 172 95"
            fill="none"
            stroke="rgba(0, 0, 0, 0.06)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* In Progress Arc (Teal/Green) */}
          <path
            d="M 28 95 A 72 72 0 0 1 172 95"
            fill="none"
            stroke="#30B0C7"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference * 0.74} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
          />

          {/* Completed Arc (Apple System Blue) */}
          <path
            d="M 28 95 A 72 72 0 0 1 172 95"
            fill="none"
            stroke="url(#appleBlueGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference * 0.52} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Numbers */}
        <div className="absolute bottom-2 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold text-[#1D1D1F] tracking-tight font-mono apple-mono leading-none">
            {percentage}%
          </span>
          <span className="text-[11px] text-[#86868B] font-medium mt-1">
            {label}
          </span>
        </div>
      </div>

      {/* Legend Breakdown Pills */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-black/[0.04]">
        <div className="flex flex-col text-center p-1.5 rounded-xl bg-black/[0.02]">
          <span className="text-[10px] text-[#86868B] font-medium">Closed</span>
          <span className="text-xs font-bold text-[#007AFF] font-mono">52%</span>
        </div>
        <div className="flex flex-col text-center p-1.5 rounded-xl bg-black/[0.02]">
          <span className="text-[10px] text-[#86868B] font-medium">Active</span>
          <span className="text-xs font-bold text-[#30B0C7] font-mono">22%</span>
        </div>
        <div className="flex flex-col text-center p-1.5 rounded-xl bg-black/[0.02]">
          <span className="text-[10px] text-[#86868B] font-medium">Review</span>
          <span className="text-xs font-bold text-[#86868B] font-mono">26%</span>
        </div>
      </div>
    </div>
  );
}

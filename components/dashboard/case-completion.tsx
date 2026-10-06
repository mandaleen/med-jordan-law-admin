"use client";

import React from "react";

interface CaseCompletionProps {
  percentage?: number;
  label?: string;
}

export function CaseCompletion({
  percentage = 74,
  label = "Cases closed",
}: CaseCompletionProps) {
  // Semi-circle gauge parameters
  // Radius R = 85, Center = (120, 110)
  // Arc spans from 180 deg (left) to 0 deg (right), top half
  const radius = 80;
  const strokeWidth = 22;
  const circumference = Math.PI * radius; // Half-circle circumference ≈ 251.3
  
  // Completed portion: 52%
  // In Progress portion: 22%
  // Pending portion: 26%
  const completedOffset = circumference * 0.52;
  const inProgressOffset = circumference * 0.22;
  const pendingOffset = circumference * 0.26;

  return (
    <div className="rounded-[22px] bg-white border border-[#EBEFF3] p-5 shadow-2xs flex flex-col justify-between h-full min-h-[300px]">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Case completion
        </h3>
      </div>

      {/* Semi-Circle Arch Chart */}
      <div className="relative flex flex-col items-center justify-center my-auto pt-4">
        <svg
          className="w-48 h-28 overflow-visible"
          viewBox="0 0 200 120"
        >
          <defs>
            {/* Hatched pattern for pending arc */}
            <pattern
              id="gaugeHatch"
              width="5"
              height="5"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="5"
                stroke="#CBD5E1"
                strokeWidth="2"
              />
            </pattern>
          </defs>

          {/* Background / Pending Track (Hatched) */}
          <path
            d="M 20 110 A 80 80 0 0 1 180 110"
            fill="none"
            stroke="url(#gaugeHatch)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* In Progress Arc (Blue) */}
          <path
            d="M 20 110 A 80 80 0 0 1 180 110"
            fill="none"
            stroke="#2563EB"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference * 0.74} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
          />

          {/* Completed Arc (Deep Navy) */}
          <path
            d="M 20 110 A 80 80 0 0 1 180 110"
            fill="none"
            stroke="#0A2342"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference * 0.52} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Numbers */}
        <div className="absolute bottom-2 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
            {percentage}%
          </span>
          <span className="text-xs text-slate-400 font-medium mt-1">
            {label}
          </span>
        </div>
      </div>

      {/* Legend at bottom */}
      <div className="flex items-center justify-between text-xs text-slate-600 font-medium pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0A2342]" />
          <span className="text-[11px] text-slate-500">Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
          <span className="text-[11px] text-slate-500">In Progress</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full border border-slate-300 bg-slate-100 relative overflow-hidden">
            <span className="absolute inset-0 pattern-hatched opacity-60" />
          </span>
          <span className="text-[11px] text-slate-500">Pending</span>
        </div>
      </div>
    </div>
  );
}

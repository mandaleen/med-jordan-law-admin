"use client";

import React, { useState, useEffect } from "react";
import { Pause, Play, RotateCcw, Activity } from "lucide-react";

interface OfficeHoursProps {
  initialSeconds?: number;
  hourlyRate?: number;
}

export function OfficeHours({
  initialSeconds = 5048,
  hourlyRate = 350,
}: OfficeHoursProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Live billable earnings calculation
  const billableAmount = ((seconds / 3600) * hourlyRate).toFixed(2);

  const handleTogglePlay = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  return (
    <div className="relative overflow-hidden rounded-xl apple-obsidian-card p-6 text-white flex flex-col justify-between h-full min-h-[330px]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#007AFF]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header: Title and Live Status */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#007AFF]" />
          <span className="text-xs font-semibold text-white/80 tracking-wider uppercase">
            Billable Telemetry
          </span>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
            isRunning
              ? "bg-[#34C759]/20 text-[#34C759] border-[#34C759]/30"
              : "bg-white/10 text-white/60 border-white/10"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isRunning ? "bg-[#34C759]" : "bg-white/40"
            }`}
          />
          {isRunning ? "Ticking" : "Paused"}
        </span>
      </div>

      {/* Stopwatch Center Display */}
      <div className="relative z-10 my-auto text-center py-4">
        {/* SF Mono Clock */}
        <div className="text-4xl sm:text-5xl font-bold tracking-wider font-mono apple-mono text-white drop-shadow-sm">
          {formatTime(seconds)}
        </div>

        {/* Live Accrued Retainer Rate */}
        <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-white/70">
          <span>Accrued:</span>
          <span className="font-mono font-bold text-[#34C759]">
            ${billableAmount}
          </span>
          <span className="text-white/40">(@ ${hourlyRate}/hr)</span>
        </div>
      </div>

      {/* Circular Physical Controls */}
      <div className="relative z-10 flex items-center justify-center gap-4 pt-2">
        {/* Reset Button */}
        <button
          type="button"
          onClick={handleReset}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all ring-1 ring-white/15 apple-press cursor-pointer"
          title="Reset Stopwatch"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={handleTogglePlay}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md apple-press cursor-pointer ${
            isRunning
              ? "bg-[#FF9500] hover:bg-[#E08300] text-black"
              : "bg-[#34C759] hover:bg-[#2DB24F] text-black"
          }`}
          title={isRunning ? "Pause Session" : "Start Session"}
        >
          {isRunning ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Pause, Play, Square } from "lucide-react";

interface OfficeHoursProps {
  initialSeconds?: number;
}

export function OfficeHours({ initialSeconds = 5048 }: OfficeHoursProps) {
  const [seconds, setSeconds] = useState(initialSeconds); // 01:24:08
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

  const handleTogglePlay = () => {
    setIsRunning(!isRunning);
  };

  const handleStop = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  return (
    <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#061426] via-[#0A2342] to-[#0D2F56] p-5 text-white shadow-md flex flex-col justify-between h-full min-h-[190px]">
      {/* Decorative Topographic/Wave SVG Background matching reference */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 240 180"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="none"
            stroke="#60A5FA"
            strokeWidth="1.5"
            d="M-40,80 C20,30 90,140 260,60"
          />
          <path
            fill="none"
            stroke="#93C5FD"
            strokeWidth="1.2"
            d="M-40,110 C30,50 110,160 260,90"
          />
          <path
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            d="M-40,50 C10,10 80,110 260,40"
          />
          <path
            fill="none"
            stroke="#2563EB"
            strokeWidth="1.5"
            d="M-40,140 C40,70 120,180 260,110"
          />
        </svg>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-300">
          Time Tracker
        </span>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-blue-200 font-medium border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Billable
        </span>
      </div>

      {/* Center Digital Clock */}
      <div className="relative z-10 my-auto text-center py-2">
        <span className="text-3xl sm:text-4xl font-extrabold tracking-wider text-white font-mono drop-shadow-xs">
          {formatTime(seconds)}
        </span>
      </div>

      {/* Circular Action Buttons */}
      <div className="relative z-10 flex items-center justify-center gap-3 pt-1">
        {/* Pause/Play Button: White Circle */}
        <button
          type="button"
          onClick={handleTogglePlay}
          className="w-9 h-9 rounded-full bg-white text-[#0A2342] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
          title={isRunning ? "Pause" : "Play"}
        >
          {isRunning ? (
            <Pause className="w-4 h-4 fill-[#0A2342]" />
          ) : (
            <Play className="w-4 h-4 fill-[#0A2342] ml-0.5" />
          )}
        </button>

        {/* Stop Button: Red Circle */}
        <button
          type="button"
          onClick={handleStop}
          className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
          title="Stop & Reset"
        >
          <Square className="w-3.5 h-3.5 fill-white" />
        </button>
      </div>
    </div>
  );
}

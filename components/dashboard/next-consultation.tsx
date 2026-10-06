"use client";

import React, { useState } from "react";
import { Video, Clock, ArrowRight } from "lucide-react";
import { NEXT_CONSULTATION } from "@/lib/mock-data";

interface NextConsultationProps {
  data?: typeof NEXT_CONSULTATION;
  onStart?: () => void;
}

export function NextConsultation({
  data = NEXT_CONSULTATION,
  onStart,
}: NextConsultationProps) {
  const [isStarted, setIsStarted] = useState(false);

  const handleStart = () => {
    setIsStarted(true);
    onStart?.();
  };

  return (
    <div className="rounded-[22px] bg-white border border-[#EBEFF3] p-5 shadow-2xs flex flex-col justify-between h-full min-h-[300px]">
      <div>
        {/* Card Tag */}
        <span className="text-sm font-semibold text-slate-800">
          Reminders
        </span>

        {/* Meeting / Consultation Headline */}
        <div className="mt-4">
          <h3 className="text-xl font-bold text-slate-900 leading-snug">
            {data.headline}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {data.type}
          </p>
        </div>

        {/* Time Info */}
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{data.time}</span>
        </div>
      </div>

      {/* Action Button: Start consultation */}
      <div className="pt-6">
        <button
          type="button"
          onClick={handleStart}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#0A2342] hover:bg-[#13335A] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs active:scale-[0.98]"
        >
          <Video className="w-4 h-4" />
          <span>{isStarted ? "In Consultation" : "Start consultation"}</span>
        </button>
      </div>
    </div>
  );
}

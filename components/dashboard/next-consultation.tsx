"use client";

import React, { useState, useEffect } from "react";
import { Video, Clock, ShieldCheck, PhoneOff } from "lucide-react";
import { NEXT_CONSULTATION } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NextConsultationProps {
  data?: typeof NEXT_CONSULTATION;
  onStart?: () => void;
}

export function NextConsultation({
  data = NEXT_CONSULTATION,
  onStart,
}: NextConsultationProps) {
  const [callState, setCallState] = useState<"idle" | "connecting" | "active">("idle");
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (callState === "active") {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [callState]);

  const handleStartCall = () => {
    setCallState("connecting");
    setTimeout(() => {
      setCallState("active");
      onStart?.();
    }, 700);
  };

  const handleEndCall = () => {
    setCallState("idle");
    setCallDuration(0);
  };

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-xl apple-glass-card p-6 flex flex-col justify-between h-full min-h-[330px]">
      <div>
        {/* Apple Calendar Badge + Status Header */}
        <div className="flex items-start justify-between mb-4">
          {/* Apple Calendar Icon Widget */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[14px] bg-white border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col text-center shrink-0">
              <div className="bg-[#FF3B30] text-white text-[9px] font-bold uppercase py-0.5 tracking-wider">
                OCT
              </div>
              <div className="flex-1 flex items-center justify-center font-bold text-lg text-[#1D1D1F] font-mono leading-none">
                06
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">
                Upcoming Session
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#FF9500]" />
                <span className="text-xs font-semibold text-[#FF9500]">
                  {data.countdown}
                </span>
              </div>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/[0.04] text-[11px] font-semibold text-[#86868B]">
            <ShieldCheck className="w-3 h-3 text-[#34C759]" /> Encrypted
          </span>
        </div>

        {/* Client Card & Headline */}
        <div className="p-3.5 bg-black/[0.025] rounded-[18px] border border-black/[0.04] mb-3">
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="h-9 w-9 ring-1 ring-black/10">
              <AvatarImage src={data.avatar} alt={data.clientName} />
              <AvatarFallback className="bg-[#AF52DE] text-white text-xs font-bold">
                SO
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <h4 className="text-sm font-semibold text-[#1D1D1F] tracking-tight leading-tight truncate">
                {data.clientName}
              </h4>
              <p className="text-[11px] text-[#86868B] truncate mt-0.5">
                {data.firm}
              </p>
            </div>
          </div>

          <div className="text-xs font-medium text-[#1D1D1F] bg-white/80 p-2 rounded-xl border border-black/[0.04]">
            {data.type}
          </div>
        </div>

        {/* Time Info */}
        <div className="flex items-center gap-2 text-xs text-[#86868B] font-medium px-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{data.time}</span>
        </div>
      </div>

      {/* Call Actions */}
      <div className="pt-4">
        {callState === "idle" && (
          <button
            type="button"
            onClick={handleStartCall}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#007AFF] hover:bg-[#0069D9] text-white text-xs sm:text-sm font-semibold shadow-[0_4px_16px_rgba(0,122,255,0.28)] transition-all apple-press cursor-pointer"
          >
            <Video className="w-4 h-4 stroke-[2.2]" />
            <span>Join FaceTime HD Session</span>
          </button>
        )}

        {callState === "connecting" && (
          <div className="w-full py-3 px-4 rounded-full bg-[#34C759]/20 text-[#34C759] text-xs sm:text-sm font-semibold text-center flex items-center justify-center gap-2 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[#34C759]" />
            <span>Handshaking Encrypted Stream...</span>
          </div>
        )}

        {callState === "active" && (
          <div className="flex items-center gap-2">
            <div className="flex-1 py-2.5 px-4 rounded-full bg-[#34C759]/15 border border-[#34C759]/30 flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-semibold text-[#34C759]">
                <span className="w-2 h-2 rounded-full bg-[#34C759]" />
                Live: {formatCallTime(callDuration)}
              </span>
              <span className="text-[11px] text-[#86868B]">1080p ProRes</span>
            </div>
            <button
              type="button"
              onClick={handleEndCall}
              className="p-2.5 rounded-full bg-[#FF3B30] hover:bg-[#E03429] text-white shadow-xs apple-press cursor-pointer"
              title="Leave call"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Video, Phone, MapPin, ExternalLink, Calendar, Clock, ChevronRight, CheckCircle2 } from "lucide-react";
import { UpcomingConsultationItem, UPCOMING_CONSULTATIONS } from "@/lib/mock-data";

interface UpcomingConsultationsPanelProps {
  onNavigateTab?: (tab: string) => void;
}

export function UpcomingConsultationsPanel({ onNavigateTab }: UpcomingConsultationsPanelProps) {
  const [consultations] = useState<UpcomingConsultationItem[]>(UPCOMING_CONSULTATIONS);
  const [startedId, setStartedId] = useState<string | null>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Video":
        return <Video className="w-3.5 h-3.5 text-blue-600" />;
      case "Phone":
        return <Phone className="w-3.5 h-3.5 text-emerald-600" />;
      case "In-Person":
        return <MapPin className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Calendar className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "Video":
        return "bg-blue-50 text-blue-700 border-blue-200/60";
      case "Phone":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "In-Person":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="apple-glass-card p-5 rounded-xl flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0A2342]/10 text-[#0A2342] flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-[#0A2342] tracking-tight whitespace-nowrap">Upcoming Consultations</h3>
              <p className="text-[11px] text-slate-400">Next scheduled sessions with clients & counsel</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap shrink-0">
            {consultations.length} Scheduled
          </span>
        </div>

        {/* Consultations List */}
        <div className="flex flex-col gap-2.5">
          {consultations.map((item, index) => {
            const isFirst = index === 0;
            const isStarted = startedId === item.id;

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-lg transition-all border flex flex-col gap-2.5 ${
                  isFirst
                    ? "bg-gradient-to-r from-blue-50/40 via-white to-white border-blue-200/80 shadow-xs"
                    : "bg-[#F8FAFC] border-[#E2E8F0] hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar */}
                    {item.clientAvatar ? (
                      <img
                        src={item.clientAvatar}
                        alt={item.clientName}
                        className="w-9 h-9 rounded-md object-cover shrink-0 ring-1 ring-black/10 shadow-xs"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-md bg-slate-200 text-[#0A2342] font-bold text-xs flex items-center justify-center shrink-0 ring-1 ring-black/10">
                        {item.clientInitials}
                      </div>
                    )}

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-[#0A2342] tracking-tight truncate">
                          {item.clientName}
                        </span>
                        {isFirst && (
                          <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-md bg-[#1D4ED8] text-white shadow-xs whitespace-nowrap shrink-0">
                            Next Up
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 truncate">{item.practiceArea}</span>
                    </div>
                  </div>

                  {/* Modality badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border whitespace-nowrap shrink-0 ${getTypeBadge(
                      item.type
                    )}`}
                  >
                    {getTypeIcon(item.type)}
                    {item.type}
                  </span>
                </div>

                {/* Details Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
                  <div className="flex items-center gap-2 text-slate-500 min-w-0">
                    <span className="flex items-center gap-1 font-medium text-slate-700 whitespace-nowrap shrink-0">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.time}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500 truncate">
                      Counsel: <strong className="text-slate-700 font-semibold">{item.lawyerName}</strong>
                    </span>
                  </div>

                  <div className="shrink-0">
                    {isFirst ? (
                      <button
                        type="button"
                        onClick={() => setStartedId(item.id)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 shadow-xs whitespace-nowrap shrink-0 ${
                          isStarted
                            ? "bg-emerald-600 text-white"
                            : "bg-[#0A2342] hover:bg-[#0D2F56] text-white"
                        }`}
                      >
                        {isStarted ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            In Session
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-3 h-3" />
                            Start Consultation
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap shrink-0">{item.countdown}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer navigation */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] mt-3">
        <span className="text-slate-400 font-medium whitespace-nowrap truncate mr-2">Automatic calendar invites sent via WhatsApp</span>
        <button
          type="button"
          onClick={() => onNavigateTab?.("bookings")}
          className="text-[#007AFF] hover:text-blue-700 font-semibold cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0"
        >
          View Full Schedule
          <ChevronRight className="w-3 h-3 shrink-0" />
        </button>
      </div>
    </div>
  );
}

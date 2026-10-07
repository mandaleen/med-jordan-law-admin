"use client";

import React, { useState } from "react";
import { Video, Phone, MapPin, ExternalLink, Calendar, Clock, ChevronRight, Gavel } from "lucide-react";
import { UpcomingConsultationItem, UPCOMING_CONSULTATIONS } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ClientAvatar } from "@/components/ui/client-avatar";
import { PostConsultationModal } from "@/components/modals/post-consultation-modal";

interface UpcomingConsultationsPanelProps {
  onNavigateTab?: (tab: string) => void;
  onOpenCase?: (clientName: string, notes: string) => void;
  onPrepareFeeContract?: (clientName: string, notes: string) => void;
}

export function UpcomingConsultationsPanel({
  onNavigateTab,
  onOpenCase,
  onPrepareFeeContract,
}: UpcomingConsultationsPanelProps) {
  const [consultations] = useState<UpcomingConsultationItem[]>(UPCOMING_CONSULTATIONS);
  const [startedId, setStartedId] = useState<string | null>(null);
  const [wrapUpItem, setWrapUpItem] = useState<UpcomingConsultationItem | null>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Video":
        return <Video className="w-3.5 h-3.5 text-info" />;
      case "Phone":
        return <Phone className="w-3.5 h-3.5 text-success" />;
      case "In-Person":
        return <MapPin className="w-3.5 h-3.5 text-warning" />;
      default:
        return <Calendar className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "Video":
        return "bg-info/10 text-info border-info/20";
      case "Phone":
        return "bg-success/10 text-success border-success/20";
      case "In-Person":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="apple-glass-card p-5 rounded-xl flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-navy-900/10 text-navy-900 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-navy-900 tracking-tight whitespace-nowrap">Upcoming Consultations</h3>
              <p className="text-[11px] text-gray-500">Next scheduled sessions with clients & counsel</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 border border-gray-300 whitespace-nowrap shrink-0">
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
                    ? "bg-gradient-to-r from-navy-50 via-white to-white border-navy-200 shadow-xs"
                    : "bg-gray-50 border-gray-300 hover:border-navy-300"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar */}
                    <ClientAvatar
                      name={item.clientName}
                      src={item.clientAvatar}
                      initials={item.clientInitials}
                      className="w-9 h-9 rounded-md shrink-0 ring-1 ring-black/10 shadow-xs"
                      fallbackClassName="text-xs font-bold rounded-md"
                    />

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-navy-900 tracking-tight truncate">
                          {item.clientName}
                        </span>
                        {isFirst && (
                          <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-md bg-navy-600 text-white shadow-xs whitespace-nowrap shrink-0">
                            Next Up
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-500 truncate">{item.practiceArea}</span>
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
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-[11px]">
                  <div className="flex items-center gap-2 text-gray-500 min-w-0">
                    <span className="flex items-center gap-1 font-medium text-gray-700 whitespace-nowrap shrink-0">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {item.time}
                    </span>
                    <span className="text-gray-300">·</span>
                    <span className="text-gray-500 truncate">
                      Counsel: <strong className="text-gray-900 font-semibold">{item.lawyerName}</strong>
                    </span>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    {isFirst ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            if (!isStarted) {
                              setStartedId(item.id);
                            } else {
                              setWrapUpItem(item);
                            }
                          }}
                          className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 shadow-xs whitespace-nowrap shrink-0 ${
                            isStarted
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                              : "bg-navy-900 hover:bg-navy-950 text-white"
                          }`}
                        >
                          {isStarted ? (
                            <>
                              <Gavel className="w-3 h-3" />
                              Conclude & Wrap-up
                            </>
                          ) : (
                            <>
                              <ExternalLink className="w-3 h-3" />
                              Start Consultation
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setWrapUpItem(item)}
                        className="px-2 py-0.5 rounded text-[11px] font-semibold text-slate-500 hover:text-navy-900 hover:bg-slate-100 cursor-pointer transition-colors"
                      >
                        Wrap-up
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer navigation */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] mt-3">
        <span className="text-gray-500 font-medium whitespace-nowrap truncate mr-2">Automatic calendar invites sent via WhatsApp</span>
        <button
          type="button"
          onClick={() => onNavigateTab?.("bookings")}
          className="text-navy-600 hover:text-navy-700 font-semibold cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0"
        >
          View Full Schedule
          <ChevronRight className="w-3 h-3 shrink-0" />
        </button>
      </div>

      {/* Post-Consultation Decision Flow Modal (Page 8) */}
      <PostConsultationModal
        isOpen={!!wrapUpItem}
        onClose={() => setWrapUpItem(null)}
        booking={wrapUpItem}
        onOpenCase={(clientName, notes) => {
          setWrapUpItem(null);
          if (onOpenCase) onOpenCase(clientName, notes);
          else onNavigateTab?.("cases");
        }}
        onPrepareFeeContract={(clientName, notes) => {
          setWrapUpItem(null);
          if (onPrepareFeeContract) onPrepareFeeContract(clientName, notes);
          else onNavigateTab?.("contracts");
        }}
        onConcludeSession={() => {
          setWrapUpItem(null);
          setStartedId(null);
        }}
      />
    </div>
  );
}

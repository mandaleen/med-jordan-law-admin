"use client";

import React, { useState } from "react";
import { Video, Phone, MapPin, Calendar, Clock, Gavel, ChevronRight, Play } from "lucide-react";
import { UpcomingConsultationItem, UPCOMING_CONSULTATIONS } from "@/lib/mock-data";
import { ClientAvatar } from "@/components/ui/client-avatar";
import { PostConsultationModal } from "@/components/modals/post-consultation-modal";
import { cn } from "@/lib/utils";

interface UpcomingConsultationsPanelProps {
  onNavigateTab?: (tab: string) => void;
  onOpenCase?: (clientName: string, notes: string) => void;
  onPrepareFeeContract?: (clientName: string, notes: string) => void;
}

const typeIcon = (type: string, className = "w-3.5 h-3.5") => {
  switch (type) {
    case "Video":
      return <Video className={className} />;
    case "Phone":
      return <Phone className={className} />;
    case "In-Person":
      return <MapPin className={className} />;
    default:
      return <Calendar className={className} />;
  }
};

export function UpcomingConsultationsPanel({
  onNavigateTab,
  onOpenCase,
  onPrepareFeeContract,
}: UpcomingConsultationsPanelProps) {
  const [consultations] = useState<UpcomingConsultationItem[]>(UPCOMING_CONSULTATIONS);
  const [startedId, setStartedId] = useState<string | null>(null);
  const [wrapUpItem, setWrapUpItem] = useState<UpcomingConsultationItem | null>(null);

  const [hero, ...rest] = consultations;
  const isStarted = !!hero && startedId === hero.id;

  return (
    <section
      className="surface-card rise-in p-5 flex flex-col h-full"
      style={{ "--rise-delay": "300ms" } as React.CSSProperties}
      aria-label="Upcoming consultations"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <h3 className="text-[17px] font-semibold tracking-tight text-navy-950">Consultations</h3>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-navy-50 text-navy-700 tabular-nums">
            {consultations.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onNavigateTab?.("bookings")}
          className="group inline-flex items-center gap-1 text-xs font-semibold text-navy-600 hover:text-navy-900 transition-colors cursor-pointer"
        >
          Schedule
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
        </button>
      </div>

      {/* Hero: next consultation */}
      {hero && (
        <div className="surface-dark p-5 flex flex-col gap-4">
          <svg
            aria-hidden="true"
            className="absolute -end-12 -top-14 w-56 h-56 text-white/[0.06] pointer-events-none"
            viewBox="0 0 200 200"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="100" cy="100" r="28" />
            <circle cx="100" cy="100" r="54" />
            <circle cx="100" cy="100" r="80" />
            <circle cx="100" cy="100" r="106" />
          </svg>

          <div className="relative flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold tracking-[0.14em] uppercase text-white/70">
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-gold-500 opacity-60 animate-ping" />
                <span className="relative w-2 h-2 rounded-full bg-gold-500" />
              </span>
              {isStarted ? "In session" : hero.countdown}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[11px] font-medium text-white/90">
              {typeIcon(hero.type, "w-3 h-3")}
              {hero.type}
            </span>
          </div>

          <div className="relative flex items-center gap-3.5 min-w-0">
            <ClientAvatar
              name={hero.clientName}
              src={hero.clientAvatar}
              initials={hero.clientInitials}
              className="w-12 h-12 rounded-2xl ring-2 ring-white/20"
              fallbackClassName="text-sm rounded-2xl"
            />
            <div className="min-w-0">
              <h4 className="text-xl leading-tight font-semibold tracking-tight line-clamp-2">
                {hero.practiceArea}
              </h4>
              <p className="text-[12.5px] text-white/65 truncate mt-0.5">
                {hero.clientName} · {hero.lawyerName}
              </p>
            </div>
          </div>

          <div className="relative flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-[12.5px] text-white/80 tabular-nums">
              <Clock className="w-3.5 h-3.5 text-white/50" />
              {hero.time}
            </span>
            <button
              type="button"
              onClick={() => (isStarted ? setWrapUpItem(hero) : setStartedId(hero.id))}
              className={cn(
                "inline-flex items-center gap-2 ps-4 pe-1.5 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer active:scale-95",
                isStarted
                  ? "bg-emerald-500 text-white hover:bg-emerald-400"
                  : "bg-white text-navy-900 hover:bg-navy-50"
              )}
            >
              {isStarted ? "Conclude" : "Start meeting"}
              <span
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center",
                  isStarted ? "bg-white/25 text-white" : "bg-navy-900 text-white"
                )}
              >
                {isStarted ? <Gavel className="w-3.5 h-3.5" /> : <Play className="w-3 h-3 fill-current" />}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Rest of the day */}
      <ul className="mt-3 flex flex-col divide-y divide-navy-900/[0.06]">
        {rest.map((item) => (
          <li key={item.id} className="group flex items-center gap-3 py-3">
            <ClientAvatar
              name={item.clientName}
              src={item.clientAvatar}
              initials={item.clientInitials}
              className="w-10 h-10 rounded-xl"
              fallbackClassName="text-xs rounded-xl"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-semibold tracking-tight text-navy-950 truncate">
                {item.clientName}
              </p>
              <p className="text-[11.5px] text-gray-500 truncate mt-0.5 flex items-center gap-1.5">
                <span className="text-navy-400 shrink-0">{typeIcon(item.type, "w-3 h-3")}</span>
                <span className="tabular-nums shrink-0">{item.time.split("–")[0].trim()}</span>
                <span className="text-gray-300">·</span>
                <span className="truncate">{item.practiceArea}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setWrapUpItem(item)}
              className="shrink-0 px-3 py-1 rounded-full border border-navy-900/15 text-[11.5px] font-semibold text-navy-800 hover:bg-navy-900 hover:text-white hover:border-navy-900 transition-colors cursor-pointer"
            >
              Wrap-up
            </button>
          </li>
        ))}
      </ul>

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
    </section>
  );
}

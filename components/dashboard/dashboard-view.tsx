"use client";

import React, { useState, useSyncExternalStore } from "react";
import { Plus, Download } from "lucide-react";
import { StatCards } from "@/components/dashboard/stat-cards";
import { NeedsAttentionPanel } from "@/components/dashboard/needs-attention-panel";
import { UpcomingConsultationsPanel } from "@/components/dashboard/upcoming-consultations-panel";
import { WeeklyBookings } from "@/components/dashboard/weekly-bookings";
import { ActiveMatters } from "@/components/dashboard/active-matters";
import { MattersProgress } from "@/components/dashboard/matters-progress";
import { usePractice } from "@/lib/practice-context";
import { ACTIVE_MATTERS, MatterItem, StatItem } from "@/lib/mock-data";

interface DashboardViewProps {
  stats: StatItem[];
  activeCardId?: string;
  onCardClick?: (id: string) => void;
  onNavigateTab: (tabId: string) => void;
  onAcceptBooking?: (id: string) => void;
  onDeclineBooking?: (id: string) => void;
  onNewBooking?: () => void;
  onExport?: () => void;
}

const subscribeNoop = () => () => {};

function greetingNow() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function todayLabel() {
  return new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

// Client-only values: server snapshot is a neutral fallback so hydration matches
function useGreeting() {
  const greeting = useSyncExternalStore(subscribeNoop, greetingNow, () => "Welcome back");
  const today = useSyncExternalStore(subscribeNoop, todayLabel, () => "");
  return { greeting, today };
}

export function DashboardView({
  stats,
  activeCardId,
  onCardClick,
  onNavigateTab,
  onAcceptBooking,
  onDeclineBooking,
  onNewBooking,
  onExport,
}: DashboardViewProps) {
  const { currentUser } = usePractice();
  const { greeting, today } = useGreeting();
  const [matters, setMatters] = useState<MatterItem[]>(ACTIVE_MATTERS);

  const toggleMatter = (id: string) =>
    setMatters((prev) => prev.map((m) => (m.id === id ? { ...m, isCompleted: !m.isCompleted } : m)));

  const firstName = currentUser.name.split(" ")[0];

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <header className="rise-in flex flex-wrap items-end justify-between gap-4 px-1">
        <div className="min-w-0">
          {today && (
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-gray-500 mb-1.5">{today}</p>
          )}
          <h1 className="text-[32px] sm:text-[38px] leading-[1.05] font-semibold tracking-[-0.035em] text-navy-950">
            {greeting}, {firstName}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Here&apos;s what&apos;s happening across your practice today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onNewBooking}
            className="inline-flex items-center gap-2 ps-4 pe-5 h-11 rounded-full bg-navy-900 text-white text-sm font-semibold shadow-[0_10px_22px_-10px_rgba(26,39,68,0.7)] hover:bg-navy-800 hover:-translate-y-px active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" strokeWidth={2.4} />
            New Booking
          </button>
          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center gap-2 px-5 h-11 rounded-full bg-white border border-navy-900/25 text-navy-900 text-sm font-semibold hover:bg-navy-50 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </header>

      <StatCards stats={stats} activeCardId={activeCardId} onCardClick={onCardClick} />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-7 min-w-0">
          <WeeklyBookings />
        </div>
        <div className="xl:col-span-5 min-w-0">
          <UpcomingConsultationsPanel onNavigateTab={onNavigateTab} />
        </div>

        <div className="xl:col-span-5 min-w-0">
          <NeedsAttentionPanel
            onAcceptBooking={onAcceptBooking}
            onDeclineBooking={onDeclineBooking}
            onNavigateTab={onNavigateTab}
          />
        </div>
        <div className="xl:col-span-3 min-w-0">
          <MattersProgress matters={matters} />
        </div>
        <div className="lg:col-span-2 xl:col-span-4 min-w-0">
          <ActiveMatters matters={matters} onToggleComplete={toggleMatter} onNewMatter={onNewBooking} />
        </div>
      </div>
    </div>
  );
}

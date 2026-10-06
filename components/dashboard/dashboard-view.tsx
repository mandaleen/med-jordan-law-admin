"use client";

import React from "react";
import { StatCards } from "@/components/dashboard/stat-cards";
import { NeedsAttentionPanel } from "@/components/dashboard/needs-attention-panel";
import { UpcomingConsultationsPanel } from "@/components/dashboard/upcoming-consultations-panel";
import { WeeklyBookings } from "@/components/dashboard/weekly-bookings";
import { ActiveMatters } from "@/components/dashboard/active-matters";
import { StatItem } from "@/lib/mock-data";

interface DashboardViewProps {
  stats: StatItem[];
  activeCardId?: string;
  onCardClick?: (id: string) => void;
  onNavigateTab: (tabId: string) => void;
  onAcceptBooking?: (id: string) => void;
  onDeclineBooking?: (id: string) => void;
  onNewBooking?: () => void;
}

export function DashboardView({
  stats,
  activeCardId,
  onCardClick,
  onNavigateTab,
  onAcceptBooking,
  onDeclineBooking,
  onNewBooking,
}: DashboardViewProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Row 1: The 4 Core Client Journey Stat Cards */}
      <StatCards
        stats={stats}
        activeCardId={activeCardId}
        onCardClick={onCardClick}
      />

      {/* Row 2: Needs Attention Panel + Upcoming Consultations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Needs Attention Panel (Bookings awaiting acceptance, rejected docs, stalled flows) */}
        <div>
          <NeedsAttentionPanel
            onAcceptBooking={onAcceptBooking}
            onDeclineBooking={onDeclineBooking}
            onNavigateTab={onNavigateTab}
          />
        </div>

        {/* Upcoming Consultations (Chronological scheduled appointments with client & lawyer) */}
        <div>
          <UpcomingConsultationsPanel
            onNavigateTab={onNavigateTab}
          />
        </div>
      </div>

      {/* Row 3: Weekly Practice Velocity & Active Matters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <WeeklyBookings />
        </div>
        <div className="lg:col-span-1">
          <ActiveMatters onNewMatter={onNewBooking} />
        </div>
      </div>
    </div>
  );
}

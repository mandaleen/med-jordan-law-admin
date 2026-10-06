"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { BookingsView } from "@/components/bookings/bookings-view";
import { CasesView } from "@/components/cases/cases-view";
import { ClientsView } from "@/components/clients/clients-view";
import { FinanceView } from "@/components/finance/finance-view";
import { ContentView } from "@/components/content/content-view";
import { SettingsView } from "@/components/settings/settings-view";
import { SpotlightModal } from "@/components/modals/spotlight-modal";
import { NewBookingModal } from "@/components/modals/new-booking-modal";
import { ExportSheetModal } from "@/components/modals/export-sheet-modal";
import {
  DASHBOARD_STAT_CARDS,
  NOTIFICATIONS,
  NotificationItem,
  StatItem,
} from "@/lib/mock-data";

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("dashboard");

  // Modals state
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isExportSheetOpen, setIsExportSheetOpen] = useState(false);

  // Dynamic stats & notifications
  const [stats, setStats] = useState<StatItem[]>(DASHBOARD_STAT_CARDS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS);
  const [activeCardId, setActiveCardId] = useState<string | undefined>("bookings-today");

  // Global Keyboard Shortcuts (⌘K, ⌘F) for Spotlight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K" || e.key === "f" || e.key === "F")) {
        e.preventDefault();
        setIsSpotlightOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNewBookingSubmit = (newBooking: {
    name: string;
    caseType: string;
    date: string;
    time: string;
    fee: string;
  }) => {
    // Increment Bookings Today stat
    setStats((prev) =>
      prev.map((s) =>
        s.id === "bookings-today"
          ? {
              ...s,
              value: (parseInt(s.value, 10) + 1).toString(),
              subMetric: "3 awaiting acceptance",
            }
          : s
      )
    );
  };

  const handleMarkNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#F4F5F7] text-[#0A2342] antialiased select-none font-sans">
      {/* Non-Scrolling Fixed Sidebar anchored left */}
      <Sidebar
        activeId={activeNav}
        onSelectNav={setActiveNav}
        notifications={notifications}
        onMarkNotificationsRead={handleMarkNotificationsRead}
      />

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="max-w-[1540px] mx-auto flex flex-col gap-3 pb-12">
          {/* DYNAMIC TAB WORKSPACES MAPPED TO CLIENT JOURNEY */}
          {activeNav === "dashboard" && (
            <DashboardView
              stats={stats}
              activeCardId={activeCardId}
              onCardClick={setActiveCardId}
              onNavigateTab={setActiveNav}
              onNewBooking={() => setIsNewBookingOpen(true)}
            />
          )}

          {activeNav === "bookings" && (
            <BookingsView
              onNewBookingClick={() => setIsNewBookingOpen(true)}
              onViewClient={() => setActiveNav("clients")}
            />
          )}

          {activeNav === "cases" && (
            <CasesView />
          )}

          {activeNav === "clients" && (
            <ClientsView />
          )}

          {activeNav === "finance" && (
            <FinanceView />
          )}

          {activeNav === "content" && (
            <ContentView />
          )}

          {activeNav === "settings" && (
            <SettingsView />
          )}

          {activeNav === "help" && (
            <div className="apple-glass-card p-8 rounded-[22px] flex flex-col items-center justify-center text-center gap-4 max-w-lg mx-auto mt-12">
              <div className="w-14 h-14 rounded-2xl bg-[#0A2342] text-white flex items-center justify-center font-bold text-xl shadow-md">
                MJL
              </div>
              <h2 className="text-xl font-bold text-[#0A2342]">Senior Legal Advisory Desk & Support</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Direct internal escalation channel for managing partners, litigation leads, and staff accounts.
                For urgent docket assistance, reach out to Senior Partner Tariq Qudah directly.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveNav("dashboard")}
                  className="px-4 py-2 bg-[#0A2342] text-white text-xs font-semibold rounded-xl cursor-pointer whitespace-nowrap shrink-0"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals & Command Bars */}
      <SpotlightModal
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
        onNewBooking={() => setIsNewBookingOpen(true)}
        onExportData={() => setIsExportSheetOpen(true)}
      />

      <NewBookingModal
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
        onSubmit={handleNewBookingSubmit}
      />

      <ExportSheetModal
        isOpen={isExportSheetOpen}
        onClose={() => setIsExportSheetOpen(false)}
      />
    </div>
  );
}

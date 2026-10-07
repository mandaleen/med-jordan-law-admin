"use client";

import React, { useState, useEffect } from "react";
import { Menu, Search, Plus } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { BookingsView } from "@/components/bookings/bookings-view";
import { CasesView } from "@/components/cases/cases-view";
import { ClientsView } from "@/components/clients/clients-view";
import { FinanceView } from "@/components/finance/finance-view";
import { ContentView } from "@/components/content/content-view";
import { SettingsView } from "@/components/settings/settings-view";
import { ContractsView } from "@/components/contracts/contracts-view";
import { LeadsView } from "@/components/leads/leads-view";
import { AuditView } from "@/components/audit/audit-view";
import { SpotlightModal } from "@/components/modals/spotlight-modal";
import { NewBookingModal } from "@/components/modals/new-booking-modal";
import { ExportSheetModal } from "@/components/modals/export-sheet-modal";
import { PracticeProvider, usePractice } from "@/lib/practice-context";

function DashboardContent() {
  const {
    activeNav,
    setActiveNav,
    activeCardId,
    setActiveCardId,
    lang,
    toggleLang,
    t,
    stats,
    notifications,
    markNotificationsRead,
    addBooking,
    toastMessage,
  } = usePractice();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals state
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isExportSheetOpen, setIsExportSheetOpen] = useState(false);

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

  return (
    <div className="h-screen w-full flex overflow-hidden bg-gray-50 text-navy-900 antialiased font-sans">
      {/* Responsive Sidebar (Desktop sticky sidebar + Mobile off-canvas drawer) */}
      <Sidebar
        activeId={activeNav}
        onSelectNav={setActiveNav}
        notifications={notifications}
        onMarkNotificationsRead={markNotificationsRead}
        currentLang={lang}
        onToggleLang={toggleLang}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar min-w-0 flex flex-col">
        {/* Mobile Header Bar (lg:hidden) */}
        <header className="lg:hidden sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -m-1 rounded-xl text-navy-900 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-navy-900 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                MJL
              </div>
              <div>
                <h1 className="text-xs font-bold text-navy-900 leading-tight">Med Jordan Law</h1>
                <span className="text-[10px] text-gray-500 font-medium capitalize block">{activeNav} Workspace</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsSpotlightOpen(true)}
              className="p-2 rounded-xl text-gray-600 hover:text-navy-900 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsNewBookingOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-navy-900 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t("action.new")}</span>
            </button>
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 p-3 sm:p-5 lg:p-6 flex flex-col min-w-0">
          <div className="max-w-[1600px] w-full mx-auto flex-1 flex flex-col gap-3 min-h-0 pb-4">
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
                onOpenContractFromConsultation={() => setActiveNav("contracts")}
              />
            )}

            {activeNav === "cases" && (
              <CasesView />
            )}

            {activeNav === "clients" && (
              <ClientsView />
            )}

            {activeNav === "contracts" && (
              <ContractsView />
            )}

            {activeNav === "leads" && (
              <LeadsView
                onConvertToBooking={() => {
                  setActiveNav("bookings");
                  setIsNewBookingOpen(true);
                }}
              />
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

            {activeNav === "audit" && (
              <AuditView />
            )}

            {activeNav === "help" && (
              <div className="apple-glass-card p-8 rounded-[22px] flex flex-col items-center justify-center text-center gap-4 max-w-lg mx-auto mt-12 animate-in fade-in duration-200">
                <div className="w-14 h-14 rounded-2xl bg-navy-900 text-white flex items-center justify-center font-bold text-xl shadow-md">
                  MJL
                </div>
                <h2 className="text-xl font-bold text-navy-900">Senior Legal Advisory Desk & Support</h2>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Direct internal escalation channel for managing partners, litigation leads, and staff accounts.
                  For urgent docket assistance, reach out to Senior Partner Tariq Qudah directly.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveNav("dashboard")}
                    className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold rounded-xl cursor-pointer whitespace-nowrap shrink-0 transition-all"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Global Modals */}
      <SpotlightModal
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
        onNewBooking={() => setIsNewBookingOpen(true)}
        onExportData={() => setIsExportSheetOpen(true)}
        onNavigateTab={setActiveNav}
      />

      <NewBookingModal
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
        onSubmit={addBooking}
      />

      <ExportSheetModal
        isOpen={isExportSheetOpen}
        onClose={() => setIsExportSheetOpen(false)}
      />

      {/* Global Action Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 end-5 z-50 bg-navy-950/95 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl border border-navy-700/60 backdrop-blur-md flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <PracticeProvider>
      <DashboardContent />
    </PracticeProvider>
  );
}

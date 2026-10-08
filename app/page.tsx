"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopHeader } from "@/components/layout/top-header";
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
    stats,
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
    <div className="h-screen w-full flex overflow-hidden bg-[#EEF1F7] text-navy-900 antialiased font-sans">
      {/* Responsive Sidebar (Desktop sticky sidebar + Mobile off-canvas drawer) */}
      <Sidebar
        activeId={activeNav}
        onSelectNav={setActiveNav}
        currentLang={lang}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar min-w-0 flex flex-col">
        {/* Unified Top Header Bar (Desktop & Mobile) */}
        <TopHeader
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenSpotlight={() => setIsSpotlightOpen(true)}
          onOpenNewBooking={() => setIsNewBookingOpen(true)}
        />

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
                onExport={() => setIsExportSheetOpen(true)}
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
              <div className="surface-card p-8 rounded-[22px] flex flex-col items-center justify-center text-center gap-4 max-w-lg mx-auto mt-12 animate-in fade-in duration-200">
                <div className="w-14 h-14 rounded-2xl bg-navy-900 text-white flex items-center justify-center font-bold text-xl shadow-md">
                  MJL
                </div>
                <h2 className="text-xl font-bold text-navy-900">Help & Support</h2>
                <p className="text-xs text-gray-500 leading-relaxed">
                  For assistance, contact Tariq Qudah directly.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveNav("dashboard")}
                    className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold rounded-full cursor-pointer whitespace-nowrap shrink-0 transition-all"
                  >
                    Dashboard
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

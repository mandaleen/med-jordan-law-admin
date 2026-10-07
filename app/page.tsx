"use client";

import React, { useState, useEffect } from "react";
import { Menu, Search, Plus, Bell, Languages } from "lucide-react";
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
import { NotificationsPopover } from "@/components/modals/notifications-popover";
import { PracticeProvider, usePractice } from "@/lib/practice-context";

function DashboardContent() {
  const {
    activeNav,
    setActiveNav,
    lang,
    toggleLang,
    setLang,
    t,
    stats,
    notifications,
    markNotificationsRead,
    addBooking,
    toastMessage,
    currentUser,
    updateUserAvatar,
    resetUserAvatar,
    showToast,
  } = usePractice();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals state
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isExportSheetOpen, setIsExportSheetOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

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
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-50 focus:bg-navy-900 focus:text-white focus:px-3 focus:py-2 focus:rounded-md">Skip to content</a>
      {/* Responsive Sidebar (Desktop sticky sidebar + Mobile off-canvas drawer) */}
      <Sidebar
        activeId={activeNav}
        onSelectNav={setActiveNav}
        currentLang={lang}
        onToggleLang={toggleLang}
        onSelectLang={setLang}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        currentUser={currentUser}
        onUpdateAvatar={updateUserAvatar}
        onResetAvatar={resetUserAvatar}
        showToast={showToast}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 h-screen overflow-y-auto custom-scrollbar min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 h-14 px-4 lg:px-8 bg-gray-50/90 backdrop-blur-md border-b border-gray-200 shrink-0">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -ms-2 rounded-md text-navy-900 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setIsSpotlightOpen(true)}
            className="group flex items-center gap-2.5 h-9 flex-1 max-w-md px-3 rounded-md bg-white border border-gray-200 hover:border-gray-300 text-gray-500 text-sm transition-colors cursor-pointer text-start"
            aria-label={t("topbar.search")}
          >
            <Search className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="flex-1 truncate">{t("topbar.search")}</span>
            <kbd className="hidden sm:inline font-numeric text-xs text-gray-500 border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50">Ctrl K</kbd>
          </button>

          <div className="ms-auto flex items-center gap-1">
            <button
              type="button"
              onClick={toggleLang}
              className="h-9 px-2.5 inline-flex items-center gap-1.5 rounded-md text-sm text-gray-700 hover:text-navy-900 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}
            >
              <Languages className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">{lang === "en" ? "عربي" : "English"}</span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotificationsOpen((v) => !v)}
                className="relative h-9 w-9 inline-flex items-center justify-center rounded-md text-gray-700 hover:text-navy-900 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
                aria-expanded={isNotificationsOpen}
              >
                <Bell className="w-[18px] h-[18px]" strokeWidth={1.7} aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 end-1 min-w-4 h-4 px-1 rounded-full bg-gold-700 text-white text-[10px] font-semibold font-numeric leading-4 text-center ring-2 ring-gray-50">
                    {unreadCount}
                  </span>
                )}
              </button>
              <NotificationsPopover
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                items={notifications}
                onMarkAllRead={markNotificationsRead}
                placement="top-bar"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsNewBookingOpen(true)}
              className="ms-2 h-9 px-3.5 inline-flex items-center gap-1.5 rounded-md bg-navy-900 hover:bg-navy-800 text-white text-sm font-medium transition-colors apple-press cursor-pointer"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">{t("action.new_consultation")}</span>
              <span className="sm:hidden">{t("action.new")}</span>
            </button>
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8 pb-12 flex flex-col min-w-0">
          <div className="max-w-[1360px] w-full mx-auto flex-1 flex flex-col gap-3 min-h-0">
            {/* DYNAMIC TAB WORKSPACES MAPPED TO CLIENT JOURNEY */}
            {activeNav === "dashboard" && (
              <DashboardView
                stats={stats}
                onNavigateTab={setActiveNav}
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
              <div className="max-w-xl mt-8 flex flex-col gap-4 animate-in fade-in duration-200">
                <h2 className="font-display text-3xl font-medium tracking-tight text-navy-900">Counsel desk</h2>
                <p className="text-[15px] text-gray-600 leading-relaxed">
                  The internal escalation line for partners, litigation leads and staff. For anything urgent on the docket,
                  contact Senior Partner Tariq Qudah directly.
                </p>
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveNav("dashboard")}
                    className="h-9 px-4 bg-navy-900 hover:bg-navy-800 text-white text-sm font-medium rounded-md cursor-pointer transition-colors apple-press"
                  >
                    Back to today
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
        <div role="status" className="fixed bottom-5 end-5 z-50 bg-navy-900 text-white text-sm px-4 py-2.5 rounded-lg shadow-[var(--shadow-float)] flex items-center gap-2.5 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-300 shrink-0" />
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

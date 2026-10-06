"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { StatCards } from "@/components/dashboard/stat-cards";
import { WeeklyBookings } from "@/components/dashboard/weekly-bookings";
import { NextConsultation } from "@/components/dashboard/next-consultation";
import { RecentBookings } from "@/components/dashboard/recent-bookings";
import { CaseCompletion } from "@/components/dashboard/case-completion";
import { ActiveMatters } from "@/components/dashboard/active-matters";
import { OfficeHours } from "@/components/dashboard/office-hours";

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("dashboard");

  const handleNewBooking = () => {
    alert("New Booking Modal / Form");
  };

  const handleExportData = () => {
    alert("Exporting consultations and case data as CSV...");
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#F4F5F7] text-slate-900 antialiased font-sans">
      {/* Fixed Left Sidebar — Never scrolls */}
      <Sidebar activeId={activeNav} onSelectNav={setActiveNav} />

      {/* Main Scrollable Content Area */}
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar min-w-0 p-5 md:p-7 lg:p-8">
        <div className="max-w-[1540px] mx-auto flex flex-col gap-1 pb-10">
          {/* Top Bar with Search & Profile & Action Buttons */}
          <TopBar
            onNewBooking={handleNewBooking}
            onExportData={handleExportData}
          />

          {/* Row 1: 4 Stat Cards */}
          <StatCards />

          {/* Master Grid for Middle and Bottom Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Middle Row: Left Card (Cols 1 & 2) — Weekly Bookings */}
            <div className="lg:col-span-2">
              <WeeklyBookings />
            </div>

            {/* Middle Row: Middle Card (Col 3) — Next Consultation */}
            <div className="lg:col-span-1">
              <NextConsultation />
            </div>

            {/* Right Column Upper (Col 4) — Key Cases (Matches Reference Project Card) */}
            <div className="lg:col-span-1">
              <ActiveMatters />
            </div>

            {/* Bottom Row: Left Wide Card (Cols 1 & 2) — Recent Bookings */}
            <div className="lg:col-span-2">
              <RecentBookings onAddBooking={handleNewBooking} />
            </div>

            {/* Bottom Row: Middle Card (Col 3) — Case Completion Gauge */}
            <div className="lg:col-span-1">
              <CaseCompletion percentage={74} label="Cases closed" />
            </div>

            {/* Bottom Row: Right Card (Col 4) — Office Hours Time Tracker */}
            <div className="lg:col-span-1">
              <OfficeHours />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

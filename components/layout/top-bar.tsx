"use client";

import React, { useState } from "react";
import {
  Search,
  Mail,
  Bell,
  Plus,
  ArrowUpRight,
  Download,
  CalendarPlus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CURRENT_USER } from "@/lib/mock-data";

interface TopBarProps {
  onNewBooking?: () => void;
  onExportData?: () => void;
}

export function TopBar({ onNewBooking, onExportData }: TopBarProps) {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="flex flex-col gap-6 mb-7">
      {/* Upper Utility Bar */}
      <div className="flex items-center justify-between gap-4">
        {/* Search Bar matching Donezo pill style */}
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search clients, cases, or bookings"
            className="w-full pl-10 pr-12 py-2 text-xs md:text-sm bg-white border border-[#EBEFF3] rounded-full focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 focus:border-[#0A2342] text-slate-800 placeholder:text-slate-400 shadow-2xs transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-100 rounded border border-slate-200">
              ⌘F
            </kbd>
          </div>
        </div>

        {/* Right Actions & Profile Cluster */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Messages icon button */}
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-white border border-[#EBEFF3] flex items-center justify-center text-slate-600 hover:text-[#0A2342] hover:bg-slate-50 transition-colors shadow-2xs relative"
            title="Messages"
          >
            <Mail className="w-4 h-4" />
          </button>

          {/* Notifications icon button */}
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-white border border-[#EBEFF3] flex items-center justify-center text-slate-600 hover:text-[#0A2342] hover:bg-slate-50 transition-colors shadow-2xs relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
          </button>

          {/* User Profile Chip */}
          <div className="flex items-center gap-3 pl-2 py-1 pr-1">
            <Avatar className="h-9 w-9 ring-2 ring-slate-100">
              <AvatarImage src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
              <AvatarFallback className="bg-[#0A2342] text-white text-xs font-bold">
                TQ
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-none">
                {CURRENT_USER.name}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 leading-none font-medium">
                {CURRENT_USER.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Title & Action Buttons Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Plan, prioritize, and accomplish your cases with ease.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Primary Button: + New booking */}
          <button
            type="button"
            onClick={onNewBooking}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0A2342] hover:bg-[#13335A] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span>New booking</span>
          </button>

          {/* Secondary Button: Export data */}
          <button
            type="button"
            onClick={onExportData}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-2xs active:scale-[0.98]"
          >
            <span>Export data</span>
          </button>
        </div>
      </div>
    </div>
  );
}

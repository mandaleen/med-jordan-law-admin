"use client";

import React, { useState } from "react";
import { Plus, ChevronRight, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { RECENT_BOOKINGS, RecentBookingItem } from "@/lib/mock-data";

interface RecentBookingsProps {
  bookings?: RecentBookingItem[];
  onAddBooking?: () => void;
}

export function RecentBookings({
  bookings = RECENT_BOOKINGS,
  onAddBooking,
}: RecentBookingsProps) {
  const [filter, setFilter] = useState<"All" | "Completed" | "In Progress" | "Pending">("All");

  const filtered =
    filter === "All"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  const getStatusBadge = (status: RecentBookingItem["status"]) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#34C759]/10 text-[#34C759] whitespace-nowrap shrink-0">
            <CheckCircle2 className="w-3 h-3 shrink-0" /> Completed
          </span>
        );
      case "In Progress":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#007AFF]/10 text-[#007AFF] whitespace-nowrap shrink-0">
            <Clock className="w-3 h-3 shrink-0" /> In Progress
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FF9500]/10 text-[#FF9500] whitespace-nowrap shrink-0">
            <AlertCircle className="w-3 h-3 shrink-0" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl apple-glass-card p-6 flex flex-col justify-between h-full min-h-[330px]">
      {/* Header with Title and Filter Segment */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-semibold text-[#1D1D1F] tracking-tight">
            Recent Client Bookings
          </h3>
          <p className="text-xs text-[#86868B]">
            Confirmed legal intakes and retainer agreements
          </p>
        </div>

        {/* Minimal Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/60 self-start sm:self-auto shrink-0">
          {(["All", "Completed", "In Progress", "Pending"] as const).map((s) => {
            const isSelected = filter === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setFilter(s)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected
                    ? "bg-white text-[#1D1D1F] shadow-xs font-semibold"
                    : "text-[#86868B] hover:text-[#1D1D1F]"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bookings Inset List */}
      <div className="flex-1 divide-y divide-black/[0.04] overflow-y-auto apple-scrollbar pr-1">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              alert(`Opening client record: ${item.name}`);
            }}
            className="flex items-center justify-between py-3 px-2 rounded-2xl hover:bg-black/[0.025] transition-colors group cursor-pointer apple-press"
          >
            {/* Left: Avatar + Details */}
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-10 h-10 rounded-[14px] flex items-center justify-center font-bold text-xs shadow-xs ring-1 ring-black/5 shrink-0 ${item.avatarBg}`}
              >
                {item.initials}
              </div>
              <div className="flex flex-col text-left min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#1D1D1F] group-hover:text-[#007AFF] transition-colors leading-tight truncate">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-[#86868B] font-medium hidden sm:inline">
                    • {item.timeAgo}
                  </span>
                </div>
                <span className="text-xs text-[#86868B] font-medium mt-0.5 leading-tight truncate">
                  {item.caseType}
                </span>
              </div>
            </div>

            {/* Right: Retainer & Status Badge */}
            <div className="flex items-center gap-4 shrink-0 pl-3">
              <span className="text-xs font-mono font-bold text-[#1D1D1F] hidden md:inline">
                {item.retainerAmount}
              </span>
              <div>{getStatusBadge(item.status)}</div>
              <ChevronRight className="w-4 h-4 text-[#86868B] opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Footer Action */}
      <div className="pt-3 flex items-center justify-between border-t border-black/[0.04] mt-2">
        <span className="text-xs text-[#86868B]">
          Showing {filtered.length} of {bookings.length} verified matters
        </span>
        <button
          type="button"
          onClick={() => onAddBooking?.()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#007AFF] hover:text-[#0062CC] apple-press cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5 shrink-0" />
          <span>New Intake</span>
        </button>
      </div>
    </div>
  );
}

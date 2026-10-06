"use client";

import React from "react";
import { Plus } from "lucide-react";
import { RECENT_BOOKINGS, RecentBookingItem } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface RecentBookingsProps {
  bookings?: RecentBookingItem[];
  onAddBooking?: () => void;
}

export function RecentBookings({
  bookings = RECENT_BOOKINGS,
  onAddBooking,
}: RecentBookingsProps) {
  return (
    <div className="rounded-[22px] bg-white border border-[#EBEFF3] p-5 shadow-2xs flex flex-col justify-between h-full min-h-[300px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900">
          Recent bookings
        </h3>
        <button
          type="button"
          onClick={onAddBooking}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New booking</span>
        </button>
      </div>

      {/* Bookings List */}
      <div className="flex flex-col divide-y divide-slate-100">
        {bookings.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-3 first:pt-1 last:pb-1 group hover:bg-slate-50/50 rounded-xl px-1.5 transition-colors"
          >
            {/* Left: Avatar + Details */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-2xs ring-2 ring-white shrink-0",
                  item.avatarBg
                )}
              >
                {item.initials}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-slate-900 group-hover:text-[#0A2342] transition-colors leading-tight">
                  {item.name}
                </span>
                <span className="text-xs text-slate-400 font-medium mt-0.5 leading-tight">
                  {item.caseType}
                </span>
              </div>
            </div>

            {/* Right: Status Badge */}
            <div>
              {item.status === "Completed" && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                  Completed
                </span>
              )}
              {item.status === "In Progress" && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
                  In Progress
                </span>
              )}
              {item.status === "Pending" && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                  Pending
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

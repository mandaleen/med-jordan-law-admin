"use client";

import React from "react";
import { Video, Phone, MapPin, Clock } from "lucide-react";
import { Booking } from "@/lib/mock-data";

interface BookingsCalendarProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
}

export function BookingsCalendar({ bookings, onSelectBooking }: BookingsCalendarProps) {
  const days = [
    { dayName: "Monday", dateStr: "Oct 5", dayKey: "2026-10-05" },
    { dayName: "Tuesday (Today)", dateStr: "Oct 6", dayKey: "2026-10-06", isToday: true },
    { dayName: "Wednesday", dateStr: "Oct 7", dayKey: "2026-10-07" },
    { dayName: "Thursday", dateStr: "Oct 8", dayKey: "2026-10-08" },
    { dayName: "Friday", dateStr: "Oct 9", dayKey: "2026-10-09" },
  ];

  return (
    <div className="apple-glass-card p-5 rounded-xl flex flex-col gap-4 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-bold text-navy-900 whitespace-nowrap">Week of October 5 – October 11, 2026</h3>
          <p className="text-xs text-gray-500">Interactive consultation schedule across counsel roster</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-navy-700 font-medium whitespace-nowrap shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-navy-600 shrink-0" /> Video Consultations
          </span>
          <span className="flex items-center gap-1 text-warning font-medium ml-2 whitespace-nowrap shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-warning shrink-0" /> In-Person Sessions
          </span>
          <span className="flex items-center gap-1 text-success font-medium ml-2 whitespace-nowrap shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-success shrink-0" /> Phone Reviews
          </span>
        </div>
      </div>

      {/* 5-Day Columns */}
      <div className="overflow-x-auto pb-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 min-w-[850px]">
          {days.map((col) => {
            const dayBookings = bookings.filter((b) => b.dateStr === col.dayKey);

            return (
              <div
                key={col.dayKey}
                className={`flex flex-col rounded-xl border p-3 min-h-[380px] ${
                  col.isToday
                    ? "bg-navy-50/40 border-navy-300/80 shadow-xs"
                    : "bg-white/80 border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-200/80">
                  <span className={`text-xs font-bold ${col.isToday ? "text-navy-900" : "text-gray-700"}`}>
                    {col.dayName}
                  </span>
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${
                      col.isToday ? "bg-navy-900 text-white font-bold" : "text-gray-400 bg-gray-100"
                    }`}
                  >
                    {col.dateStr}
                  </span>
                </div>

                <div className="flex-1 space-y-2">
                  {dayBookings.length === 0 ? (
                    <div className="h-full flex items-center justify-center py-12">
                      <span className="text-[11px] text-gray-400 font-medium">No consultations</span>
                    </div>
                  ) : (
                    dayBookings.map((b) => {
                      const TypeIcon =
                        b.appointmentType === "Video"
                          ? Video
                          : b.appointmentType === "In-Person"
                          ? MapPin
                          : Phone;

                      return (
                        <div
                          key={b.id}
                          onClick={() => onSelectBooking(b)}
                          className="p-2.5 rounded-lg border bg-white border-gray-200 hover:border-navy-400 hover:shadow-xs transition-all cursor-pointer flex flex-col gap-1.5 text-xs group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-navy-900 truncate group-hover:text-navy-600">
                              {b.clientName}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                                b.status === "Confirmed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : b.status === "Awaiting Acceptance"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {b.status === "Awaiting Acceptance" ? "Awaiting" : b.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                            <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                            <span className="font-mono">{b.timeSlot}</span>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[10.5px]">
                            <span className="flex items-center gap-1 text-gray-600 truncate">
                              <TypeIcon className="w-3 h-3 text-navy-600 shrink-0" />
                              <span className="truncate">{b.appointmentType}</span>
                            </span>
                            <span className="font-mono font-bold text-navy-900 shrink-0">{b.fee}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

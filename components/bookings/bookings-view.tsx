"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  List,
  Search,
  Filter,
  Check,
  X,
  Clock,
  Video,
  Phone,
  MapPin,
  RefreshCw,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  User,
  ExternalLink,
} from "lucide-react";
import { Booking, INITIAL_BOOKINGS } from "@/lib/mock-data";

interface BookingsViewProps {
  onNewBookingClick?: () => void;
  onViewClient?: (clientName: string) => void;
}

export function BookingsView({ onNewBookingClick, onViewClient }: BookingsViewProps) {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Modals state
  const [declineModalBooking, setDeclineModalBooking] = useState<Booking | null>(null);
  const [declineReason, setDeclineReason] = useState("Lawyer schedule conflict of interest");
  
  const [rescheduleModalBooking, setRescheduleModalBooking] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("2026-10-12");
  const [rescheduleTime, setRescheduleTime] = useState("14:00 - 15:00");
  const [rescheduleNote, setRescheduleNote] = useState("");

  const [refundModalBooking, setRefundModalBooking] = useState<Booking | null>(null);
  const [refundReason, setRefundReason] = useState("Client requested cancellation >48h prior");
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 4000);
  };

  // 1. Accept Action
  const handleAccept = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: "Confirmed",
              notes: (b.notes ? b.notes + " · " : "") + "Accepted by office. Automated WhatsApp confirmation sent.",
            }
          : b
      )
    );
    const b = bookings.find((item) => item.id === bookingId);
    showToast(`✓ Booking with ${b?.clientName} accepted. Client notified via WhatsApp & calendar invite issued.`);
  };

  // 2. Decline Action (closes request, auto-notifies, triggers gateway refund)
  const confirmDecline = () => {
    if (!declineModalBooking) return;
    setBookings((prev) =>
      prev.map((b) =>
        b.id === declineModalBooking.id
          ? {
              ...b,
              status: "Declined",
              paymentStatus: "Refunded",
              notes: `Declined by office: ${declineReason}. Gateway refund initiated.`,
            }
          : b
      )
    );
    showToast(`Decline notice and full gateway refund sent to ${declineModalBooking.clientName}. Request closed.`);
    setDeclineModalBooking(null);
  };

  // 3. Reschedule Action (both client-initiated approval & office-initiated edit)
  const confirmReschedule = () => {
    if (!rescheduleModalBooking) return;
    const isClientInitiated = rescheduleModalBooking.status === "Reschedule Requested";

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === rescheduleModalBooking.id) {
          if (isClientInitiated) {
            return {
              ...b,
              status: "Confirmed",
              dateTime: `${b.rescheduleDetails?.requestedDate} at ${b.rescheduleDetails?.requestedTime}`,
              notes: `Client's requested reschedule approved by office.`,
              rescheduleDetails: undefined,
            };
          } else {
            return {
              ...b,
              status: "Confirmed",
              dateTime: `${rescheduleDate} at ${rescheduleTime}`,
              notes: `Office updated consultation time: ${rescheduleNote || "Schedule adjustment"}. Client notification pending confirmation.`,
            };
          }
        }
        return b;
      })
    );

    showToast(`Reschedule confirmed for ${rescheduleModalBooking.clientName}. Notice delivered via WhatsApp.`);
    setRescheduleModalBooking(null);
    setRescheduleNote("");
  };

  // 4. Cancellation & Refund Action (runs through payment gateway, logs to client record & revenue)
  const confirmRefund = () => {
    if (!refundModalBooking) return;
    setBookings((prev) =>
      prev.map((b) =>
        b.id === refundModalBooking.id
          ? {
              ...b,
              status: "Cancelled & Refunded",
              paymentStatus: "Refunded",
              notes: `Cancelled by office. Full refund processed through Gateway (Ref: ${b.transactionId}). Reason: ${refundReason}`,
            }
          : b
      )
    );
    showToast(`Gateway refund of ${refundModalBooking.fee} processed via ${refundModalBooking.transactionId}. Ledger updated.`);
    setRefundModalBooking(null);
  };

  // Filters
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.lawyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.practiceArea.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "awaiting" && b.status === "Awaiting Acceptance") ||
      (statusFilter === "confirmed" && b.status === "Confirmed") ||
      (statusFilter === "reschedule" && b.status === "Reschedule Requested") ||
      (statusFilter === "refunded" && (b.status === "Cancelled & Refunded" || b.status === "Declined"));

    const matchesType = typeFilter === "all" || b.appointmentType.toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Video":
        return <Video className="w-3.5 h-3.5 text-blue-600" />;
      case "Phone":
        return <Phone className="w-3.5 h-3.5 text-emerald-600" />;
      case "In-Person":
        return <MapPin className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "Awaiting Acceptance":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse whitespace-nowrap shrink-0">
            <Clock className="w-3 h-3 shrink-0" />
            Awaiting Acceptance
          </span>
        );
      case "Confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 whitespace-nowrap shrink-0">
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            Confirmed
          </span>
        );
      case "Reschedule Requested":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200 whitespace-nowrap shrink-0">
            <RotateCcw className="w-3 h-3 shrink-0" />
            Reschedule Requested
          </span>
        );
      case "Declined":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200 whitespace-nowrap shrink-0">
            <X className="w-3 h-3 shrink-0" />
            Declined & Refunded
          </span>
        );
      case "Cancelled & Refunded":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap shrink-0">
            <DollarSign className="w-3 h-3 shrink-0" />
            Cancelled & Refunded
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toast Alert */}
      {notificationToast && (
        <div className="p-3 bg-[#0A2342] text-white rounded-xl shadow-lg flex items-center justify-between text-xs font-medium animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{notificationToast}</span>
          </div>
          <button onClick={() => setNotificationToast(null)} className="text-white/60 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header & Controls Rail */}
      <div className="apple-glass-card p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-[#0A2342] text-white flex items-center justify-center font-bold shadow-xs">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] font-bold text-[#0A2342] tracking-tight">Bookings & Consultations</h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#007AFF] border border-blue-200/50">
                {bookings.length} Total
              </span>
            </div>
            <p className="text-[12px] text-slate-400">Intake triage, schedule confirmations & gateway payment refunds</p>
          </div>
        </div>

        {/* View Toggle + Search + Status */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search client, lawyer, area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A2342] text-[#0A2342]"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-[#0A2342] font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="awaiting">Awaiting Acceptance</option>
            <option value="confirmed">Confirmed</option>
            <option value="reschedule">Reschedule Requested</option>
            <option value="refunded">Refunded / Cancelled</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-[#0A2342] font-medium"
          >
            <option value="all">All Types</option>
            <option value="video">Video</option>
            <option value="in-person">In-Person</option>
            <option value="phone">Phone</option>
          </select>

          {/* View Mode Toggle: List vs Calendar */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-white text-[#0A2342] shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              List
            </button>
            <button
              type="button"
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "calendar"
                  ? "bg-white text-[#0A2342] shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: LIST VIEW */}
      {viewMode === "list" && (
        <div className="apple-glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1020px] text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4 whitespace-nowrap">Client</th>
                  <th className="py-3 px-4 whitespace-nowrap">Practice Area & Lawyer</th>
                  <th className="py-3 px-4 whitespace-nowrap">Type</th>
                  <th className="py-3 px-4 whitespace-nowrap">Scheduled Date & Time</th>
                  <th className="py-3 px-4 whitespace-nowrap">Payment & Fee</th>
                  <th className="py-3 px-4 whitespace-nowrap">Status</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No bookings matching current filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        booking.status === "Awaiting Acceptance" ? "bg-amber-50/20" : ""
                      }`}
                    >
                      {/* Client */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          {booking.clientAvatar ? (
                            <img
                              src={booking.clientAvatar}
                              alt={booking.clientName}
                              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-[#0A2342] font-bold text-xs flex items-center justify-center shrink-0">
                              {booking.clientInitials}
                            </div>
                          )}
                          <div className="flex flex-col whitespace-nowrap">
                            <span className="font-bold text-[#0A2342] text-[13px]">{booking.clientName}</span>
                            <span className="text-[11px] text-slate-400">{booking.clientPhone}</span>
                          </div>
                        </div>
                      </td>

                      {/* Lawyer & Practice Area */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col whitespace-nowrap">
                          <span className="font-semibold text-slate-800">{booking.practiceArea}</span>
                          <span className="text-[11px] text-slate-500">Counsel: {booking.lawyerName}</span>
                        </div>
                      </td>

                      {/* Modality Type */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 whitespace-nowrap shrink-0">
                          {getTypeIcon(booking.appointmentType)}
                          {booking.appointmentType}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col whitespace-nowrap">
                          <span className="font-semibold text-[#0A2342]">{booking.dateTime}</span>
                          <span className="text-[11px] text-slate-400">{booking.timeSlot}</span>
                        </div>
                      </td>

                      {/* Payment Status & Fee */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col whitespace-nowrap">
                          <span className="font-bold text-[#0A2342]">{booking.fee}</span>
                          <span
                            className={`text-[10px] font-semibold whitespace-nowrap ${
                              booking.paymentStatus === "Settled"
                                ? "text-emerald-600"
                                : booking.paymentStatus === "Refunded"
                                ? "text-slate-400 line-through"
                                : "text-amber-600"
                            }`}
                          >
                            {booking.paymentStatus === "Settled" ? "✓ Settled via Gateway" : booking.paymentStatus}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">{getStatusBadge(booking.status)}</td>

                      {/* Row Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                          {/* If Awaiting Acceptance */}
                          {booking.status === "Awaiting Acceptance" && (
                            <>
                              <button
                                type="button"
                                onClick={() => setDeclineModalBooking(booking)}
                                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap shrink-0"
                                title="Decline request (triggers refund & auto-notifies client)"
                              >
                                Decline
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAccept(booking.id)}
                                className="px-3 py-1 rounded-lg bg-[#0A2342] text-white hover:bg-blue-900 text-xs font-semibold cursor-pointer transition-colors shadow-xs flex items-center gap-1 whitespace-nowrap shrink-0"
                              >
                                <Check className="w-3 h-3 stroke-[2.5]" />
                                Accept
                              </button>
                            </>
                          )}

                          {/* If Reschedule Requested by Client */}
                          {booking.status === "Reschedule Requested" && (
                            <button
                              type="button"
                              onClick={() => setRescheduleModalBooking(booking)}
                              className="px-2.5 py-1 rounded-lg bg-purple-600 text-white hover:bg-purple-700 text-xs font-semibold cursor-pointer transition-colors shadow-xs flex items-center gap-1 whitespace-nowrap shrink-0"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Review Request
                            </button>
                          )}

                          {/* If Confirmed */}
                          {booking.status === "Confirmed" && (
                            <>
                              <button
                                type="button"
                                onClick={() => setRescheduleModalBooking(booking)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer transition-colors whitespace-nowrap shrink-0"
                                title="Office-initiated reschedule"
                              >
                                Reschedule
                              </button>
                              <button
                                type="button"
                                onClick={() => setRefundModalBooking(booking)}
                                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-500 text-xs font-medium cursor-pointer transition-colors whitespace-nowrap shrink-0"
                                title="Cancel and refund via gateway"
                              >
                                Cancel & Refund
                              </button>
                            </>
                          )}

                          {/* If Already Refunded or Declined */}
                          {(booking.status === "Cancelled & Refunded" || booking.status === "Declined") && (
                            <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">Closed & Logged</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: CALENDAR VIEW */}
      {viewMode === "calendar" && (
        <div className="apple-glass-card p-5 rounded-xl flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-[#0A2342] whitespace-nowrap">Week of October 5 – October 11, 2026</h3>
              <p className="text-xs text-slate-400">Interactive consultation schedule across counsel roster</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-blue-700 font-medium whitespace-nowrap shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" /> Video Consultations
              </span>
              <span className="flex items-center gap-1 text-amber-700 font-medium ml-2 whitespace-nowrap shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" /> In-Person Sessions
              </span>
              <span className="flex items-center gap-1 text-emerald-700 font-medium ml-2 whitespace-nowrap shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" /> Phone Reviews
              </span>
            </div>
          </div>

          {/* 5-Day Columns */}
          <div className="overflow-x-auto pb-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 min-w-[850px]">
              {[
                { dayName: "Monday", dateStr: "Oct 5", dayKey: "2026-10-05" },
                { dayName: "Tuesday (Today)", dateStr: "Oct 6", dayKey: "2026-10-06", isToday: true },
                { dayName: "Wednesday", dateStr: "Oct 7", dayKey: "2026-10-07" },
                { dayName: "Thursday", dateStr: "Oct 8", dayKey: "2026-10-08" },
                { dayName: "Friday", dateStr: "Oct 9", dayKey: "2026-10-09" },
              ].map((col) => {
                const dayBookings = bookings.filter((b) => b.dateStr === col.dayKey);

                return (
                  <div
                    key={col.dayKey}
                    className={`rounded-2xl p-3 flex flex-col gap-2 min-h-[360px] ${
                      col.isToday
                        ? "bg-blue-50/40 border-2 border-blue-200"
                        : "bg-slate-50/70 border border-slate-200/60"
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
                      <span className="text-xs font-bold text-[#0A2342] whitespace-nowrap">{col.dayName}</span>
                      <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">{col.dateStr}</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      {dayBookings.length === 0 ? (
                        <div className="py-12 text-center text-[11px] text-slate-400 italic">
                          No appointments
                        </div>
                      ) : (
                        dayBookings.map((b) => (
                          <div
                            key={b.id}
                            className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col gap-1.5 cursor-pointer"
                            onClick={() => {
                              if (b.status === "Awaiting Acceptance") handleAccept(b.id);
                              else if (b.status === "Reschedule Requested") setRescheduleModalBooking(b);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">{b.timeSlot}</span>
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 whitespace-nowrap shrink-0">
                                {getTypeIcon(b.appointmentType)}
                              </span>
                            </div>

                            <div className="font-bold text-[#0A2342] text-xs truncate">{b.clientName}</div>
                            <div className="text-[10px] text-slate-500 truncate">{b.practiceArea}</div>

                            <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-0.5 gap-2">
                              <span className="text-[10px] font-semibold text-slate-400 truncate min-w-0">{b.lawyerName}</span>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap shrink-0 ${
                                  b.status === "Confirmed"
                                    ? "bg-blue-50 text-blue-700"
                                    : b.status === "Awaiting Acceptance"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {b.status === "Confirmed" ? "Confirmed" : b.status === "Awaiting Acceptance" ? "Triage" : b.status}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: DECLINE BOOKING MODAL */}
      {declineModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0A2342]">Decline Consultation Request</h3>
                <p className="text-xs text-slate-400">Request from {declineModalBooking.clientName}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Declining this request will <strong>automatically notify the client</strong> via WhatsApp and SMS, close
              the file, and initiate a <strong>full gateway refund of {declineModalBooking.fee}</strong> to their original
              card.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Reason for Declining (Sent to Client):</label>
              <select
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-800"
              >
                <option value="Lawyer schedule conflict of interest">Lawyer schedule conflict of interest</option>
                <option value="Practice area out of firm jurisdiction">Practice area out of firm jurisdiction</option>
                <option value="Firm at full litigation capacity for requested dates">Firm at full litigation capacity for requested dates</option>
                <option value="Client documentation incomplete">Client documentation incomplete</option>
              </select>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 flex items-center gap-2 border border-slate-200/60">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Gateway Transaction ID: <strong>{declineModalBooking.transactionId}</strong></span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeclineModalBooking(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
              >
                Keep Request
              </button>
              <button
                type="button"
                onClick={confirmDecline}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs cursor-pointer whitespace-nowrap shrink-0"
              >
                Decline & Issue Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: RESCHEDULE MODAL */}
      {rescheduleModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0A2342]">
                  {rescheduleModalBooking.status === "Reschedule Requested"
                    ? "Review Client-Initiated Reschedule"
                    : "Office-Initiated Reschedule"}
                </h3>
                <p className="text-xs text-slate-400">Consultation with {rescheduleModalBooking.clientName}</p>
              </div>
            </div>

            {rescheduleModalBooking.status === "Reschedule Requested" ? (
              <div className="p-3.5 bg-purple-50/60 border border-purple-200 rounded-xl flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-900">Client's Requested Slot:</span>
                  <span className="px-2 py-0.5 rounded-md bg-purple-200 text-purple-900 font-bold text-[11px]">
                    {rescheduleModalBooking.rescheduleDetails?.requestedDate} at {rescheduleModalBooking.rescheduleDetails?.requestedTime}
                  </span>
                </div>
                <p className="text-purple-800 text-[11px]">
                  <strong>Reason given:</strong> "{rescheduleModalBooking.rescheduleDetails?.reason}"
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-slate-600">
                  Select an updated slot for counsel <strong>{rescheduleModalBooking.lawyerName}</strong>. The client will
                  receive an automated notification to confirm this time or propose an alternative.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700">New Date:</label>
                    <input
                      type="date"
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Time Window:</label>
                    <select
                      value={rescheduleTime}
                      onChange={(e) => setRescheduleTime(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 mt-1"
                    >
                      <option value="10:00 - 11:00">10:00 AM - 11:00 AM</option>
                      <option value="11:30 - 12:30">11:30 AM - 12:30 PM</option>
                      <option value="14:00 - 15:00">02:00 PM - 03:00 PM</option>
                      <option value="16:00 - 17:00">04:00 PM - 05:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Office Note to Client:</label>
                  <textarea
                    placeholder="e.g. Counsel was summoned for urgent court hearing in Palace of Justice."
                    value={rescheduleNote}
                    onChange={(e) => setRescheduleNote(e.target.value)}
                    rows={2}
                    className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 mt-1 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRescheduleModalBooking(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmReschedule}
                className="px-4 py-2 text-xs font-bold bg-[#0A2342] hover:bg-blue-900 text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                {rescheduleModalBooking.status === "Reschedule Requested"
                  ? "Approve Client's New Slot"
                  : "Dispatch Reschedule Notice"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: GATEWAY CANCELLATION & REFUND MODAL */}
      {refundModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0A2342]">Issue Gateway Refund & Cancel</h3>
                <p className="text-xs text-slate-400">{refundModalBooking.clientName} · {refundModalBooking.fee}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This triggers an immediate reversal via the original payment gateway. The transaction will be logged in
              the client's account profile, and subtracted from the office's daily revenue ledger.
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono font-bold text-slate-800">{refundModalBooking.transactionId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Gross Refund Amount:</span>
                <span className="font-bold text-emerald-700">{refundModalBooking.fee}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Gateway Fee Reversed:</span>
                <span className="text-slate-600 font-medium">100% full reversal</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Refund Justification:</label>
              <select
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-800"
              >
                <option value="Client requested cancellation &gt;48h prior">Client requested cancellation &gt;48h prior (Policy 100%)</option>
                <option value="Mutual agreement / emergency postponement">Mutual agreement / emergency postponement</option>
                <option value="Lawyer emergency unavailability">Lawyer emergency unavailability</option>
                <option value="Office fee waiver">Office fee waiver</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRefundModalBooking(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRefund}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                Execute Gateway Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

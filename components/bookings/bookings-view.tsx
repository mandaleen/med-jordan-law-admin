"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  List,
  Search,
  Check,
  X,
  Clock,
  Video,
  Phone,
  MapPin,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  DollarSign,
  Gavel,
  FileCheck,
  Plus,
  MoreHorizontal,
  User,
} from "lucide-react";
import { Booking } from "@/lib/mock-data";
import { usePractice } from "@/lib/practice-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { ConflictReviewModal } from "@/components/modals/conflict-review-modal";
import { PostConsultationModal } from "@/components/modals/post-consultation-modal";
import { SignedAgreementViewerModal } from "@/components/modals/signed-agreement-viewer-modal";
import { DeclineModal } from "@/components/bookings/decline-modal";
import { RescheduleModal } from "@/components/bookings/reschedule-modal";
import { RefundModal } from "@/components/bookings/refund-modal";
import { BookingsCalendar } from "@/components/bookings/bookings-calendar";

interface BookingsViewProps {
  onNewBookingClick?: () => void;
  onViewClient?: (clientName: string) => void;
  onOpenContractFromConsultation?: (clientName: string, notes: string) => void;
}

interface BookingRowActionMenuProps {
  booking: Booking;
  onWrapUp?: () => void;
  onReschedule?: () => void;
  onRefund?: () => void;
  onViewAgreement?: () => void;
  onViewClient?: () => void;
  isNearBottom?: boolean;
}

function BookingRowActionMenu({
  booking,
  onWrapUp,
  onReschedule,
  onRefund,
  onViewAgreement,
  onViewClient,
  isNearBottom = false,
}: BookingRowActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`p-1.5 rounded-lg border transition-all cursor-pointer shadow-2xs ${
          isOpen
            ? "bg-navy-900 text-white border-navy-900 ring-2 ring-navy-900/10"
            : "border-gray-200 text-gray-500 hover:text-navy-900 hover:bg-gray-100 hover:border-gray-300"
        }`}
        title="More booking options"
        aria-label="More booking options"
        aria-expanded={isOpen}
      >
        <MoreHorizontal className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 w-52 bg-white/98 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/90 py-1.5 z-40 text-xs animate-in fade-in duration-150 ${
            isNearBottom ? "bottom-full mb-1.5 origin-bottom-right" : "top-full mt-1.5 origin-top-right"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {onWrapUp && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onWrapUp();
              }}
              className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-emerald-50 text-emerald-900 font-medium transition-colors cursor-pointer"
            >
              <Gavel className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Conclude & Wrap-up</span>
            </button>
          )}

          {onReschedule && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onReschedule();
              }}
              className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-gray-50 text-gray-700 font-medium transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-navy-600 shrink-0" />
              <span>Reschedule Consultation</span>
            </button>
          )}

          {booking.signedAgreementName && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onViewAgreement?.();
              }}
              className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-blue-50/70 text-blue-900 font-medium transition-colors cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>View Signed Agreement (PDF)</span>
            </button>
          )}

          {onViewClient && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onViewClient();
              }}
              className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-gray-50 text-gray-700 font-medium transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span>View Client Profile</span>
            </button>
          )}

          {onRefund && (
            <>
              <div className="my-1 border-t border-gray-100" />
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onRefund();
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-rose-50 text-rose-700 font-medium transition-colors cursor-pointer"
              >
                <DollarSign className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Cancel & Refund Retainer</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function BookingsView({
  onNewBookingClick,
  onViewClient,
  onOpenContractFromConsultation,
}: BookingsViewProps) {
  const {
    bookings,
    acceptBooking,
    declineBooking,
    rescheduleBooking,
    refundBooking,
    clearConflict,
    concludeConsultation,
    openCaseFromConsultation,
    showToast,
  } = usePractice();

  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Modals state
  const [declineModalBooking, setDeclineModalBooking] = useState<Booking | null>(null);
  const [rescheduleModalBooking, setRescheduleModalBooking] = useState<Booking | null>(null);
  const [refundModalBooking, setRefundModalBooking] = useState<Booking | null>(null);
  const [conflictModalBooking, setConflictModalBooking] = useState<Booking | null>(null);
  const [postConsultModalBooking, setPostConsultModalBooking] = useState<Booking | null>(null);
  const [agreementModalBooking, setAgreementModalBooking] = useState<Booking | null>(null);

  // Filtering
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.practiceArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.lawyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.clientEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "confirmed" && b.status === "Confirmed") ||
      (statusFilter === "awaiting" && b.status === "Awaiting Acceptance") ||
      (statusFilter === "reschedule" && b.status === "Reschedule Requested") ||
      (statusFilter === "cancelled" && (b.status === "Cancelled & Refunded" || b.status === "Declined"));

    const matchesType =
      typeFilter === "all" || b.appointmentType.toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesType;
  });

  // Financial & Operational summary metrics
  const totalSettledRevenue = bookings
    .filter((b) => b.paymentStatus === "Settled")
    .reduce((acc, curr) => acc + parseInt(curr.fee.replace(/[^0-9]/g, ""), 10), 0);

  const awaitingCount = bookings.filter((b) => b.status === "Awaiting Acceptance").length;
  const confirmedCount = bookings.filter((b) => b.status === "Confirmed").length;

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full animate-in fade-in duration-200">
      {/* View Switcher, Filter & Search Control Header */}
      <div className="apple-glass-card p-3.5 sm:p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 mb-3">
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-white text-navy-900 shadow-2xs"
                  : "text-gray-500 hover:text-navy-900"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List Ledger</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "calendar"
                  ? "bg-white text-navy-900 shadow-2xs"
                  : "text-gray-500 hover:text-navy-900"
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Week Calendar</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            {awaitingCount > 0 && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
                {awaitingCount} Awaiting Intake
              </span>
            )}
          </div>
        </div>

        {/* Search & Select Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1 sm:flex-none">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search client, email, lawyer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-navy-900 text-gray-900 placeholder:text-gray-400 transition-all"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-navy-900 text-navy-900 font-medium cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="awaiting">Awaiting Acceptance</option>
            <option value="reschedule">Reschedule Requested</option>
            <option value="cancelled">Refunded / Declined</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-navy-900 text-navy-900 font-medium cursor-pointer"
          >
            <option value="all">All Channels</option>
            <option value="video">Video (Encrypted)</option>
            <option value="phone">Phone</option>
            <option value="in-person">In-Person (Office)</option>
          </select>

          {onNewBookingClick && (
            <button
              type="button"
              onClick={onNewBookingClick}
              className="px-3.5 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Consultation</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: LIST VIEW */}
      {viewMode === "list" ? (
        <div className="apple-table-card flex-1 flex flex-col min-h-[460px]">
          <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
              <colgroup>
                <col className="w-[210px]" />
                <col className="w-[190px]" />
                <col className="w-[145px]" />
                <col className="w-[135px]" />
                <col className="w-[145px]" />
                <col className="w-[95px]" />
                <col className="w-[125px]" />
              </colgroup>
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-50/95 backdrop-blur-xs border-b border-gray-200 shadow-2xs">
                  <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-[0.06em] text-gray-500">Client / Contact</th>
                  <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-[0.06em] text-gray-500">Matter / Area</th>
                  <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-[0.06em] text-gray-500">Date & Slot</th>
                  <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-[0.06em] text-gray-500">Counsel Assigned</th>
                  <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-[0.06em] text-gray-500">Status & Conflict</th>
                  <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-[0.06em] text-gray-500">Retainer Fee</th>
                  <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-[0.06em] text-gray-500 text-right pr-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <EmptyState
                        icon={CalendarIcon}
                        title="No bookings match criteria"
                        description={
                          searchQuery
                            ? `No consultations found for "${searchQuery}". Try clearing search keywords or status filters.`
                            : "No consultation bookings found under current filter."
                        }
                        actionLabel={searchQuery || statusFilter !== "all" ? "Reset Filters" : "Schedule Consultation"}
                        onAction={() => {
                          if (searchQuery || statusFilter !== "all") {
                            setSearchQuery("");
                            setStatusFilter("all");
                            setTypeFilter("all");
                          } else if (onNewBookingClick) {
                            onNewBookingClick();
                          }
                        }}
                      />
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking, idx) => {
                    const TypeIcon =
                      booking.appointmentType === "Video"
                        ? Video
                        : booking.appointmentType === "In-Person"
                        ? MapPin
                        : Phone;

                    const isNearBottom = idx >= Math.max(0, filteredBookings.length - 2);

                    return (
                      <tr key={booking.id} className="hover:bg-gray-50/80 transition-colors group">
                        {/* 1. Client / Contact */}
                        <td className="py-4.5 px-4 align-middle">
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar className="h-9 w-9 rounded-xl ring-1 ring-gray-200/80 shadow-2xs shrink-0">
                              <AvatarImage src={booking.clientAvatar} alt={booking.clientName} />
                              <AvatarFallback className="bg-navy-900 text-white text-xs font-semibold rounded-xl">
                                {booking.clientInitials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <button
                                type="button"
                                onClick={() => onViewClient?.(booking.clientName)}
                                className="font-bold text-navy-900 hover:text-navy-600 transition-colors text-xs text-left truncate block cursor-pointer max-w-full"
                              >
                                {booking.clientName}
                              </button>
                              <span className="text-[11px] text-gray-500 truncate block mt-0.5 font-mono">
                                {booking.clientPhone}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Practice Area & Channel */}
                        <td className="py-4.5 px-4 align-middle">
                          <span className="font-semibold text-gray-800 text-xs block truncate" title={booking.practiceArea}>
                            {booking.practiceArea}
                          </span>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className="text-[10px] text-gray-500 inline-flex items-center gap-1 bg-gray-100/90 px-1.5 py-0.5 rounded border border-gray-200/60 font-medium">
                              <TypeIcon className="w-3 h-3 text-navy-600 shrink-0" />
                              <span>{booking.appointmentType}</span>
                            </span>
                            {booking.signedAgreementName && (
                              <button
                                type="button"
                                onClick={() => setAgreementModalBooking(booking)}
                                className="text-[10px] font-medium text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100/80 border border-blue-200/70 rounded px-1.5 py-0.5 inline-flex items-center gap-1 transition-colors cursor-pointer"
                                title="Inspect executed digital signature agreement"
                              >
                                <FileCheck className="w-3 h-3 text-blue-600 shrink-0" />
                                <span>Signed PDF</span>
                              </button>
                            )}
                          </div>
                        </td>

                        {/* 3. Date & Slot */}
                        <td className="py-4.5 px-4 align-middle whitespace-nowrap">
                          <span className="font-semibold text-gray-800 text-xs block">{booking.dateStr}</span>
                          <span className="font-mono text-[11px] text-gray-500 inline-flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                            <span>{booking.timeSlot}</span>
                          </span>
                        </td>

                        {/* 4. Assigned Lawyer */}
                        <td className="py-4.5 px-4 align-middle whitespace-nowrap">
                          <span className="font-semibold text-gray-800 text-xs block">{booking.lawyerName}</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5 font-normal">Senior Chambers</span>
                        </td>

                        {/* 5. Status & Conflict */}
                        <td className="py-4.5 px-4 align-middle whitespace-nowrap">
                          <div className="flex flex-col gap-1 items-start">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border shadow-2xs ${
                                booking.status === "Confirmed"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : booking.status === "Awaiting Acceptance"
                                  ? "bg-amber-50 text-amber-800 border-amber-200"
                                  : booking.status === "Reschedule Requested"
                                  ? "bg-blue-50 text-blue-800 border-blue-200"
                                  : "bg-gray-100 text-gray-700 border-gray-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  booking.status === "Confirmed"
                                    ? "bg-emerald-500"
                                    : booking.status === "Awaiting Acceptance"
                                    ? "bg-amber-500 animate-pulse"
                                    : booking.status === "Reschedule Requested"
                                    ? "bg-blue-500"
                                    : "bg-gray-400"
                                }`}
                              />
                              <span>{booking.status}</span>
                            </span>

                            {booking.conflictCheck && (
                              <button
                                type="button"
                                onClick={() => setConflictModalBooking(booking)}
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border inline-flex items-center gap-1 cursor-pointer transition-colors shadow-2xs ${
                                  booking.conflictCheck.status === "Potential Conflict"
                                    ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                                    : booking.conflictCheck.status === "Waived"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-gray-50 text-gray-600 border-gray-200"
                                }`}
                              >
                                {booking.conflictCheck.status === "Potential Conflict" ? (
                                  <>
                                    <ShieldAlert className="w-3 h-3 text-rose-600 shrink-0" />
                                    <span>Conflict Risk</span>
                                  </>
                                ) : (
                                  <>
                                    <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                                    <span>{booking.conflictCheck.status}</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </td>

                        {/* 6. Retainer Fee */}
                        <td className="py-4.5 px-4 align-middle whitespace-nowrap">
                          <span className="font-mono text-xs font-bold text-navy-900 block tracking-tight">{booking.fee}</span>
                          <span className="text-[10.5px] text-emerald-700 font-semibold block mt-0.5">{booking.paymentStatus}</span>
                        </td>

                        {/* 7. Workflow Actions */}
                        <td className="py-4.5 px-4 text-right align-middle whitespace-nowrap pr-5">
                          <div className="flex items-center justify-end gap-1.5 shrink-0">
                            {/* If Awaiting Acceptance */}
                            {booking.status === "Awaiting Acceptance" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setDeclineModalBooking(booking)}
                                  className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-error/40 text-error hover:bg-error/10 text-xs font-semibold cursor-pointer transition-all shadow-2xs inline-flex items-center gap-1 shrink-0"
                                  title="Decline request (triggers refund & auto-notifies client)"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Decline</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (booking.conflictCheck?.status === "Potential Conflict") {
                                      setConflictModalBooking(booking);
                                    } else {
                                      acceptBooking(booking.id);
                                    }
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-navy-900 text-white hover:bg-navy-800 text-xs font-semibold cursor-pointer transition-all shadow-xs inline-flex items-center gap-1.5 shrink-0"
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>Accept</span>
                                </button>
                              </>
                            )}

                            {/* If Reschedule Requested */}
                            {booking.status === "Reschedule Requested" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setRescheduleModalBooking(booking)}
                                  className="px-3 py-1.5 rounded-lg bg-navy-800 text-white hover:bg-navy-900 text-xs font-semibold cursor-pointer transition-all shadow-xs inline-flex items-center gap-1.5 shrink-0"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Review Request</span>
                                </button>
                                <BookingRowActionMenu
                                  booking={booking}
                                  onReschedule={() => setRescheduleModalBooking(booking)}
                                  onRefund={() => setRefundModalBooking(booking)}
                                  onViewAgreement={() => setAgreementModalBooking(booking)}
                                  onViewClient={() => onViewClient?.(booking.clientName)}
                                  isNearBottom={isNearBottom}
                                />
                              </>
                            )}

                            {/* If Confirmed */}
                            {booking.status === "Confirmed" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setPostConsultModalBooking(booking)}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold cursor-pointer transition-all inline-flex items-center gap-1.5 shrink-0 shadow-2xs"
                                  title="Session outcome & 3-way decision workflow"
                                >
                                  <Gavel className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span>Wrap-up</span>
                                </button>
                                <BookingRowActionMenu
                                  booking={booking}
                                  onWrapUp={() => setPostConsultModalBooking(booking)}
                                  onReschedule={() => setRescheduleModalBooking(booking)}
                                  onRefund={() => setRefundModalBooking(booking)}
                                  onViewAgreement={() => setAgreementModalBooking(booking)}
                                  onViewClient={() => onViewClient?.(booking.clientName)}
                                  isNearBottom={isNearBottom}
                                />
                              </>
                            )}

                            {/* If Already Refunded or Declined */}
                            {(booking.status === "Cancelled & Refunded" || booking.status === "Declined") && (
                              <>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 text-gray-500 text-[11px] font-medium shrink-0">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
                                  <span>Closed</span>
                                </span>
                                <BookingRowActionMenu
                                  booking={booking}
                                  onViewAgreement={() => setAgreementModalBooking(booking)}
                                  onViewClient={() => onViewClient?.(booking.clientName)}
                                  isNearBottom={isNearBottom}
                                />
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer Summary Strip */}
          <div className="bg-gray-50 border-t border-gray-300/80 px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 mt-auto shrink-0">
            <div className="flex items-center gap-4">
              <span>
                Showing <strong className="text-navy-900">{filteredBookings.length}</strong> of {bookings.length} bookings
              </span>
              <span className="hidden sm:inline text-gray-300">•</span>
              <span className="hidden sm:inline">
                Confirmed: <strong className="text-success">{confirmedCount}</strong>
              </span>
              <span className="hidden sm:inline text-gray-300">•</span>
              <span className="hidden sm:inline">
                Awaiting: <strong className="text-warning">{awaitingCount}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Total Settled Fees:</span>
              <span className="font-mono font-bold text-navy-900 text-[13px]">
                ${totalSettledRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW 2: CALENDAR VIEW */
        <BookingsCalendar
          bookings={bookings}
          onSelectBooking={(b) => {
            if (b.status === "Awaiting Acceptance") {
              if (b.conflictCheck?.status === "Potential Conflict") {
                setConflictModalBooking(b);
              } else {
                acceptBooking(b.id);
              }
            } else if (b.status === "Confirmed") {
              setPostConsultModalBooking(b);
            }
          }}
        />
      )}

      {/* MODAL 1: DECLINE MODAL */}
      <DeclineModal
        booking={declineModalBooking}
        onClose={() => setDeclineModalBooking(null)}
        onConfirm={declineBooking}
      />

      {/* MODAL 2: RESCHEDULE MODAL */}
      <RescheduleModal
        booking={rescheduleModalBooking}
        onClose={() => setRescheduleModalBooking(null)}
        onConfirm={rescheduleBooking}
      />

      {/* MODAL 3: REFUND MODAL */}
      <RefundModal
        booking={refundModalBooking}
        onClose={() => setRefundModalBooking(null)}
        onConfirm={refundBooking}
      />

      {/* MODAL 4: CONFLICT REVIEW MODAL */}
      <ConflictReviewModal
        booking={conflictModalBooking}
        onClose={() => setConflictModalBooking(null)}
        onClearConflict={clearConflict}
        onDeclineWithApology={(bookingId, reason) => {
          declineBooking(bookingId, `Conflict apology: ${reason}`);
          setConflictModalBooking(null);
        }}
      />

      {/* MODAL 5: POST CONSULTATION WRAP-UP */}
      <PostConsultationModal
        isOpen={!!postConsultModalBooking}
        onClose={() => setPostConsultModalBooking(null)}
        booking={postConsultModalBooking}
        onOpenCase={(clientName, notes) => {
          openCaseFromConsultation(clientName, notes);
          setPostConsultModalBooking(null);
        }}
        onPrepareFeeContract={(clientName, notes) => {
          onOpenContractFromConsultation?.(clientName, notes);
          setPostConsultModalBooking(null);
        }}
        onConcludeSession={(bookingId, notes) => {
          concludeConsultation(bookingId, notes);
          setPostConsultModalBooking(null);
        }}
      />

      {/* MODAL 6: SIGNED AGREEMENT VIEWER */}
      <SignedAgreementViewerModal
        isOpen={!!agreementModalBooking}
        onClose={() => setAgreementModalBooking(null)}
        documentTitle={`Med Jordan Law — Consultation Retainer (${agreementModalBooking?.clientName})`}
        clientName={agreementModalBooking?.clientName}
        clientPhone={agreementModalBooking?.clientPhone}
        signedDate={agreementModalBooking?.dateTime}
        pdfName={agreementModalBooking?.signedAgreementName}
        onResendWhatsApp={() => {
          showToast(`Signed agreement PDF dispatched to ${agreementModalBooking?.clientPhone} via WhatsApp Business.`);
        }}
      />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Check,
  X,
  UserX,
  Send,
} from "lucide-react";
import { Booking } from "@/lib/mock-data";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ClientAvatar } from "@/components/ui/client-avatar";

interface ConflictReviewModalProps {
  booking: Booking | null;
  onClose: () => void;
  onClearConflict: (bookingId: string, waiverNote: string) => void;
  onDeclineWithApology: (bookingId: string, apologyReason: string) => void;
}

export function ConflictReviewModal({
  booking,
  onClose,
  onClearConflict,
  onDeclineWithApology,
}: ConflictReviewModalProps) {
  const [waiverNote, setWaiverNote] = useState(
    "Counsel reviewed opposing party disclosure. Confirmed no concurrent adverse interest or confidential information crossover under JBA Ethics Code Art. 24."
  );
  const [apologyReason, setApologyReason] = useState(
    "Active adverse representation prevents firm engagement under Jordan Bar Association conflict regulations."
  );
  const [activeTab, setActiveTab] = useState<"review" | "waive" | "apologize">("review");

  if (!booking || !booking.conflictCheck) return null;

  const conflict = booking.conflictCheck;

  return (
    <Dialog open={!!booking} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-xl p-0 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3.5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-white shadow-inner">
              <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold tracking-tight">
                Conflict Review
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-black/20 text-white text-[10px] font-mono font-bold uppercase">
                {conflict.riskSeverity}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 flex flex-col gap-4">
          {/* Summary Strip */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div className="flex items-center gap-2.5">
              <ClientAvatar
                name={booking.clientName}
                src={booking.clientAvatar}
                initials={booking.clientInitials}
                className="w-8 h-8 rounded-lg ring-1 ring-black/10 shrink-0"
                fallbackClassName="text-xs font-bold rounded-lg"
              />
              <div className="min-w-0">
                <span className="font-bold text-[#0A2342] text-xs block truncate">
                  {booking.clientName}
                </span>
                <span className="text-[11px] text-slate-500 block truncate">
                  {booking.practiceArea}
                </span>
              </div>
            </div>
            <div>
              <span className="font-bold text-slate-800 text-xs block">
                {booking.lawyerName}
              </span>
              <span className="text-[11px] text-slate-500">
                {booking.dateTime}
              </span>
            </div>
          </div>

          {/* Adverse Party Match Card */}
          <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Flagged Match:</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-rose-200 text-rose-900 text-[10px] font-bold">
                {conflict.conflictType}
              </span>
            </div>

            <div className="p-2.5 bg-white rounded-lg border border-rose-100 flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Opposing Party:</span>
                <span className="font-bold text-rose-950 font-mono">
                  {conflict.opposingParty}
                </span>
              </div>
              {conflict.matchedEntity && (
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="text-slate-500">Existing Matter:</span>
                  <span className="font-bold text-[#0A2342]">
                    {conflict.matchedEntity}
                  </span>
                </div>
              )}
            </div>

            {conflict.notes && (
              <p className="text-[11px] text-rose-800 leading-relaxed italic">
                &ldquo;{conflict.notes}&rdquo;
              </p>
            )}
          </div>

          {/* Decision Modes */}
          {activeTab === "review" && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Option 1: Clear & Waive */}
              <button
                type="button"
                onClick={() => setActiveTab("waive")}
                className="p-3.5 rounded-xl border border-emerald-500/40 hover:border-emerald-600 bg-emerald-50/30 hover:bg-emerald-50/70 text-left transition-all cursor-pointer flex flex-col gap-1 group"
              >
                <span className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Issue Waiver
                </span>
                <span className="text-[11px] text-emerald-700">Approve and confirm booking</span>
              </button>

              {/* Option 2: Decline */}
              <button
                type="button"
                onClick={() => setActiveTab("apologize")}
                className="p-3.5 rounded-xl border border-rose-400/40 hover:border-rose-600 bg-rose-50/30 hover:bg-rose-50/70 text-left transition-all cursor-pointer flex flex-col gap-1 group"
              >
                <span className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                  <UserX className="w-4 h-4 text-rose-600" />
                  Decline Request
                </span>
                <span className="text-[11px] text-rose-700">Decline and refund fee</span>
              </button>
            </div>
          )}

          {/* Form for Waiver */}
          {activeTab === "waive" && (
            <div className="flex flex-col gap-3 p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Waiver Note:
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab("review")}
                  className="text-[11px] text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Back
                </button>
              </div>
              <textarea
                rows={3}
                value={waiverNote}
                onChange={(e) => setWaiverNote(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-emerald-300 rounded-lg text-slate-800 focus:outline-none"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("review")}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => onClearConflict(booking.id, waiverNote)}
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  Confirm Waiver
                </button>
              </div>
            </div>
          )}

          {/* Form for Apology */}
          {activeTab === "apologize" && (
            <div className="flex flex-col gap-3 p-4 rounded-xl bg-rose-50/50 border border-rose-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <UserX className="w-4 h-4 text-rose-600" />
                  Decline Reason:
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab("review")}
                  className="text-[11px] text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Back
                </button>
              </div>
              <textarea
                rows={3}
                value={apologyReason}
                onChange={(e) => setApologyReason(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-rose-300 rounded-lg text-slate-800 focus:outline-none"
              />
              <div className="p-2.5 bg-white rounded-lg border border-rose-100 text-[11px] text-slate-600 flex items-center justify-between">
                <span>Refund Amount: <strong>{booking.fee}</strong></span>
                <span className="text-emerald-700 font-bold">Automatic</span>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("review")}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => onDeclineWithApology(booking.id, apologyReason)}
                  className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Decline & Refund
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import React, { useState } from "react";
import {
  Briefcase,
  FileCheck,
  CheckCircle2,
  X,
  ArrowRight,
  Gavel,
} from "lucide-react";
import { Booking, UpcomingConsultationItem } from "@/lib/mock-data";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PostConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: Booking | UpcomingConsultationItem | null;
  onOpenCase: (clientName: string, notes: string) => void;
  onPrepareFeeContract: (clientName: string, notes: string) => void;
  onConcludeSession: (bookingId: string, notes: string) => void;
}

export function PostConsultationModal({
  isOpen,
  onClose,
  booking,
  onOpenCase,
  onPrepareFeeContract,
  onConcludeSession,
}: PostConsultationModalProps) {
  const [lawyerNotes, setLawyerNotes] = useState(
    "Counsel met with client to analyze jurisdictional documents, prospective defense merits, and preliminary evidence."
  );
  const [clientObjectives, setClientObjectives] = useState(
    "Client seeks formal representation and expedited court filings before the commercial chamber."
  );
  const [selectedDecision, setSelectedDecision] = useState<"case" | "contract" | "conclude">("contract");

  if (!isOpen || !booking) return null;

  const clientName = booking.clientName;
  const practiceArea = booking.practiceArea;
  const lawyerName = booking.lawyerName;

  const handleExecute = () => {
    if (selectedDecision === "case") {
      onOpenCase(clientName, lawyerNotes);
    } else if (selectedDecision === "contract") {
      onPrepareFeeContract(clientName, lawyerNotes);
    } else {
      onConcludeSession(booking.id, lawyerNotes);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-2xl p-0 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-[#0A2342] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center font-bold">
              <Gavel className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                Post-Consultation Lawyer Decision Flow
              </h3>
              <p className="text-xs text-slate-300">
                Session wrap-up & triage decision (Page 8 · بعد الاستشارة)
              </p>
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-5">
          {/* Appointment Meta Strip */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Client</span>
              <span className="font-bold text-[#0A2342] text-sm block mt-0.5">{clientName}</span>
              <span className="text-[11px] text-slate-500">{practiceArea}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Counsel</span>
              <span className="font-bold text-slate-800 text-sm block mt-0.5">{lawyerName}</span>
              <span className="text-[11px] text-emerald-700 font-semibold">Consultation Delivered</span>
            </div>
          </div>

          {/* Lawyer Session Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">
              1. Session Summary & Legal Advice Given (الملاحظات والنتيجة):
            </label>
            <textarea
              rows={3}
              value={lawyerNotes}
              onChange={(e) => setLawyerNotes(e.target.value)}
              placeholder="Record legal analysis, merits of the case, and preliminary counsel advice..."
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0A2342]"
            />
          </div>

          {/* Client Objectives */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">
              2. Client Objectives & Immediate Milestones:
            </label>
            <textarea
              rows={2}
              value={clientObjectives}
              onChange={(e) => setClientObjectives(e.target.value)}
              placeholder="e.g. Urgent injunction petition, commercial arbitration clause enforcement..."
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0A2342]"
            />
          </div>

          {/* 3 Branching Decisions */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700">
              3. Determine Next Operational Step (تحديد الخطوة التالية):
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {/* Option A: Open Case File */}
              <div
                onClick={() => setSelectedDecision("case")}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                  selectedDecision === "case"
                    ? "border-[#0A2342] bg-blue-50/50 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                    صفحة 9
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-[#0A2342] text-xs">Open Litigation Case</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                    Assign counsel, establish court chamber, and provision shared document vault.
                  </p>
                </div>
              </div>

              {/* Option B: Issue Fee Agreement */}
              <div
                onClick={() => setSelectedDecision("contract")}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                  selectedDecision === "contract"
                    ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    صفحة 10
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 text-xs">Fee Agreement (عقد أتعاب)</h4>
                  <p className="text-[10px] text-emerald-800 mt-1 leading-normal">
                    Prepare contract from firm template and dispatch for client e-signature.
                  </p>
                </div>
              </div>

              {/* Option C: Conclude Session */}
              <div
                onClick={() => setSelectedDecision("conclude")}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                  selectedDecision === "conclude"
                    ? "border-slate-800 bg-slate-100 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                    إنهاء
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Conclude Session Only</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                    Advisory session complete. Retain legal log and financial invoice in vault.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleExecute}
            className="px-5 py-2 text-xs font-bold bg-[#0A2342] hover:bg-blue-900 text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-2"
          >
            <span>Proceed with Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

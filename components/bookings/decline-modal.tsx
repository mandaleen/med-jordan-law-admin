"use client";

import React, { useState } from "react";
import { AlertTriangle, DollarSign } from "lucide-react";
import { Booking } from "@/lib/mock-data";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface DeclineModalProps {
  booking: Booking | null;
  onClose: () => void;
  onConfirm: (bookingId: string, reason: string) => void;
}

export function DeclineModal({ booking, onClose, onConfirm }: DeclineModalProps) {
  const [reason, setReason] = useState("Lawyer schedule conflict of interest");

  if (!booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(booking.id, reason);
    onClose();
  };

  return (
    <Dialog open={!!booking} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-md p-6 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-error/10 text-error flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-navy-900">Decline Request</h3>
            <p className="text-xs text-gray-500">
              {booking.clientName} · {booking.fee} Retainer
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          The client will be notified and refunded the <strong className="text-navy-900 font-bold">{booking.fee}</strong> consultation fee.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700">Reason:</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 text-xs border border-gray-300 rounded-xl bg-gray-50 text-gray-900 focus:outline-none"
            >
              <option value="Lawyer schedule conflict of interest">Schedule conflict</option>
              <option value="Practice area out of firm jurisdiction">Out of practice area</option>
              <option value="Firm at full litigation capacity for requested dates">
                At full capacity
              </option>
              <option value="Client documentation incomplete">Incomplete documentation</option>
            </select>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl text-[11px] text-gray-700 flex items-center gap-2 border border-gray-200">
            <DollarSign className="w-4 h-4 text-success shrink-0" />
            <span>
              Transaction ID: <strong className="font-mono">{booking.transactionId}</strong>
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-xl cursor-pointer whitespace-nowrap shrink-0 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-error hover:bg-error/90 text-white rounded-xl shadow-xs cursor-pointer whitespace-nowrap shrink-0 transition-colors"
            >
              Decline & Refund
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import React, { useState } from "react";
import { DollarSign } from "lucide-react";
import { Booking } from "@/lib/mock-data";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface RefundModalProps {
  booking: Booking | null;
  onClose: () => void;
  onConfirm: (bookingId: string, reason: string) => void;
}

export function RefundModal({ booking, onClose, onConfirm }: RefundModalProps) {
  const [reason, setReason] = useState("Client requested cancellation >48h prior");

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
          <div className="w-10 h-10 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-navy-900">Refund & Cancel</h3>
            <p className="text-xs text-gray-500">
              {booking.clientName} · {booking.fee}
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-700 leading-relaxed">
          Reverses the fee via the payment gateway and logs the transaction.
        </p>

        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Transaction ID:</span>
            <span className="font-mono font-bold text-navy-900">{booking.transactionId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Refund Amount:</span>
            <span className="font-bold text-success">{booking.fee}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Reversal:</span>
            <span className="text-gray-700 font-medium">100% Full</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700">Reason:</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 text-xs border border-gray-300 rounded-xl bg-gray-50 text-gray-900 focus:outline-none"
            >
              <option value="Client requested cancellation >48h prior">
                Client cancellation (&gt;48h)
              </option>
              <option value="Mutual agreement / emergency postponement">
                Mutual agreement
              </option>
              <option value="Lawyer emergency unavailability">Lawyer unavailable</option>
              <option value="Office fee waiver">Fee waiver</option>
            </select>
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
              className="px-4 py-2 text-xs font-bold bg-error hover:bg-error/90 text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
            >
              Issue Refund
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

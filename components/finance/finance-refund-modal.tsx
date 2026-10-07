"use client";

import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import { FinanceTransaction } from "@/lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface FinanceRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: FinanceTransaction | null;
  onConfirmRefund: (
    txnId: string,
    amountToRefund: number,
    reason: string,
    isPartial: boolean
  ) => void;
}

export function FinanceRefundModal({
  isOpen,
  onClose,
  transaction,
  onConfirmRefund,
}: FinanceRefundModalProps) {
  const [refundAmountType, setRefundAmountType] = useState<"full" | "partial">("full");
  const [partialAmount, setPartialAmount] = useState("");
  const [refundReason, setRefundReason] = useState("Client requested cancellation >48h prior");

  if (!transaction) return null;

  const handleExecute = () => {
    const isPartial = refundAmountType === "partial" && parseFloat(partialAmount) > 0;
    const amountToRefund = isPartial ? parseFloat(partialAmount) : transaction.grossAmount;
    onConfirmRefund(transaction.id, amountToRefund, refundReason, isPartial);
    onClose();
    setPartialAmount("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-full p-6">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-navy-900">Issue Gateway Refund</DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Ref: {transaction.txnRef} · {transaction.clientName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Service:</span>
              <span className="font-semibold text-slate-800">{transaction.service}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Original Gross Amount:</span>
              <span className="font-bold text-slate-900">${transaction.grossAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Gateway Method:</span>
              <span className="text-slate-700">{transaction.paymentMethod}</span>
            </div>
          </div>

          {/* Refund Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Refund Type:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRefundAmountType("full")}
                className={`p-2 rounded-xl text-xs font-bold border cursor-pointer ${
                  refundAmountType === "full"
                    ? "bg-navy-900 text-white border-navy-900"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                Full (${transaction.grossAmount.toFixed(2)})
              </button>
              <button
                type="button"
                onClick={() => setRefundAmountType("partial")}
                className={`p-2 rounded-xl text-xs font-bold border cursor-pointer ${
                  refundAmountType === "partial"
                    ? "bg-navy-900 text-white border-navy-900"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                Partial Refund
              </button>
            </div>
          </div>

          {refundAmountType === "partial" && (
            <div>
              <label className="text-xs font-bold text-slate-700">Partial Amount ($):</label>
              <input
                type="number"
                placeholder="e.g. 50.00"
                value={partialAmount}
                onChange={(e) => setPartialAmount(e.target.value)}
                className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 mt-1 focus:outline-none focus:ring-1 focus:ring-navy-900"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Reason for Refund:</label>
            <select
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-navy-900"
            >
              <option value="Client requested cancellation >48h prior">Client requested cancellation &gt;48h prior</option>
              <option value="Mutual agreement / emergency postponement">Mutual agreement / emergency postponement</option>
              <option value="Lawyer emergency unavailability">Lawyer emergency unavailability</option>
              <option value="Billing discrepancy correction">Billing discrepancy correction</option>
            </select>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer whitespace-nowrap shrink-0 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExecute}
            className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs cursor-pointer whitespace-nowrap shrink-0 transition-colors"
          >
            Execute Refund
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

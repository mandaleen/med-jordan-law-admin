"use client";

import React, { useState } from "react";
import { RotateCcw, Check } from "lucide-react";
import { Booking } from "@/lib/mock-data";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface RescheduleModalProps {
  booking: Booking | null;
  onClose: () => void;
  onConfirm: (bookingId: string, date: string, time: string, note: string) => void;
}

export function RescheduleModal({ booking, onClose, onConfirm }: RescheduleModalProps) {
  const [rescheduleDate, setRescheduleDate] = useState("2026-10-12");
  const [rescheduleTime, setRescheduleTime] = useState("14:00 - 15:00");
  const [rescheduleNote, setRescheduleNote] = useState("");

  if (!booking) return null;

  const isClientInitiated = booking.status === "Reschedule Requested";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isClientInitiated && booking.rescheduleDetails) {
      onConfirm(
        booking.id,
        booking.rescheduleDetails.requestedDate,
        booking.rescheduleDetails.requestedTime,
        "Approved client requested slot"
      );
    } else {
      onConfirm(booking.id, rescheduleDate, rescheduleTime, rescheduleNote);
    }
    onClose();
  };

  return (
    <Dialog open={!!booking} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-lg p-6 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-navy-50 text-navy-600 flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-navy-900">
              {isClientInitiated ? "Review Client-Initiated Reschedule" : "Office-Initiated Reschedule"}
            </h3>
            <p className="text-xs text-gray-500">Consultation with {booking.clientName}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isClientInitiated ? (
            <div className="p-3.5 bg-navy-50 border border-navy-200 rounded-xl flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-navy-950">Client&apos;s Requested Slot:</span>
                <span className="px-2 py-0.5 rounded-md bg-navy-200 text-navy-950 font-bold text-[11px]">
                  {booking.rescheduleDetails?.requestedDate} at {booking.rescheduleDetails?.requestedTime}
                </span>
              </div>
              <p className="text-navy-900 text-[11px]">
                <strong>Reason given:</strong> &ldquo;{booking.rescheduleDetails?.reason}&rdquo;
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-gray-700">
                Select an updated slot for counsel <strong>{booking.lawyerName}</strong>. The client will receive an
                automated notification to confirm this time or propose an alternative.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700">New Date:</label>
                  <input
                    type="date"
                    required
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full p-2 text-xs border border-gray-300 rounded-xl bg-gray-50 mt-1 focus:outline-none focus:ring-1 focus:ring-navy-600 text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700">Time Window:</label>
                  <select
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full p-2 text-xs border border-gray-300 rounded-xl bg-gray-50 mt-1 focus:outline-none text-gray-900"
                  >
                    <option value="10:00 - 11:00">10:00 AM - 11:00 AM</option>
                    <option value="11:30 - 12:30">11:30 AM - 12:30 PM</option>
                    <option value="14:00 - 15:00">02:00 PM - 03:00 PM</option>
                    <option value="16:00 - 17:00">04:00 PM - 05:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Office Note to Client:</label>
                <textarea
                  placeholder="e.g. Counsel was summoned for urgent court hearing in Palace of Justice."
                  value={rescheduleNote}
                  onChange={(e) => setRescheduleNote(e.target.value)}
                  rows={2}
                  className="w-full p-2 text-xs border border-gray-300 rounded-xl bg-gray-50 mt-1 focus:outline-none focus:ring-1 focus:ring-navy-600 text-gray-900"
                />
              </div>
            </div>
          )}

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
              className="px-4 py-2 text-xs font-bold bg-navy-900 hover:bg-navy-800 text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              {isClientInitiated ? "Approve Client's New Slot" : "Dispatch Reschedule Notice"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

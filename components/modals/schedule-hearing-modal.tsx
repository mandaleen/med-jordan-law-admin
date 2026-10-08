"use client";

import React, { useState } from "react";
import {
  Gavel,
  X,
  Bell,
} from "lucide-react";
import { HearingItem } from "@/lib/mock-data";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ScheduleHearingModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseNumber?: string;
  onSchedule: (newHearing: HearingItem) => void;
}

export function ScheduleHearingModal({
  isOpen,
  onClose,
  caseNumber = "MJL-2026-089",
  onSchedule,
}: ScheduleHearingModalProps) {
  const [date, setDate] = useState("2026-11-18");
  const [time, setTime] = useState("10:30 AM");
  const [chamber, setChamber] = useState("Amman Court of Appeal - Commercial Chamber 3");
  const [judge, setJudge] = useState("Hon. Judge Ziad Al-Khasawneh");
  const [enableReminders, setEnableReminders] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newHearing: HearingItem = {
      id: `h-${Date.now()}`,
      date,
      time,
      chamber,
      judge,
      remindersSent: enableReminders,
      reminderTimestamp: enableReminders ? "Scheduled 48h prior via WhatsApp & SMS" : undefined,
      status: "Upcoming",
    };

    onSchedule(newHearing);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-lg p-6 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col gap-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-navy-50 text-navy-950 border border-navy-100 flex items-center justify-center font-bold">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-950">Schedule Hearing</h3>
              <p className="text-xs text-gray-500">Matter {caseNumber}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-navy-900 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-gray-700">Date:</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-200/90 rounded-lg mt-1 text-gray-800 font-medium focus:outline-none focus:border-navy-950 focus:ring-1 focus:ring-navy-950/20 transition-colors"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700">Time:</label>
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-200/90 rounded-lg mt-1 text-gray-800 font-medium focus:outline-none focus:border-navy-950 focus:ring-1 focus:ring-navy-950/20 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-700">Chamber:</label>
            <select
              value={chamber}
              onChange={(e) => setChamber(e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-200/90 rounded-lg mt-1 text-gray-800 focus:outline-none focus:border-navy-950 focus:ring-1 focus:ring-navy-950/20 transition-colors"
            >
              <option value="Amman Court of Appeal - Commercial Chamber 3">Amman Court of Appeal - Commercial Chamber 3</option>
              <option value="Amman Court of First Instance - Chamber 5">Amman Court of First Instance - Chamber 5</option>
              <option value="Palace of Justice - Urgent Matters Chamber">Palace of Justice - Urgent Matters Chamber</option>
              <option value="Companies Controller Directorate Hearing Room B">Companies Controller Directorate Hearing Room B</option>
              <option value="Jordanian Arbitration Chamber (Amman Center)">Jordanian Arbitration Chamber (Amman Center)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-gray-700">Judge / Arbitrator:</label>
            <input
              type="text"
              required
              placeholder="e.g. Hon. Judge Ziad Al-Khasawneh"
              value={judge}
              onChange={(e) => setJudge(e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-200/90 rounded-lg mt-1 text-gray-800 focus:outline-none focus:border-navy-950 focus:ring-1 focus:ring-navy-950/20 transition-colors"
            />
          </div>

          {/* Automated Reminders */}
          <div className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-navy-800 shrink-0" />
              <div>
                <span className="font-semibold text-gray-900">Reminders</span>
                <p className="text-[11px] text-gray-500">
                  Notify client and counsel 48h prior via WhatsApp & SMS.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={enableReminders}
                onChange={(e) => setEnableReminders(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-navy-950" />
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-navy-950 hover:bg-navy-900 text-white rounded-full shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <Gavel className="w-3.5 h-3.5" />
              Schedule Hearing
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

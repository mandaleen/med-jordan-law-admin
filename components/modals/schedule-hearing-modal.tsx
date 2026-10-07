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
        className="max-w-lg p-6 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col gap-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0A2342] flex items-center justify-center font-bold">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0A2342]">Schedule Court Hearing (جلسة محاكمة)</h3>
              <p className="text-xs text-slate-400">Court calendar docket for matter {caseNumber} (Page 9)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700">Hearing Date:</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl mt-1 text-slate-800 font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700">Docket Time:</label>
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl mt-1 text-slate-800 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700">Presiding Court Chamber (المحكمة والغرفة):</label>
            <select
              value={chamber}
              onChange={(e) => setChamber(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl mt-1 text-slate-800"
            >
              <option value="Amman Court of Appeal - Commercial Chamber 3">Amman Court of Appeal - Commercial Chamber 3</option>
              <option value="Amman Court of First Instance - Chamber 5">Amman Court of First Instance - Chamber 5</option>
              <option value="Palace of Justice - Urgent Matters Chamber">Palace of Justice - Urgent Matters Chamber</option>
              <option value="Companies Controller Directorate Hearing Room B">Companies Controller Directorate Hearing Room B</option>
              <option value="Jordanian Arbitration Chamber (Amman Center)">Jordanian Arbitration Chamber (Amman Center)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700">Presiding Judge / Arbitrator:</label>
            <input
              type="text"
              required
              placeholder="e.g. Hon. Judge Ziad Al-Khasawneh"
              value={judge}
              onChange={(e) => setJudge(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl mt-1 text-slate-800"
            />
          </div>

          {/* Automated Reminders */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-800">Automated WhatsApp & SMS Reminders</span>
                <p className="text-[11px] text-slate-400">
                  Sends reminder notification to client and lead counsel 48 hours prior to hearing docket.
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
              <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0A2342]" />
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-[#0A2342] hover:bg-blue-900 text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Gavel className="w-3.5 h-3.5" />
              Schedule Hearing Docket
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

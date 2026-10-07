"use client";

import React, { useState } from "react";
import { Gavel } from "lucide-react";
import { HearingItem } from "@/lib/mock-data";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface HearingOutcomeModalProps {
  hearing: HearingItem | null;
  onClose: () => void;
  onSave: (hearingId: string, outcomeText: string) => void;
}

function HearingOutcomeForm({
  hearing,
  onClose,
  onSave,
}: {
  hearing: HearingItem;
  onClose: () => void;
  onSave: (hearingId: string, outcomeText: string) => void;
}) {
  const [outcomeText, setOutcomeText] = useState(hearing.outcome || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outcomeText.trim()) return;
    onSave(hearing.id, outcomeText.trim());
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-700">Official Outcome / Bench Ruling:</label>
        <textarea
          rows={3}
          required
          placeholder="e.g. Adjourned to Nov 12 for expert witness cross-examination; evidence accepted by court."
          value={outcomeText}
          onChange={(e) => setOutcomeText(e.target.value)}
          className="w-full p-2.5 text-xs border border-gray-300 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-1 focus:ring-navy-600"
        />
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
          className="px-4 py-2 text-xs font-bold bg-navy-900 hover:bg-navy-800 text-white rounded-xl shadow-xs cursor-pointer whitespace-nowrap shrink-0 transition-colors"
        >
          Record Outcome
        </button>
      </div>
    </form>
  );
}

export function HearingOutcomeModal({ hearing, onClose, onSave }: HearingOutcomeModalProps) {
  if (!hearing) return null;

  return (
    <Dialog open={!!hearing} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-md p-6 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-navy-50 text-navy-700 flex items-center justify-center shrink-0">
            <Gavel className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-navy-900">Log Hearing Outcome</h3>
            <p className="text-xs text-gray-500">
              {hearing.date} · {hearing.chamber}
            </p>
          </div>
        </div>

        <HearingOutcomeForm key={hearing.id} hearing={hearing} onClose={onClose} onSave={onSave} />
      </DialogContent>
    </Dialog>
  );
}

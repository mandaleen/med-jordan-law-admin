"use client";

import React, { useState } from "react";
import { Gavel, X } from "lucide-react";
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
      <div className="flex flex-col gap-1.5">
        <label className="font-semibold text-gray-700">Outcome:</label>
        <textarea
          rows={3}
          required
          placeholder="e.g. Adjourned to Nov 12 for expert witness cross-examination; evidence accepted by court."
          value={outcomeText}
          onChange={(e) => setOutcomeText(e.target.value)}
          className="w-full p-2.5 text-xs border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-navy-900 transition-colors"
        />
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="px-3.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-1.5 text-xs font-medium bg-navy-950 hover:bg-navy-900 text-white rounded-full shadow-2xs cursor-pointer transition-colors"
        >
          Save
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
        className="max-w-md p-6 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col gap-4 animate-in fade-in duration-200"
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-navy-50 text-navy-900 border border-navy-100 flex items-center justify-center font-bold shrink-0">
              <Gavel className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-tight">
                Log Outcome
              </h3>
              <p className="text-xs text-gray-500">
                {hearing.date} · {hearing.chamber}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <HearingOutcomeForm key={hearing.id} hearing={hearing} onClose={onClose} onSave={onSave} />
      </DialogContent>
    </Dialog>
  );
}

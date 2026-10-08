"use client";

import React, { useState } from "react";
import { X, Scale } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    clientName: string;
    title: string;
    assignedLawyer: string;
    practiceArea: string;
  }) => void;
}

export function NewCaseModal({ isOpen, onClose, onSubmit }: NewCaseModalProps) {
  const [clientName, setClientName] = useState("");
  const [title, setTitle] = useState("");
  const [assignedLawyer, setAssignedLawyer] = useState("Tariq Qudah");
  const [practiceArea, setPracticeArea] = useState("Commercial Litigation");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !title.trim()) return;

    onSubmit({
      clientName: clientName.trim(),
      title: title.trim(),
      assignedLawyer,
      practiceArea,
    });

    setClientName("");
    setTitle("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-lg p-6 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col gap-4 animate-in fade-in duration-200"
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-navy-50 text-navy-900 border border-navy-100 flex items-center justify-center font-bold shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-tight">
                New Case
              </h3>
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
          <div>
            <label className="font-semibold text-gray-700 block mb-1">
              Client:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sara Odeh"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-navy-900 transition-colors"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">
              Title:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Shareholder Dispute"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-navy-900 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                Counsel:
              </label>
              <select
                value={assignedLawyer}
                onChange={(e) => setAssignedLawyer(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-navy-900 transition-colors cursor-pointer"
              >
                <option value="Tariq Qudah">Tariq Qudah</option>
                <option value="Sara Al-Majali">Sara Al-Majali</option>
                <option value="Kareem Masri">Kareem Masri</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                Area:
              </label>
              <select
                value={practiceArea}
                onChange={(e) => setPracticeArea(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-navy-900 transition-colors cursor-pointer"
              >
                <option value="Corporate & M&A">Corporate & M&A</option>
                <option value="Commercial Litigation">Commercial Litigation</option>
                <option value="Real Estate & Construction">Real Estate & Construction</option>
                <option value="Patent & IP">Patent & IP</option>
                <option value="Commercial Arbitration">Commercial Arbitration</option>
              </select>
            </div>
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
              Create Case
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

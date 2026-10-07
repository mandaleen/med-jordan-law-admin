"use client";

import React, { useState } from "react";
import { Briefcase } from "lucide-react";
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
        className="max-w-lg p-6 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-navy-50 text-navy-900 flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-navy-900">Open Case from Consultation</h3>
            <p className="text-xs text-gray-500">Convert intake consultation into active legal matter</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-bold text-gray-700">Client / Company Name:</label>
            <input
              type="text"
              required
              placeholder="e.g. Sara Odeh (Odeh Industrial Group)"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full p-2 text-xs border border-gray-300 rounded-xl bg-gray-50 mt-1 focus:outline-none focus:ring-1 focus:ring-navy-600 text-gray-900"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700">Matter Title / Dispute:</label>
            <input
              type="text"
              required
              placeholder="e.g. Commercial Shareholder Restructuring & Asset Defense"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 text-xs border border-gray-300 rounded-xl bg-gray-50 mt-1 focus:outline-none focus:ring-1 focus:ring-navy-600 text-gray-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700">Assigned Lead Counsel:</label>
              <select
                value={assignedLawyer}
                onChange={(e) => setAssignedLawyer(e.target.value)}
                className="w-full p-2 text-xs border border-gray-300 rounded-xl bg-gray-50 mt-1 text-gray-900 focus:outline-none"
              >
                <option value="Tariq Qudah">Tariq Qudah (Senior Partner)</option>
                <option value="Sara Al-Majali">Sara Al-Majali (Partner)</option>
                <option value="Kareem Masri">Kareem Masri (Senior Associate)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700">Practice Area:</label>
              <select
                value={practiceArea}
                onChange={(e) => setPracticeArea(e.target.value)}
                className="w-full p-2 text-xs border border-gray-300 rounded-xl bg-gray-50 mt-1 text-gray-900 focus:outline-none"
              >
                <option value="Corporate & M&A">Corporate & M&A</option>
                <option value="Commercial Litigation">Commercial Litigation</option>
                <option value="Real Estate & Construction">Real Estate & Construction</option>
                <option value="Patent & IP">Patent & IP</option>
              </select>
            </div>
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
              Open Case Matter
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

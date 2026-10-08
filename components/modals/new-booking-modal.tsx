"use client";

import React, { useState } from "react";
import { Calendar, Clock, User, DollarSign, Check } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (booking: {
    name: string;
    caseType: string;
    date: string;
    time: string;
    fee: string;
  }) => void;
}

export function NewBookingModal({
  isOpen,
  onClose,
  onSubmit,
}: NewBookingModalProps) {
  const [clientName, setClientName] = useState("");
  const [caseCategory, setCaseCategory] = useState("Commercial");
  const [date, setDate] = useState("2026-10-07");
  const [time, setTime] = useState("14:00");
  const [retainerFee, setRetainerFee] = useState("3500");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const categories = ["Commercial", "Real Estate", "Patent & IP", "Labor"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      onSubmit({
        name: clientName,
        caseType: `${caseCategory} Legal Consultation`,
        date,
        time,
        fee: `$${retainerFee}`,
      });
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-lg p-0 bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-xl shadow-[0_24px_60px_rgba(10,35,66,0.18),0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden"
      >
        {/* Sheet Header */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-gray-100">
          <button
            type="button"
            onClick={() => {
              onClose();
            }}
            className="text-sm font-medium text-gray-500 hover:text-navy-900 press whitespace-nowrap shrink-0"
          >
            Cancel
          </button>
          <div className="text-center">
            <h3 className="text-base font-semibold text-navy-900 tracking-tight whitespace-nowrap">
              New Booking
            </h3>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!clientName.trim() || isSubmitting}
            className="text-sm font-semibold text-navy-600 hover:text-navy-700 disabled:opacity-40 disabled:cursor-not-allowed press whitespace-nowrap shrink-0"
          >
            Save
          </button>
        </div>

        {/* Sheet Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Client Name Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 tracking-wider uppercase mb-1.5 px-1">
              Client
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Client name"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100 focus:bg-white border border-gray-300 focus:border-navy-900 rounded-lg text-sm font-medium text-navy-900 placeholder:text-gray-400 focus:outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Segmented Category Picker */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 tracking-wider uppercase mb-1.5 px-1">
              Area
            </label>
            <div className="grid grid-cols-4 p-1 bg-gray-100 border border-gray-300 rounded-lg gap-1">
              {categories.map((cat) => {
                const isSelected = caseCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCaseCategory(cat);
                    }}
                    className={`py-1.5 px-2 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      isSelected
                        ? "bg-white text-navy-900 font-semibold shadow-xs"
                        : "text-gray-500 hover:text-navy-900"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date and Time Group */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 tracking-wider uppercase mb-1.5 px-1 whitespace-nowrap">
                Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 focus:border-navy-900 rounded-lg text-sm font-medium text-navy-900 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 tracking-wider uppercase mb-1.5 px-1 whitespace-nowrap">
                Time
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 focus:border-navy-900 rounded-lg text-sm font-medium text-navy-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Retainer Fee Estimate */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 tracking-wider uppercase mb-1.5 px-1 whitespace-nowrap">
              Fee
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="number"
                value={retainerFee}
                onChange={(e) => setRetainerFee(e.target.value)}
                placeholder="3500"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 focus:border-navy-900 rounded-lg text-sm font-medium text-navy-900 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Primary CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!clientName.trim() || isSubmitting}
              className="w-full py-2.5 rounded-lg bg-navy-900 hover:bg-navy-950 text-white text-sm font-semibold shadow-sm border border-navy-900 transition-all press disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              {isSubmitting ? (
                <span className="whitespace-nowrap">Saving...</span>
              ) : (
                <>
                  <Check className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                  <span className="whitespace-nowrap">Add Booking</span>
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

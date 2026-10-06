"use client";

import React, { useState } from "react";
import { Calendar, Clock, User, DollarSign, Check } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Dim Scrim Backdrop */}
      <div
        className="fixed inset-0 bg-black/35 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Sheet Card */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-xl shadow-[0_24px_60px_rgba(10,35,66,0.18),0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden z-10 animate-in zoom-in-95 duration-250"
      >
        {/* Sheet Header */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-slate-100">
          <button
            type="button"
            onClick={() => {
              onClose();
            }}
            className="text-sm font-medium text-slate-500 hover:text-[#0A2342] apple-press whitespace-nowrap shrink-0"
          >
            Cancel
          </button>
          <div className="text-center">
            <h3 className="text-base font-semibold text-[#0A2342] tracking-tight whitespace-nowrap">
              New Consultation
            </h3>
            <p className="text-[11px] text-slate-400 whitespace-nowrap">Med Jordan Law Practice</p>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!clientName.trim() || isSubmitting}
            className="text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF] disabled:opacity-40 disabled:cursor-not-allowed apple-press whitespace-nowrap shrink-0"
          >
            Done
          </button>
        </div>

        {/* Sheet Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Client Name Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 tracking-wider uppercase mb-1.5 px-1">
              Client & Organization
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Queen Rania Foundation, Zaid Nabulsi"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-[#0A2342] rounded-lg text-sm font-medium text-[#0A2342] placeholder:text-slate-400 focus:outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Segmented Category Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 tracking-wider uppercase mb-1.5 px-1">
              Practice Area
            </label>
            <div className="grid grid-cols-4 p-1 bg-slate-100 border border-slate-200 rounded-lg gap-1">
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
                        ? "bg-white text-[#0A2342] font-semibold shadow-xs"
                        : "text-slate-500 hover:text-[#0A2342]"
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
              <label className="block text-xs font-semibold text-slate-500 tracking-wider uppercase mb-1.5 px-1 whitespace-nowrap">
                Scheduled Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#0A2342] rounded-lg text-sm font-medium text-[#0A2342] focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 tracking-wider uppercase mb-1.5 px-1 whitespace-nowrap">
                Time
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#0A2342] rounded-lg text-sm font-medium text-[#0A2342] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Retainer Fee Estimate */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 tracking-wider uppercase mb-1.5 px-1 whitespace-nowrap">
              Agreed Retainer Deposit
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="number"
                value={retainerFee}
                onChange={(e) => setRetainerFee(e.target.value)}
                placeholder="3500"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#0A2342] rounded-lg text-sm font-medium text-[#0A2342] focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Primary CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!clientName.trim() || isSubmitting}
              className="w-full py-2.5 rounded-lg bg-[#0A2342] hover:bg-[#0D2F56] text-white text-sm font-semibold shadow-sm border border-[#0A2342] transition-all apple-press disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              {isSubmitting ? (
                <span className="whitespace-nowrap">Confirming Booking...</span>
              ) : (
                <>
                  <Check className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                  <span className="whitespace-nowrap">Confirm & Add Consultation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

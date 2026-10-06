"use client";

import React, { useState } from "react";
import { AlertCircle, Check, X, FileX, Clock, Calendar, ArrowRight, ShieldAlert } from "lucide-react";
import { NeedsAttentionItem, NEEDS_ATTENTION_ITEMS } from "@/lib/mock-data";

interface NeedsAttentionPanelProps {
  onAcceptBooking?: (id: string) => void;
  onDeclineBooking?: (id: string) => void;
  onViewDocument?: (id: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export function NeedsAttentionPanel({
  onAcceptBooking,
  onDeclineBooking,
  onViewDocument,
  onNavigateTab,
}: NeedsAttentionPanelProps) {
  const [items, setItems] = useState<NeedsAttentionItem[]>(NEEDS_ATTENTION_ITEMS);
  const [filter, setFilter] = useState<"all" | "bookings" | "docs">("all");

  const handleQuickAccept = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (onAcceptBooking) onAcceptBooking(id);
  };

  const handleQuickDecline = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (onDeclineBooking) onDeclineBooking(id);
  };

  const filteredItems = items.filter((item) => {
    if (filter === "bookings") return item.category === "booking_acceptance" || item.category === "stalled_reschedule";
    if (filter === "docs") return item.category === "rejected_document";
    return true;
  });

  return (
    <div className="apple-glass-card p-5 rounded-xl flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <AlertCircle className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[14px] font-bold text-[#0A2342] tracking-tight whitespace-nowrap">Needs Attention</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200/60 whitespace-nowrap shrink-0">
                  {items.length} Pending
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Intake blockers, rejected documents & stalled requests</p>
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px] font-medium shrink-0 border border-slate-200">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                filter === "all" ? "bg-white text-[#0A2342] font-semibold shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All ({items.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("bookings")}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                filter === "bookings" ? "bg-white text-[#0A2342] font-semibold shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Bookings
            </button>
            <button
              type="button"
              onClick={() => setFilter("docs")}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                filter === "docs" ? "bg-white text-[#0A2342] font-semibold shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Docs
            </button>
          </div>
        </div>

        {/* List of Attention Items */}
        <div className="flex flex-col gap-2.5">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center flex flex-col items-center justify-center text-slate-400">
              <Check className="w-8 h-8 text-emerald-500 mb-2 stroke-[2.5]" />
              <p className="text-xs font-semibold text-slate-600">All clear — no pending blockers!</p>
              <p className="text-[11px] text-slate-400 mt-0.5">All booking intakes and client files are processed.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-slate-300 transition-all flex flex-col gap-2 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="mt-0.5 shrink-0">
                      {item.category === "booking_acceptance" ? (
                        <div className="w-7 h-7 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center">
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                      ) : item.category === "rejected_document" ? (
                        <div className="w-7 h-7 rounded-md bg-rose-500/10 text-rose-600 flex items-center justify-center">
                          <FileX className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-md bg-purple-500/10 text-purple-600 flex items-center justify-center">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-bold text-[#0A2342] tracking-tight truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">{item.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug line-clamp-2 mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Inline Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 mt-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {item.urgency === "high" && (
                      <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap shrink-0">
                        Action Required
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 whitespace-nowrap truncate">
                      {item.category === "booking_acceptance"
                        ? "Gateway Escrow Settled"
                        : item.category === "rejected_document"
                        ? "Visible in Client Portal"
                        : "Client Awaiting Response"}
                    </span>
                  </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.category === "booking_acceptance" && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleQuickDecline(item.id)}
                            className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0"
                          >
                            <X className="w-3 h-3" />
                            Decline
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickAccept(item.id)}
                            className="px-3 py-1 rounded-md bg-[#0A2342] hover:bg-[#0D2F56] text-white text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 shadow-xs whitespace-nowrap shrink-0"
                          >
                            <Check className="w-3 h-3 stroke-[2.5]" />
                            Accept & Notify
                          </button>
                        </>
                      )}

                      {item.category === "rejected_document" && (
                        <button
                          type="button"
                          onClick={() => {
                            if (onViewDocument) onViewDocument(item.relatedId || "");
                            if (onNavigateTab) onNavigateTab("cases");
                          }}
                          className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0"
                        >
                          Inspect Vault
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}

                      {item.category === "stalled_reschedule" && (
                        <button
                          type="button"
                          onClick={() => {
                            if (onNavigateTab) onNavigateTab("bookings");
                          }}
                          className="px-2.5 py-1 rounded-md bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 shadow-xs whitespace-nowrap shrink-0"
                        >
                          Review Slot
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer link to Bookings / Cases */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] mt-3">
        <span className="text-slate-400 font-medium whitespace-nowrap truncate mr-2">All items auto-sync with client notification engine</span>
        <button
          type="button"
          onClick={() => onNavigateTab?.("bookings")}
          className="text-[#007AFF] hover:text-blue-700 font-semibold cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0"
        >
          View Bookings Queue
          <ArrowRight className="w-3 h-3 shrink-0" />
        </button>
      </div>
    </div>
  );
}

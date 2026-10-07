"use client";

import React, { useState } from "react";
import { AlertCircle, Check, X, FileX, Clock, Calendar, ArrowRight } from "lucide-react";
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
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-warning/10 text-warning flex items-center justify-center font-bold">
              <AlertCircle className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[14px] font-bold text-navy-900 tracking-tight whitespace-nowrap">Needs Attention</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gold-100 text-gold-700 border border-gold-300 whitespace-nowrap shrink-0">
                  {items.length} Pending
                </span>
              </div>
              <p className="text-[11px] text-gray-500">Intake blockers, rejected documents & stalled requests</p>
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-lg text-[11px] font-medium shrink-0 border border-gray-300">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                filter === "all" ? "bg-white text-navy-900 font-semibold shadow-xs" : "text-gray-500 hover:text-navy-900"
              }`}
            >
              All ({items.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("bookings")}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                filter === "bookings" ? "bg-white text-navy-900 font-semibold shadow-xs" : "text-gray-500 hover:text-navy-900"
              }`}
            >
              Bookings
            </button>
            <button
              type="button"
              onClick={() => setFilter("docs")}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                filter === "docs" ? "bg-white text-navy-900 font-semibold shadow-xs" : "text-gray-500 hover:text-navy-900"
              }`}
            >
              Docs
            </button>
          </div>
        </div>

        {/* List of Attention Items */}
        <div className="flex flex-col gap-2.5">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center flex flex-col items-center justify-center text-gray-400">
              <Check className="w-8 h-8 text-success mb-2 stroke-[2.5]" />
              <p className="text-xs font-semibold text-gray-700">All clear — no pending blockers!</p>
              <p className="text-[11px] text-gray-500 mt-0.5">All booking intakes and client files are processed.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-lg bg-gray-50 border border-gray-300 hover:border-navy-300 transition-all flex flex-col gap-2 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="mt-0.5 shrink-0">
                      {item.category === "booking_acceptance" ? (
                        <div className="w-7 h-7 rounded-md bg-info/10 text-info flex items-center justify-center">
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                      ) : item.category === "rejected_document" ? (
                        <div className="w-7 h-7 rounded-md bg-error/10 text-error flex items-center justify-center">
                          <FileX className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-md bg-navy-500/10 text-navy-600 flex items-center justify-center">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-bold text-navy-900 tracking-tight truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-gray-400 shrink-0 font-medium">{item.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-snug line-clamp-2 mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Inline Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-200 mt-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {item.urgency === "high" && (
                      <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-md bg-error/10 text-error border border-error/20 whitespace-nowrap shrink-0">
                        Action Required
                      </span>
                    )}
                    <span className="text-[10px] text-gray-500 whitespace-nowrap truncate">
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
                            className="px-2.5 py-1 rounded-md bg-white border border-gray-300 hover:bg-error/10 hover:text-error hover:border-error/20 text-gray-700 text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0"
                          >
                            <X className="w-3 h-3" />
                            Decline
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickAccept(item.id)}
                            className="px-3 py-1 rounded-md bg-navy-900 hover:bg-navy-950 text-white text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 shadow-xs whitespace-nowrap shrink-0"
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
                          className="px-2.5 py-1 rounded-md bg-white border border-gray-300 hover:border-navy-300 text-gray-700 text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0"
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
                          className="px-2.5 py-1 rounded-md bg-navy-600 hover:bg-navy-700 text-white text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 shadow-xs whitespace-nowrap shrink-0"
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
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] mt-3">
        <span className="text-gray-500 font-medium whitespace-nowrap truncate mr-2">All items auto-sync with client notification engine</span>
        <button
          type="button"
          onClick={() => onNavigateTab?.("bookings")}
          className="text-navy-600 hover:text-navy-700 font-semibold cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0"
        >
          View Bookings Queue
          <ArrowRight className="w-3 h-3 shrink-0" />
        </button>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Check, X, FileX, Clock, Calendar, ArrowRight, PartyPopper } from "lucide-react";
import { NeedsAttentionItem, NEEDS_ATTENTION_ITEMS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface NeedsAttentionPanelProps {
  onAcceptBooking?: (id: string) => void;
  onDeclineBooking?: (id: string) => void;
  onViewDocument?: (id: string) => void;
  onNavigateTab?: (tab: string) => void;
}

const FILTERS = [
  { id: "all", label: "All" },
  { id: "bookings", label: "Bookings" },
  { id: "docs", label: "Docs" },
] as const;

const CATEGORY_STYLE: Record<string, { icon: React.ElementType; tile: string }> = {
  booking_acceptance: { icon: Calendar, tile: "bg-info/10 text-info" },
  rejected_document: { icon: FileX, tile: "bg-error/10 text-error" },
  stalled_reschedule: { icon: Clock, tile: "bg-warning/15 text-gold-700" },
};

export function NeedsAttentionPanel({
  onAcceptBooking,
  onDeclineBooking,
  onViewDocument,
  onNavigateTab,
}: NeedsAttentionPanelProps) {
  const [items, setItems] = useState<NeedsAttentionItem[]>(NEEDS_ATTENTION_ITEMS);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");

  const handleQuickAccept = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    onAcceptBooking?.(id);
  };

  const handleQuickDecline = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    onDeclineBooking?.(id);
  };

  const filteredItems = items.filter((item) => {
    if (filter === "bookings") return item.category === "booking_acceptance" || item.category === "stalled_reschedule";
    if (filter === "docs") return item.category === "rejected_document";
    return true;
  });

  return (
    <section
      className="surface-card rise-in p-5 flex flex-col h-full"
      style={{ "--rise-delay": "360ms" } as React.CSSProperties}
      aria-label="Needs attention"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <h3 className="text-[17px] font-semibold tracking-tight text-navy-950">Needs Attention</h3>
          {items.length > 0 && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gold-100 text-gold-700 tabular-nums">
              {items.length}
            </span>
          )}
        </div>

        <div className="inline-flex p-1 bg-gray-100 rounded-full" role="tablist" aria-label="Filter">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "px-3 py-1 text-xs rounded-full transition-all cursor-pointer whitespace-nowrap",
                filter === f.id
                  ? "bg-white text-navy-900 font-semibold shadow-xs"
                  : "text-gray-500 hover:text-navy-900 font-medium"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2.5">
        {filteredItems.length === 0 ? (
          <div className="flex-1 min-h-[160px] flex flex-col items-center justify-center text-center rounded-2xl pattern-hatch/50 border border-dashed border-navy-200 py-8">
            <span className="w-11 h-11 rounded-full bg-success/10 text-success flex items-center justify-center mb-3">
              <PartyPopper className="w-5 h-5" />
            </span>
            <p className="text-sm font-semibold text-navy-950">All clear</p>
            <p className="text-xs text-gray-500 mt-0.5">Nothing needs you right now.</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const style = CATEGORY_STYLE[item.category] ?? CATEGORY_STYLE.stalled_reschedule;
            const Icon = style.icon;
            return (
              <article
                key={item.id}
                className="group rounded-2xl border border-navy-900/[0.07] bg-gray-50/60 hover:bg-white hover:border-navy-900/15 hover:shadow-[0_10px_24px_-14px_rgba(26,39,68,0.25)] transition-all p-3.5 flex flex-col gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", style.tile)}>
                    <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[13.5px] font-semibold tracking-tight text-navy-950 truncate">
                        {item.title}
                      </h4>
                      {item.urgency === "high" && (
                        <span className="text-[9.5px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-md bg-error/10 text-error shrink-0">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-gray-500 leading-snug line-clamp-2 mt-0.5">{item.subtitle}</p>
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium shrink-0 mt-0.5">{item.timestamp}</span>
                </div>

                <div className="flex items-center justify-end gap-2">
                  {item.category === "booking_acceptance" && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleQuickDecline(item.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-navy-900/15 text-[12px] font-semibold text-navy-800 hover:bg-error/10 hover:text-error hover:border-error/30 transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                        Decline
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickAccept(item.id)}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-navy-900 text-white text-[12px] font-semibold hover:bg-navy-800 active:scale-95 transition-all cursor-pointer"
                      >
                        <Check className="w-3 h-3" strokeWidth={2.8} />
                        Accept
                      </button>
                    </>
                  )}

                  {item.category === "rejected_document" && (
                    <button
                      type="button"
                      onClick={() => {
                        onViewDocument?.(item.relatedId || "");
                        onNavigateTab?.("cases");
                      }}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white border border-navy-900/15 text-[12px] font-semibold text-navy-800 hover:bg-navy-900 hover:text-white hover:border-navy-900 transition-colors cursor-pointer"
                    >
                      View
                      <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                    </button>
                  )}

                  {item.category === "stalled_reschedule" && (
                    <button
                      type="button"
                      onClick={() => onNavigateTab?.("bookings")}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-navy-900 text-white text-[12px] font-semibold hover:bg-navy-800 active:scale-95 transition-all cursor-pointer"
                    >
                      Review
                      <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                    </button>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { Calendar, Briefcase, DollarSign } from "lucide-react";
import { NotificationItem } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  items: NotificationItem[];
  onMarkAllRead: () => void;
  placement?: "top-bar" | "sidebar";
}

export function NotificationsPopover({
  isOpen,
  onClose,
  items,
  onMarkAllRead,
  placement = "sidebar",
}: NotificationsPopoverProps) {
  if (!isOpen) return null;

  const categoryIcons = {
    calendar: Calendar,
    matter: Briefcase,
    billing: DollarSign,
  };

  const categoryColors = {
    calendar: "#007AFF",
    matter: "#5856D6",
    billing: "#34C759",
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className={cn(
          "w-80 sm:w-96 bg-white/95 backdrop-blur-3xl border border-slate-200 rounded-xl shadow-[0_20px_50px_rgba(10,35,66,0.18),0_1px_3px_rgba(0,0,0,0.04)] z-50 overflow-hidden animate-in zoom-in-95 fade-in duration-200",
          placement === "sidebar"
            ? "fixed left-4 bottom-20 sm:left-[264px] sm:bottom-4"
            : "absolute right-0 top-12"
        )}
      >
        <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#0A2342] tracking-tight whitespace-nowrap">
              Notifications
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#1D4ED8]/10 text-[#1D4ED8] border border-[#1D4ED8]/20 whitespace-nowrap shrink-0">
              {items.filter((i) => !i.read).length} new
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              onMarkAllRead();
            }}
            className="text-xs font-semibold text-[#1D4ED8] hover:text-[#1E40AF] apple-press whitespace-nowrap shrink-0"
          >
            Mark all read
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto apple-scrollbar divide-y divide-slate-100">
          {items.map((item) => {
            const Icon = categoryIcons[item.category];
            const color = categoryColors[item.category];
            return (
              <div
                key={item.id}
                className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                  !item.read ? "bg-slate-50/70" : ""
                }`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs"
                  style={{ backgroundColor: color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#0A2342] truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-1 whitespace-nowrap">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug line-clamp-2">
                    {item.body}
                  </p>
                </div>
                {!item.read && (
                  <span className="w-2 h-2 rounded-full bg-[#1D4ED8] shrink-0 mt-1.5" />
                )}
              </div>
            );
          })}
        </div>

        <div className="p-2.5 bg-slate-50 text-center border-t border-slate-100">
          <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
            Encrypted Practice Dispatch Channel
          </span>
        </div>
      </div>
    </>
  );
}

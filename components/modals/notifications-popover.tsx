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
    calendar: "#3B82C4",
    matter: "#3D5390",
    billing: "#2F9E6E",
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className={cn(
          "w-80 sm:w-96 bg-white/95 backdrop-blur-3xl border border-gray-300/80 rounded-xl shadow-[0_20px_50px_rgba(26,39,68,0.18),0_1px_3px_rgba(0,0,0,0.04)] z-50 overflow-hidden animate-in zoom-in-95 fade-in duration-200",
          placement === "sidebar"
            ? "fixed left-4 bottom-20 sm:left-[264px] sm:bottom-4"
            : "absolute end-0 top-full mt-2.5"
        )}
      >
        <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-navy-900 tracking-tight whitespace-nowrap">
              Notifications
            </span>
            {items.some((i) => !i.read) && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-navy-600/10 text-navy-600 whitespace-nowrap shrink-0">
                {items.filter((i) => !i.read).length}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              onMarkAllRead();
            }}
            className="text-xs font-semibold text-navy-600 hover:text-navy-800 press whitespace-nowrap shrink-0 cursor-pointer"
          >
            Mark all read
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto scrollbar-thin divide-y divide-gray-100">
          {items.map((item) => {
            const Icon = categoryIcons[item.category];
            const color = categoryColors[item.category];
            return (
              <div
                key={item.id}
                className={`p-3.5 flex items-start gap-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                  !item.read ? "bg-gray-50/70" : ""
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
                    <span className="text-xs font-semibold text-navy-900 truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-gray-500 shrink-0 ml-1 whitespace-nowrap">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">
                    {item.body}
                  </p>
                </div>
                {!item.read && (
                  <span className="w-2 h-2 rounded-full bg-navy-600 shrink-0 mt-1.5" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

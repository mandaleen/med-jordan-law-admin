"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Calendar,
  Video,
  FileDown,
  X,
  Command,
} from "lucide-react";
import { RECENT_BOOKINGS, ACTIVE_MATTERS } from "@/lib/mock-data";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ClientAvatar } from "@/components/ui/client-avatar";

interface SpotlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewBooking: () => void;
  onExportData: () => void;
  onNavigateTab?: (tab: string) => void;
}

export function SpotlightModal({
  isOpen,
  onClose,
  onNewBooking,
  onExportData,
  onNavigateTab,
}: SpotlightModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = React.useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  const quickActions = [
    {
      id: "qa-book",
      title: "New Booking",
      subtitle: "Open booking form",
      icon: Calendar,
      action: () => {
        handleClose();
        onNewBooking();
      },
    },
    {
      id: "qa-export",
      title: "Export Data",
      subtitle: "Download CSV or PDF",
      icon: FileDown,
      action: () => {
        handleClose();
        onExportData();
      },
    },
    {
      id: "qa-facetime",
      title: "Video Call",
      subtitle: "Sara Odeh consultation",
      icon: Video,
      action: () => {
        handleClose();
        if (onNavigateTab) onNavigateTab("bookings");
      },
    },
  ];

  const filteredClients = RECENT_BOOKINGS.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.caseType.toLowerCase().includes(query.toLowerCase())
  );

  const filteredMatters = ACTIVE_MATTERS.filter(
    (m) =>
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-2xl p-0 bg-white/95 backdrop-blur-3xl border border-slate-200 rounded-xl shadow-[0_24px_70px_rgba(10,35,66,0.22),0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden"
      >
        {/* Spotlight Search Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 shrink-0" strokeWidth={2.2} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full bg-transparent text-navy-900 text-lg font-medium placeholder:text-gray-400 focus:outline-none tracking-tight"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md hover:bg-gray-100 text-gray-400 active:scale-90 transition-transform"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-300">
              <Command className="w-3 h-3" /> K
            </span>
          )}
        </div>

        {/* Results Container */}
        <div className="max-h-[380px] overflow-y-auto scrollbar-thin p-3 space-y-4">
          {/* Quick Actions */}
          {(!query || "actions".includes(query.toLowerCase())) && (
            <div>
              <div className="text-[11px] font-semibold text-gray-500 tracking-wider uppercase px-3 py-1">
                Actions
              </div>
              <div className="space-y-1 mt-1">
                {quickActions.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.action();
                      }}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-full hover:bg-navy-900 hover:text-white text-navy-900 text-left transition-colors group cursor-pointer press"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-gray-100 group-hover:bg-white/20 flex items-center justify-center shrink-0 transition-colors">
                          <Icon className="w-4 h-4 text-navy-900 group-hover:text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold tracking-tight leading-snug">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-500 group-hover:text-white/80 leading-snug">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Clients Matching */}
          {filteredClients.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-gray-500 tracking-wider uppercase px-3 py-1">
                Clients
              </div>
              <div className="space-y-1 mt-1">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => {
                      handleClose();
                      if (onNavigateTab) onNavigateTab("clients");
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2 rounded-full hover:bg-navy-900 hover:text-white text-navy-900 text-left transition-colors group cursor-pointer press"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ClientAvatar
                        name={client.name}
                        src={client.avatarUrl}
                        initials={client.initials}
                        className="w-7 h-7 rounded-md shrink-0 ring-1 ring-black/10 shadow-xs"
                        fallbackClassName="text-xs font-bold rounded-md"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold tracking-tight leading-none truncate">
                          {client.name}
                        </div>
                        <div className="text-xs text-gray-500 group-hover:text-white/80 mt-0.5 truncate">
                          {client.caseType}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-medium text-gray-500 group-hover:text-white whitespace-nowrap shrink-0 ml-2">
                      {client.retainerAmount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Matters Matching */}
          {filteredMatters.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-gray-500 tracking-wider uppercase px-3 py-1">
                Matters
              </div>
              <div className="space-y-1 mt-1">
                {filteredMatters.map((matter) => (
                  <div
                    key={matter.id}
                    onClick={() => {
                      handleClose();
                      if (onNavigateTab) onNavigateTab("cases");
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2 rounded-full hover:bg-navy-900 hover:text-white text-navy-900 text-left transition-colors group cursor-pointer press"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-3 h-3 rounded-sm shrink-0"
                        style={{ backgroundColor: matter.color }}
                      />
                      <div className="text-sm font-semibold tracking-tight truncate">
                        {matter.title}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 group-hover:text-white/80 whitespace-nowrap shrink-0 ml-2">
                      {matter.dueDate}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Spotlight Footer */}
        <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-2 whitespace-nowrap shrink-0">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded-md bg-white border border-gray-300 text-[10px] font-semibold text-gray-700">
              ESC
            </kbd>
            <span>to close</span>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

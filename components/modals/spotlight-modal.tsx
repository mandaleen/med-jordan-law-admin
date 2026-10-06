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

interface SpotlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewBooking: () => void;
  onExportData: () => void;
}

export function SpotlightModal({
  isOpen,
  onClose,
  onNewBooking,
  onExportData,
}: SpotlightModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleClose = React.useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  // Keyboard navigation / ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const quickActions = [
    {
      id: "qa-book",
      title: "Schedule New Consultation",
      subtitle: "Open the booking intake sheet",
      icon: Calendar,
      action: () => {
        handleClose();
        onNewBooking();
      },
      badge: "Action",
    },
    {
      id: "qa-export",
      title: "Export Dossier & Financials",
      subtitle: "Generate CSV or encrypted PDF",
      icon: FileDown,
      action: () => {
        handleClose();
        onExportData();
      },
      badge: "Export",
    },
    {
      id: "qa-facetime",
      title: "Join Video Session with Sara Odeh",
      subtitle: "Commercial Retainer Agreement review",
      icon: Video,
      action: () => {
        handleClose();
        alert("Connecting to encrypted FaceTime HD legal session...");
      },
      badge: "FaceTime",
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32 px-4 animate-in fade-in duration-200">
      {/* Blurred Dim Backdrop */}
      <div
        className="fixed inset-0 bg-black/35 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      {/* Spotlight Floating Glass Window */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl bg-white/95 backdrop-blur-3xl border border-slate-200 rounded-xl shadow-[0_24px_70px_rgba(10,35,66,0.22),0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden z-10 animate-in zoom-in-95 duration-200"
      >
        {/* Spotlight Search Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 shrink-0" strokeWidth={2.2} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients, matters, dossiers, or actions"
            className="w-full bg-transparent text-[#0A2342] text-lg font-medium placeholder:text-slate-400 focus:outline-none tracking-tight"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md hover:bg-slate-100 text-slate-400 active:scale-90 transition-transform"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              <Command className="w-3 h-3" /> K
            </span>
          )}
        </div>

        {/* Results Container */}
        <div className="max-h-[380px] overflow-y-auto apple-scrollbar p-3 space-y-4">
          {/* Quick Actions */}
          {(!query || "actions".includes(query.toLowerCase())) && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase px-3 py-1">
                Suggested Actions
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
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg hover:bg-[#0A2342] hover:text-white text-[#0A2342] text-left transition-colors group cursor-pointer apple-press"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-slate-100 group-hover:bg-white/20 flex items-center justify-center shrink-0 transition-colors">
                          <Icon className="w-4 h-4 text-[#0A2342] group-hover:text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold tracking-tight leading-snug">
                            {item.title}
                          </div>
                          <div className="text-xs text-slate-400 group-hover:text-white/80 leading-snug">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 group-hover:bg-white/20 text-slate-500 group-hover:text-white whitespace-nowrap shrink-0">
                        {item.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Clients Matching */}
          {filteredClients.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase px-3 py-1">
                Clients & Bookings
              </div>
              <div className="space-y-1 mt-1">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => {
                      handleClose();
                      alert(`Viewing dossier for ${client.name}`);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg hover:bg-[#0A2342] hover:text-white text-[#0A2342] text-left transition-colors group cursor-pointer apple-press"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${client.avatarBg} group-hover:bg-white group-hover:text-[#0A2342] shrink-0`}
                      >
                        {client.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold tracking-tight leading-none truncate">
                          {client.name}
                        </div>
                        <div className="text-xs text-slate-400 group-hover:text-white/80 mt-0.5 truncate">
                          {client.caseType}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-medium text-slate-400 group-hover:text-white whitespace-nowrap shrink-0 ml-2">
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
              <div className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase px-3 py-1">
                Active Matters
              </div>
              <div className="space-y-1 mt-1">
                {filteredMatters.map((matter) => (
                  <div
                    key={matter.id}
                    onClick={() => {
                      handleClose();
                      alert(`Opening matter: ${matter.title}`);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg hover:bg-[#0A2342] hover:text-white text-[#0A2342] text-left transition-colors group cursor-pointer apple-press"
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
                    <span className="text-xs text-slate-400 group-hover:text-white/80 whitespace-nowrap shrink-0 ml-2">
                      {matter.dueDate}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Spotlight Footer */}
        <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-2 whitespace-nowrap shrink-0">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-semibold text-slate-600">
              ESC
            </kbd>
            <span>to close</span>
          </span>
          <span className="font-medium text-[#0A2342] whitespace-nowrap shrink-0">Med Jordan Law Dispatch</span>
        </div>
      </div>
    </div>
  );
}

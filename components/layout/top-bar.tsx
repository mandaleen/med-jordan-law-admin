"use client";

import React, { useState } from "react";
import {
  Search,
  Bell,
  Command,
  ChevronDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CURRENT_USER, NotificationItem } from "@/lib/mock-data";
import { NotificationsPopover } from "@/components/modals/notifications-popover";

interface TopBarProps {
  onNewBooking?: () => void;
  onExportData?: () => void;
  onOpenSpotlight?: () => void;
  notifications: NotificationItem[];
  onMarkNotificationsRead: () => void;
  activeSegment?: string;
  onSelectSegment?: (segment: string) => void;
}

export function TopBar({
  onOpenSpotlight,
  notifications,
  onMarkNotificationsRead,
}: TopBarProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="flex items-center justify-end gap-2.5 mb-6 select-none">
      {/* Spotlight Search Capsule */}
      <button
        type="button"
        onClick={() => onOpenSpotlight?.()}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-[#86868B] hover:text-[#0A2342] text-xs font-medium shadow-2xs transition-colors apple-press cursor-pointer"
        title="Search (⌘K)"
      >
        <Search className="w-3.5 h-3.5 text-[#86868B]" />
        <span className="hidden md:inline">Spotlight</span>
        <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold text-[#86868B] bg-slate-100 rounded border border-slate-200">
          <Command className="w-2.5 h-2.5" /> K
        </kbd>
      </button>

      {/* Notifications Bell */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-[#1D1D1F] shadow-2xs transition-colors apple-press relative cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-3.5 h-3.5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1D4ED8] ring-2 ring-white" />
          )}
        </button>

        <NotificationsPopover
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          items={notifications}
          onMarkAllRead={onMarkNotificationsRead}
        />
      </div>

      {/* User Profile Chip / Account Component */}
      <div className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer apple-press">
        <Avatar className="h-7 w-7 rounded-md ring-1 ring-black/10">
          <AvatarImage src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
          <AvatarFallback className="bg-[#0A2342] text-white text-xs font-bold rounded-md">
            TQ
          </AvatarFallback>
        </Avatar>
        <div className="hidden sm:flex flex-col text-left pr-1">
          <span className="text-xs font-semibold text-[#0A2342] leading-none">
            {CURRENT_USER.name}
          </span>
          <span className="text-[10px] text-[#86868B] mt-0.5 leading-none">
            {CURRENT_USER.role}
          </span>
        </div>
        <ChevronDown className="w-3 h-3 text-[#86868B]" />
      </div>
    </header>
  );
}

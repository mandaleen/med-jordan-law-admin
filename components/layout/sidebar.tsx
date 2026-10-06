"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  Briefcase,
  Users,
  Wallet,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NAV_MENU_ITEMS,
  NAV_GENERAL_ITEMS,
  CURRENT_USER,
  NotificationItem,
  NOTIFICATIONS,
} from "@/lib/mock-data";
import { Logo } from "@/components/brand/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationsPopover } from "@/components/modals/notifications-popover";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Calendar,
  Briefcase,
  Users,
  Wallet,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
};

interface SidebarProps {
  activeId?: string;
  onSelectNav?: (id: string) => void;
  notifications?: NotificationItem[];
  onMarkNotificationsRead?: () => void;
}

export function Sidebar({
  activeId = "dashboard",
  onSelectNav,
  notifications = NOTIFICATIONS,
  onMarkNotificationsRead,
}: SidebarProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNavClick = (id: string) => {
    if (onSelectNav) onSelectNav(id);
  };

  return (
    <aside className="w-64 h-screen max-h-screen bg-white border-r border-[#E2E8F0] flex flex-col justify-between p-5 shrink-0 select-none sticky top-0 left-0 z-30">
      {/* Top Section: Logo & Nav items */}
      <div className="flex flex-col gap-5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-0.5">
        {/* Brand Logo */}
        <div className="flex items-center px-1 py-1 shrink-0">
          <Logo
            className="w-full max-w-[185px] h-auto text-[#0A2342]"
            label="Med Jordan Law"
          />
        </div>

        {/* Menu Section */}
        <div className="flex flex-col gap-1 mt-1">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider px-3 uppercase">
            MENU
          </span>
          <nav className="flex flex-col gap-1 mt-1">
            {NAV_MENU_ITEMS.map((item) => {
              const Icon = iconMap[item.icon] || LayoutDashboard;
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  type="button"
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-colors group text-left cursor-pointer",
                    isActive
                      ? "bg-slate-100 text-[#0A2342] font-semibold border-l-2 border-[#0A2342]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        isActive
                          ? "text-[#0A2342]"
                          : "text-slate-400 group-hover:text-slate-600"
                      )}
                      strokeWidth={isActive ? 2.2 : 1.8}
                    />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-md transition-colors whitespace-nowrap shrink-0",
                        isActive
                          ? "bg-[#0A2342] text-white"
                          : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* General Section */}
        <div className="flex flex-col gap-1 mt-1">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider px-3 uppercase whitespace-nowrap">
            GENERAL
          </span>
          <nav className="flex flex-col gap-1 mt-1">
            {NAV_GENERAL_ITEMS.map((item) => {
              const Icon = iconMap[item.icon] || Settings;
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  type="button"
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors group text-left cursor-pointer",
                    isActive
                      ? "bg-slate-100 text-[#0A2342] font-semibold border-l-2 border-[#0A2342]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      isActive
                        ? "text-[#0A2342]"
                        : "text-slate-400 group-hover:text-slate-600"
                    )}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Account & Notifications Card (Expanded Executive Card) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0A1E38] via-[#091B33] to-[#041224] p-3.5 text-white border border-white/[0.12] shadow-lg shadow-black/20 shrink-0 mt-4 select-none">
        {/* Subtle architectural grid watermark */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.09] rounded-2xl overflow-hidden">
          <svg className="w-full h-full" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="account-card-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.75" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#account-card-grid)" />
          </svg>
        </div>

        {/* Ambient subtle blue backlight glow */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-2.5">
          {/* Top Section: Account Identity Row */}
          <button
            type="button"
            onClick={() => {
              setIsAccountMenuOpen(!isAccountMenuOpen);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center justify-between p-1.5 -m-1.5 rounded-xl hover:bg-white/[0.08] transition-colors text-left group cursor-pointer"
            title="Open Account Menu"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <Avatar className="h-9 w-9 rounded-xl ring-1.5 ring-white/20 shadow-sm">
                  <AvatarImage src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
                  <AvatarFallback className="bg-[#1E3A8A] text-white text-xs font-bold rounded-xl">
                    TQ
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0A1E38]" />
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-bold text-white tracking-tight leading-tight truncate group-hover:text-blue-200 transition-colors">
                    {CURRENT_USER.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10.5px] text-blue-200/90 font-medium leading-none truncate">
                    {CURRENT_USER.role}
                  </span>
                  <span className="text-[9px] text-white/30">•</span>
                  <span className="text-[9.5px] text-emerald-400 font-medium leading-none">
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="w-6 h-6 rounded-lg bg-white/5 group-hover:bg-white/15 flex items-center justify-center text-slate-300 group-hover:text-white transition-colors shrink-0">
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-200",
                  isAccountMenuOpen && "rotate-180 text-white"
                )}
              />
            </div>
          </button>

          {/* Middle Section: Live Notification Dispatch Bar */}
          <button
            type="button"
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsAccountMenuOpen(false);
            }}
            className={cn(
              "w-full flex items-center justify-between p-2 rounded-xl border transition-all duration-200 text-left cursor-pointer",
              unreadCount > 0
                ? "bg-blue-500/15 hover:bg-blue-500/25 border-blue-400/30 text-white shadow-xs"
                : "bg-white/[0.05] hover:bg-white/[0.09] border-white/10 text-slate-300"
            )}
            title="View Practice Notifications"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 relative transition-colors",
                  unreadCount > 0 ? "bg-blue-500 text-white shadow-xs" : "bg-white/10 text-slate-300"
                )}
              >
                <Bell className="w-3.5 h-3.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-300 ring-2 ring-[#0A1E38] animate-pulse" />
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-semibold text-white leading-tight truncate">
                  {unreadCount > 0 ? `${unreadCount} Practice Alerts` : "Practice Dispatch"}
                </span>
                <span className="text-[9.5px] text-slate-300 leading-tight truncate">
                  {unreadCount > 0 ? "Intake & schedule updates" : "All notices caught up"}
                </span>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1">
              {unreadCount > 0 ? (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-400/20 text-blue-200 border border-blue-400/30">
                  {unreadCount} new
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">Clear</span>
              )}
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </div>
          </button>

          {/* Bottom Section: Primary Action Button */}
          <button
            type="button"
            onClick={() => {
              setIsAccountMenuOpen(!isAccountMenuOpen);
              setIsNotificationsOpen(false);
            }}
            className="w-full py-2 px-3 rounded-xl bg-[#1E3A8A] hover:bg-[#1E40AF] text-white text-xs font-semibold transition-all duration-200 border border-blue-400/25 shadow-xs text-center active:scale-[0.98] cursor-pointer whitespace-nowrap shrink-0 flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-200" />
            <span>Manage Partner Account</span>
          </button>
        </div>

        {/* Notifications Popover */}
        <NotificationsPopover
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          items={notifications}
          onMarkAllRead={() => onMarkNotificationsRead?.()}
          placement="sidebar"
        />

        {/* Account Menu Popover */}
        {isAccountMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsAccountMenuOpen(false)}
            />
            <div className="fixed left-4 bottom-20 sm:left-[268px] sm:bottom-6 w-80 bg-white/95 backdrop-blur-3xl border border-slate-200/80 rounded-2xl shadow-[0_25px_60px_rgba(10,35,66,0.20),0_2px_8px_rgba(0,0,0,0.04)] z-50 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
              {/* Header with Navy Gradient Accent */}
              <div className="p-4 bg-gradient-to-br from-[#0A2342] to-[#1E3A8A] text-white relative overflow-hidden">
                {/* Architectural grid watermark */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <svg className="w-full h-full" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="modal-grid" width="16" height="16" patternUnits="userSpaceOnUse">
                        <path d="M 16 0 L 0 0 0 16" fill="none" stroke="white" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#modal-grid)" />
                  </svg>
                </div>

                <div className="relative z-10 flex items-center gap-3">
                  <Avatar className="h-12 w-12 rounded-xl ring-2 ring-white/30 shadow-md">
                    <AvatarImage src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
                    <AvatarFallback className="bg-white text-[#0A2342] text-sm font-bold rounded-xl">
                      TQ
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white truncate">
                        {CURRENT_USER.name}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-400/20 text-blue-200 border border-blue-300/30">
                        Partner
                      </span>
                    </div>
                    <span className="text-[11px] text-blue-200/80 truncate block mt-0.5">
                      {CURRENT_USER.email}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-medium text-emerald-300">
                        Senior Counsel • Practice Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Ribbon */}
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Practice Role</span>
                <span className="font-semibold text-[#0A2342]">Head of Corporate Litigation</span>
              </div>

              {/* Menu Actions */}
              <div className="p-2 flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => {
                    onSelectNav?.("settings");
                    setIsAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 hover:text-[#0A2342] hover:bg-slate-100 transition-colors text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-white group-hover:shadow-xs flex items-center justify-center text-slate-500 group-hover:text-[#0A2342] transition-all">
                      <Settings className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">Account & Preferences</div>
                      <div className="text-[10px] text-slate-400">Security, notifications & profile</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectNav?.("help");
                    setIsAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 hover:text-[#0A2342] hover:bg-slate-100 transition-colors text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-white group-hover:shadow-xs flex items-center justify-center text-slate-500 group-hover:text-[#0A2342] transition-all">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">Counsel Desk & Support</div>
                      <div className="text-[10px] text-slate-400">Priority litigation docket assistance</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Log Out */}
              <div className="p-2 border-t border-slate-100 bg-slate-50/60">
                <button
                  type="button"
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Sign Out of Chambers Session</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

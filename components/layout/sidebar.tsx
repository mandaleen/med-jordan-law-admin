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
  FileCheck,
  Mail,
  ShieldAlert,
  Globe,
  X,
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
import { getTranslation } from "@/lib/i18n";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Calendar,
  Briefcase,
  Users,
  Wallet,
  FileText,
  FileCheck,
  Mail,
  ShieldAlert,
  Settings,
  HelpCircle,
  LogOut,
};

interface SidebarProps {
  activeId?: string;
  onSelectNav?: (id: string) => void;
  notifications?: NotificationItem[];
  onMarkNotificationsRead?: () => void;
  currentLang?: "en" | "ar";
  onToggleLang?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({
  activeId = "dashboard",
  onSelectNav,
  notifications = NOTIFICATIONS,
  onMarkNotificationsRead,
  currentLang = "en",
  onToggleLang,
  isOpenMobile = false,
  onCloseMobile,
}: SidebarProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNavClick = (id: string) => {
    if (onSelectNav) onSelectNav(id);
    if (onCloseMobile) onCloseMobile();
  };

  // Close mobile drawer on Escape
  React.useEffect(() => {
    if (!isOpenMobile || !onCloseMobile) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseMobile();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpenMobile, onCloseMobile]);

  const renderSidebarContent = (isMobile: boolean) => (
    <>
      {/* Top Section: Logo, Language Toggle & Nav items */}
      <div className="flex flex-col gap-5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-0.5">
        {/* Brand Logo & Language Switcher */}
        <div className="flex items-center justify-between px-1 py-1 shrink-0 gap-2">
          <Logo
            className="w-full max-w-[140px] h-auto text-navy-900"
            label="Med Jordan Law"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            {onToggleLang && (
              <button
                type="button"
                onClick={onToggleLang}
                className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-navy-900 text-[10.5px] font-bold border border-gray-200 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                title="تبديل اللغة / Toggle Arabic RTL & English"
              >
                <Globe className="w-3 h-3 text-navy-700" />
                <span>{currentLang === "ar" ? "EN" : "عربي"}</span>
              </button>
            )}
            {isMobile && onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1 rounded-lg text-gray-400 hover:text-navy-900 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close navigation"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Menu Section */}
        <div className="flex flex-col gap-1 mt-1">
          <span className="text-[10px] font-bold text-gray-500 tracking-wider px-3 uppercase">
            {getTranslation("sidebar.menu", currentLang)}
          </span>
          <nav className="flex flex-col gap-1 mt-1">
            {NAV_MENU_ITEMS.map((item) => {
              const Icon = iconMap[item.icon] || LayoutDashboard;
              const isActive = activeId === item.id;
              const displayLabel = currentLang === "ar" ? getTranslation(`nav.${item.id}`, "ar") : item.label;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  type="button"
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-colors group text-start cursor-pointer",
                    isActive
                      ? "bg-navy-50 text-navy-900 font-semibold border-s-2 border-navy-900"
                      : "text-gray-700 hover:text-navy-900 hover:bg-gray-100"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        isActive
                          ? "text-navy-900"
                          : "text-gray-500 group-hover:text-navy-700"
                      )}
                      strokeWidth={isActive ? 2.2 : 1.8}
                    />
                    <span className="whitespace-nowrap">{displayLabel}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-md transition-colors whitespace-nowrap shrink-0",
                        isActive
                          ? "bg-navy-900 text-white"
                          : "bg-gray-100 text-gray-700 group-hover:bg-gray-200"
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
          <span className="text-[10px] font-bold text-gray-500 tracking-wider px-3 uppercase whitespace-nowrap">
            {getTranslation("sidebar.general", currentLang)}
          </span>
          <nav className="flex flex-col gap-1 mt-1">
            {NAV_GENERAL_ITEMS.map((item) => {
              const Icon = iconMap[item.icon] || Settings;
              const isActive = activeId === item.id;
              const displayLabel = currentLang === "ar" ? getTranslation(`nav.${item.id}`, "ar") : item.label;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  type="button"
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors group text-start cursor-pointer",
                    isActive
                      ? "bg-navy-50 text-navy-900 font-semibold border-s-2 border-navy-900"
                      : "text-gray-700 hover:text-navy-900 hover:bg-gray-100"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      isActive
                        ? "text-navy-900"
                        : "text-gray-500 group-hover:text-navy-700"
                    )}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                    <span className="whitespace-nowrap">{displayLabel}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Account & Notifications Card (Expanded Executive Card) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-navy-900 via-navy-950 to-navy-950 p-3.5 text-white border border-white/[0.12] shadow-lg shadow-black/20 shrink-0 mt-4 select-none">
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

        {/* Ambient subtle navy backlight glow */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-navy-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-2.5">
          {/* Top Section: Account Identity Row */}
          <button
            type="button"
            onClick={() => {
              setIsAccountMenuOpen(!isAccountMenuOpen);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center justify-between p-1.5 -m-1.5 rounded-xl hover:bg-white/[0.08] transition-colors text-start group cursor-pointer"
            title="Open Account Menu"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <Avatar className="h-9 w-9 rounded-xl ring-1.5 ring-white/20 shadow-sm">
                  <AvatarImage src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
                  <AvatarFallback className="bg-navy-800 text-white text-xs font-bold rounded-xl">
                    TQ
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success ring-2 ring-navy-950" />
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-bold text-white tracking-tight leading-tight truncate group-hover:text-navy-200 transition-colors">
                    {CURRENT_USER.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10.5px] text-navy-200 font-medium leading-none truncate">
                    {CURRENT_USER.role}
                  </span>
                  <span className="text-[9px] text-white/30">•</span>
                  <span className="text-[9.5px] text-success font-medium leading-none">
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="w-6 h-6 rounded-lg bg-white/5 group-hover:bg-white/15 flex items-center justify-center text-gray-300 group-hover:text-white transition-colors shrink-0">
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
              "w-full flex items-center justify-between p-2 rounded-xl border transition-all duration-200 text-start cursor-pointer",
              unreadCount > 0
                ? "bg-navy-600/25 hover:bg-navy-600/35 border-navy-400/30 text-white shadow-xs"
                : "bg-white/[0.05] hover:bg-white/[0.09] border-white/10 text-gray-300"
            )}
            title="View Practice Notifications"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 relative transition-colors",
                  unreadCount > 0 ? "bg-navy-600 text-white shadow-xs" : "bg-white/10 text-gray-300"
                )}
              >
                <Bell className="w-3.5 h-3.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-gold-300 ring-2 ring-navy-950 animate-pulse" />
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-semibold text-white leading-tight truncate">
                  {unreadCount > 0 ? `${unreadCount} ${getTranslation("sidebar.practice_alerts", currentLang)}` : getTranslation("sidebar.practice_dispatch", currentLang)}
                </span>
                <span className="text-[9.5px] text-gray-300 leading-tight truncate">
                  {unreadCount > 0 ? getTranslation("sidebar.intake_updates", currentLang) : getTranslation("sidebar.all_caught_up", currentLang)}
                </span>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1">
              {unreadCount > 0 ? (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-navy-500/20 text-navy-200 border border-navy-400/30">
                  {unreadCount} new
                </span>
              ) : (
                <span className="text-[10px] text-gray-400">Clear</span>
              )}
              <ChevronRight className="w-3 h-3 text-gray-400" />
            </div>
          </button>

          {/* Bottom Section: Primary Action Button */}
          <button
            type="button"
            onClick={() => {
              setIsAccountMenuOpen(!isAccountMenuOpen);
              setIsNotificationsOpen(false);
            }}
            className="w-full py-2 px-3 rounded-xl bg-navy-800 hover:bg-navy-700 text-white text-xs font-semibold transition-all duration-200 border border-navy-500/30 shadow-xs text-center active:scale-[0.98] cursor-pointer whitespace-nowrap shrink-0 flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-navy-200" />
            <span>{getTranslation("sidebar.manage_account", currentLang)}</span>
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
            <div className="fixed start-4 bottom-20 sm:start-[268px] sm:bottom-6 w-80 bg-white/95 backdrop-blur-3xl border border-gray-300 rounded-2xl shadow-[0_25px_60px_rgba(26,39,68,0.20),0_2px_8px_rgba(0,0,0,0.04)] z-50 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
              {/* Header with Navy Gradient Accent */}
              <div className="p-4 bg-gradient-to-br from-navy-950 to-navy-800 text-white relative overflow-hidden">
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
                    <AvatarFallback className="bg-white text-navy-900 text-sm font-bold rounded-xl">
                      TQ
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white truncate">
                        {CURRENT_USER.name}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-navy-500/20 text-navy-200 border border-navy-400/30">
                        Partner
                      </span>
                    </div>
                    <span className="text-[11px] text-navy-200 truncate block mt-0.5">
                      {CURRENT_USER.email}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                      <span className="text-[10px] font-medium text-success">
                        Senior Counsel • Practice Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Ribbon */}
              <div className="px-4 py-2 bg-gray-100 border-b border-gray-300 flex items-center justify-between text-[11px]">
                <span className="text-gray-500 font-medium">Practice Role</span>
                <span className="font-semibold text-navy-900">Head of Corporate Litigation</span>
              </div>

              {/* Menu Actions */}
              <div className="p-2 flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => {
                    onSelectNav?.("settings");
                    setIsAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-gray-700 hover:text-navy-900 hover:bg-gray-100 transition-colors text-start cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-white group-hover:shadow-xs flex items-center justify-center text-gray-500 group-hover:text-navy-900 transition-all">
                      <Settings className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Account & Preferences</div>
                      <div className="text-[10px] text-gray-500">Security, notifications & profile</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectNav?.("help");
                    setIsAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-gray-700 hover:text-navy-900 hover:bg-gray-100 transition-colors text-start cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-white group-hover:shadow-xs flex items-center justify-center text-gray-500 group-hover:text-navy-900 transition-all">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Counsel Desk & Support</div>
                      <div className="text-[10px] text-gray-500">Priority litigation docket assistance</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Log Out */}
              <div className="p-2 border-t border-gray-300 bg-gray-100/60">
                <button
                  type="button"
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-error hover:bg-error/10 transition-colors text-start cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-error" />
                  <span>{getTranslation("sidebar.sign_out", currentLang)}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar (lg and up) */}
      <aside className="hidden lg:flex w-64 h-screen max-h-screen bg-white border-e border-gray-300 flex-col justify-between p-5 shrink-0 select-none sticky top-0 start-0 z-30">
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Drawer (screens < lg) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 start-0 w-72 max-w-[85vw] h-full bg-white border-e border-gray-300 flex flex-col justify-between p-5 z-10 shadow-2xl animate-in slide-in-from-start duration-250 select-none">
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}
    </>
  );
}

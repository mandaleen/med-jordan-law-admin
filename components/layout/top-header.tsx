"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Menu,
  Plus,
  ChevronDown,
  ChevronRight,
  Settings,
  ShieldAlert,
  HelpCircle,
  LogOut,
  Globe,
  Camera,
  Upload,
  RotateCcw,
  LayoutDashboard,
  Calendar,
  Briefcase,
  Users,
  Wallet,
  FileText,
  FileCheck,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePractice } from "@/lib/practice-context";
import { CURRENT_USER } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationsPopover } from "@/components/modals/notifications-popover";
import { getTranslation } from "@/lib/i18n";

const navIcons: Record<string, React.ElementType> = {
  dashboard: LayoutDashboard,
  bookings: Calendar,
  cases: Briefcase,
  clients: Users,
  contracts: FileCheck,
  leads: Mail,
  finance: Wallet,
  content: FileText,
  settings: Settings,
  audit: ShieldAlert,
  help: HelpCircle,
};

interface TopHeaderProps {
  onOpenMobileMenu?: () => void;
  onOpenSpotlight?: () => void;
  onOpenNewBooking?: () => void;
  className?: string;
}

export function TopHeader({
  onOpenMobileMenu,
  onOpenSpotlight,
  onOpenNewBooking,
  className,
}: TopHeaderProps) {
  const router = useRouter();
  const {
    activeNav,
    setActiveNav,
    currentUser,
    updateUserAvatar,
    resetUserAvatar,
    notifications,
    markNotificationsRead,
    lang,
    setLang,
    t,
    showToast,
  } = usePractice();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const NavIcon = navIcons[activeNav] || LayoutDashboard;

  const userInitials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsAccountMenuOpen(false);
        setIsNotificationsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleUpdateAvatar = (newAvatarUrl: string) => {
    updateUserAvatar(newAvatarUrl);
    showToast(`✓ Profile photo updated for ${currentUser.name}`);
  };

  const handleResetAvatar = () => {
    resetUserAvatar();
    showToast("✓ Profile photo reset to default");
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please choose a valid image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image is too large. Please select a photo under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        handleUpdateAvatar(result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <>
      {/* Hidden file input for uploading profile photo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleImageFileChange}
        aria-label="Upload profile photo"
      />

      <header
        className={cn(
          "sticky top-3 z-30 flex items-center justify-between mx-3 mt-3 sm:mx-5 lg:mx-6 px-3 sm:px-4 py-2 surface-card !rounded-2xl bg-white/90 backdrop-blur-md shrink-0 gap-2 sm:gap-4 transition-all",
          className
        )}
      >
        {/* Left Section: Mobile Menu Trigger / Current Workspace Context */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          {/* Mobile Menu Button (lg:hidden) */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 -ms-1 rounded-xl text-navy-900 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile Firm Monogram (< lg) */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-navy-900 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              MJL
            </div>
            <div className="hidden xs:block">
              <span className="text-xs font-bold text-navy-900 leading-tight block truncate">
                Med Jordan Law
              </span>
            </div>
          </div>

          {/* Desktop Workspace Breadcrumb (lg:flex) */}
          <div className="hidden lg:flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-navy-50 text-navy-900 border border-navy-100 flex items-center justify-center shrink-0 shadow-2xs">
              <NavIcon className="w-4 h-4 text-navy-900" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-navy-900 leading-tight capitalize">
                {lang === "ar"
                  ? getTranslation(`nav.${activeNav}`, "ar")
                  : activeNav === "dashboard"
                  ? "Dashboard"
                  : activeNav}
              </span>
            </div>
          </div>
        </div>

        {/* Center Section: Modern Look Search Bar */}
        <div className="flex-1 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-1 sm:mx-2 min-w-0">
          <button
            type="button"
            onClick={onOpenSpotlight}
            className="w-full flex items-center justify-between px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gray-100/80 hover:bg-gray-100/95 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/15 focus:border-navy-900/30 border border-gray-200/70 transition-all duration-150 cursor-pointer group text-start shadow-2xs"
            title="Search (⌘K)"
            aria-label="Search"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <Search className="w-4 h-4 text-gray-400 group-hover:text-navy-900 transition-colors shrink-0" />
              <span className="text-xs text-gray-500 group-hover:text-gray-700 font-normal truncate">
                {lang === "ar" ? "بحث (⌘K)..." : "Search (⌘K)..."}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0 ms-2">
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-gray-400 bg-white border border-gray-200/90 rounded shadow-2xs group-hover:text-gray-600 transition-colors">
                <span className="text-[11px]">⌘</span>K
              </kbd>
            </div>
          </button>
        </div>

        {/* Right Section: Action Button + Notification Button + Account Circle Tab */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Quick Action Button: New Consultation / Booking */}
          {onOpenNewBooking && (
            <button
              type="button"
              onClick={onOpenNewBooking}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
              title="Schedule Consultation"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t("action.new_consultation")}</span>
              <span className="md:hidden">{t("action.new")}</span>
            </button>
          )}

          {/* Notification Button with Interactive Popover */}
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              onClick={() => {
                setIsNotificationsOpen((prev) => !prev);
                setIsAccountMenuOpen(false);
              }}
              className={cn(
                "relative p-2 rounded-xl text-gray-600 hover:text-navy-900 hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200/60 active:scale-95 cursor-pointer group",
                isNotificationsOpen && "bg-gray-100 text-navy-900 border-gray-200/80"
              )}
              aria-label="View notifications"
              title="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform group-hover:rotate-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 bg-navy-900 text-white text-[9.5px] font-bold rounded-full flex items-center justify-center ring-2 ring-white shadow-2xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover positioned below the button */}
            <NotificationsPopover
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
              items={notifications}
              onMarkAllRead={() => {
                markNotificationsRead();
              }}
              placement="top-bar"
            />
          </div>

          {/* Subtle Vertical Divider */}
          <div className="h-6 w-px bg-gray-200/80 mx-0.5 hidden xs:block" />

          {/* Account Circle Tab with Profile Popover */}
          <div className="relative" ref={accountMenuRef}>
            <button
              type="button"
              onClick={() => {
                setIsAccountMenuOpen((prev) => !prev);
                setIsNotificationsOpen(false);
              }}
              className={cn(
                "flex items-center gap-2 p-1 sm:ps-1 sm:pe-2.5 rounded-full hover:bg-gray-100/90 border border-transparent hover:border-gray-200/80 transition-all cursor-pointer group select-none active:scale-98",
                isAccountMenuOpen && "bg-gray-100/90 border-gray-200/90"
              )}
              aria-label="Account menu"
              title="Account Menu"
            >
              {/* Circle Avatar with Status Indicator */}
              <div className="relative shrink-0">
                <Avatar className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full ring-2 ring-gray-200 group-hover:ring-navy-900/30 transition-all shadow-2xs">
                  <AvatarImage
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="rounded-full object-cover"
                  />
                  <AvatarFallback className="bg-navy-900 text-white text-xs font-bold rounded-full">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                {/* Active green status dot */}
                <span className="absolute bottom-0 end-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white shadow-2xs" />
              </div>

              {/* User Identity Details (Visible on desktop) */}
              <div className="hidden md:flex flex-col text-start leading-tight min-w-0">
                <span className="text-xs font-bold text-navy-900 truncate max-w-[120px] group-hover:text-navy-950 transition-colors">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-gray-500 font-medium leading-none mt-0.5 truncate max-w-[120px]">
                  {currentUser.role}
                </span>
              </div>

              {/* Dropdown Chevron */}
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 text-gray-400 group-hover:text-navy-900 transition-transform duration-200 shrink-0 hidden xs:block",
                  isAccountMenuOpen && "rotate-180 text-navy-900"
                )}
              />
            </button>

            {/* Account Circle Tab Dropdown Popover */}
            {isAccountMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsAccountMenuOpen(false)}
                />
                <div className="absolute end-0 top-full mt-2 w-72 sm:w-80 bg-white border border-gray-200/90 rounded-2xl shadow-[0_20px_50px_rgba(26,39,68,0.18),0_2px_8px_rgba(0,0,0,0.04)] z-50 overflow-hidden animate-in zoom-in-95 fade-in duration-150">
                  {/* Clean Profile Header */}
                  <div className="p-4 flex items-center gap-3.5 bg-gray-50/80 border-b border-gray-100">
                    <div
                      className="relative shrink-0 group/menuavatar cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                      title={lang === "ar" ? "اضغط لرفع صورة جديدة" : "Click to change photo"}
                    >
                      <Avatar className="w-13 h-13 rounded-2xl ring-2 ring-navy-900/10 shadow-sm shrink-0">
                        <AvatarImage
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="rounded-2xl object-cover"
                        />
                        <AvatarFallback className="bg-navy-900 text-white text-base font-bold rounded-2xl">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/45 backdrop-blur-2xs rounded-2xl opacity-0 group-menuavatar:opacity-100 flex items-center justify-center transition-all duration-150 text-white shadow-inner">
                        <Camera className="w-4 h-4" />
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-navy-950 truncate">
                          {currentUser.name}
                        </span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-navy-100 text-navy-800 shrink-0">
                          Partner
                        </span>
                      </div>
                      <span className="text-[11.5px] text-gray-500 truncate block mt-0.5">
                        {currentUser.email}
                      </span>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-1.5 text-[11px] font-semibold text-navy-900 hover:text-navy-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        <span>{lang === "ar" ? "تغيير الصورة" : "Change Photo"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Actions List */}
                  <div className="p-1.5 flex flex-col gap-0.5">
                    {/* Upload Photo Button */}
                    <button
                      type="button"
                      onClick={() => {
                        fileInputRef.current?.click();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:text-navy-950 hover:bg-gray-100 transition-colors text-start cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Camera className="w-4 h-4 text-gray-400 group-hover:text-navy-900 transition-colors" />
                        <span>{lang === "ar" ? "رفع صورة" : "Upload Photo"}</span>
                      </div>
                      <Upload className="w-3.5 h-3.5 text-gray-400 group-hover:text-navy-900" />
                    </button>

                    {/* Reset Photo (if customized) */}
                    {currentUser.avatar !== CURRENT_USER.avatar && (
                      <button
                        type="button"
                        onClick={handleResetAvatar}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-amber-700 hover:text-amber-900 hover:bg-amber-50 transition-colors text-start cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <RotateCcw className="w-4 h-4 text-amber-600" />
                          <span>{lang === "ar" ? "استعادة الافتراضية" : "Reset Photo"}</span>
                        </div>
                      </button>
                    )}

                    {/* Settings */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveNav("settings");
                        setIsAccountMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:text-navy-950 hover:bg-gray-100 transition-colors text-start cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Settings className="w-4 h-4 text-gray-400 group-hover:text-navy-900 transition-colors" />
                        <span>{lang === "ar" ? "الإعدادات" : "Settings"}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                    </button>

                    {/* Audit Trail */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveNav("audit");
                        setIsAccountMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:text-navy-950 hover:bg-gray-100 transition-colors text-start cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <ShieldAlert className="w-4 h-4 text-gray-400 group-hover:text-navy-900 transition-colors" />
                        <span>{lang === "ar" ? "سجل التدقيق" : "Audit"}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                    </button>

                    {/* Help & Support */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveNav("help");
                        setIsAccountMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:text-navy-950 hover:bg-gray-100 transition-colors text-start cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-navy-900 transition-colors" />
                        <span>{lang === "ar" ? "المساعدة" : "Help"}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                    </button>

                    {/* Language Switcher */}
                    <div className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-gray-700">
                      <div className="flex items-center gap-2.5">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span>{lang === "ar" ? "اللغة" : "Language"}</span>
                      </div>
                      <div className="inline-flex items-center p-0.5 rounded-lg bg-gray-100 border border-gray-200/80 text-[11px]">
                        <button
                          type="button"
                          onClick={() => {
                            if (lang !== "en") setLang("en");
                          }}
                          className={cn(
                            "px-2 py-0.5 rounded-md transition-all cursor-pointer font-medium",
                            lang === "en"
                              ? "bg-white text-navy-950 font-bold shadow-2xs"
                              : "text-gray-500 hover:text-gray-900"
                          )}
                        >
                          EN
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (lang !== "ar") setLang("ar");
                          }}
                          className={cn(
                            "px-2 py-0.5 rounded-md transition-all cursor-pointer font-medium",
                            lang === "ar"
                              ? "bg-white text-navy-950 font-bold shadow-2xs"
                              : "text-gray-500 hover:text-gray-900"
                          )}
                        >
                          عربي
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sign Out */}
                  <div className="p-1.5 border-t border-gray-100 bg-gray-50/50">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        if (typeof window !== "undefined") {
                          localStorage.removeItem("mjl_session_user");
                        }
                        router.push("/login");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50/80 transition-colors text-start cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      <span>{getTranslation("sidebar.sign_out", lang)}</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

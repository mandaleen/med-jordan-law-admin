"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  FileCheck,
  Mail,
  ShieldAlert,
  Globe,
  X,
  Camera,
  Upload,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NAV_MENU_ITEMS,
  CURRENT_USER,
  UserProfile,
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
  onSelectLang?: (lang: "en" | "ar") => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  currentUser?: UserProfile;
  onUpdateAvatar?: (avatarUrl: string) => void;
  onResetAvatar?: () => void;
  showToast?: (message: string) => void;
}

export function Sidebar({
  activeId = "dashboard",
  onSelectNav,
  notifications = NOTIFICATIONS,
  onMarkNotificationsRead,
  currentLang = "en",
  onToggleLang,
  onSelectLang,
  isOpenMobile = false,
  onCloseMobile,
  currentUser: propsCurrentUser,
  onUpdateAvatar,
  onResetAvatar,
  showToast,
}: SidebarProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(CURRENT_USER);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const user = propsCurrentUser || currentUser;

  const handleUpdateAvatar = (newAvatarUrl: string) => {
    if (onUpdateAvatar) {
      onUpdateAvatar(newAvatarUrl);
    } else {
      setCurrentUser((prev) => ({ ...prev, avatar: newAvatarUrl }));
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("mjl_session_user");
          const parsed = stored ? JSON.parse(stored) : {};
          localStorage.setItem(
            "mjl_session_user",
            JSON.stringify({ ...parsed, avatar: newAvatarUrl })
          );
        } catch {
          // ignore
        }
      }
    }
    showToast?.(`✓ Profile photo updated for ${user.name}`);
  };

  const handleResetAvatar = () => {
    if (onResetAvatar) {
      onResetAvatar();
    } else {
      setCurrentUser((prev) => ({ ...prev, avatar: CURRENT_USER.avatar }));
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("mjl_session_user");
          if (stored) {
            const parsed = JSON.parse(stored);
            delete parsed.avatar;
            localStorage.setItem("mjl_session_user", JSON.stringify(parsed));
          }
        } catch {
          // ignore
        }
      }
    }
    showToast?.("✓ Profile photo reset to default");
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast?.("Please choose a valid image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast?.("Image is too large. Please select a photo under 5MB.");
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

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("mjl_session_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.name) {
            setCurrentUser((prev) => ({
              ...prev,
              name: parsed.name,
              email: parsed.email || prev.email,
              role: parsed.role || prev.role,
              avatar: (parsed.avatar && !parsed.avatar.includes("photo-1534528741775-53994a69daeb")) ? parsed.avatar : prev.avatar,
            }));
          }
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

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
      {/* Top Section: Logo & Nav items */}
      <div className="flex flex-col gap-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-0.5">
        {/* Brand Logo & Mobile Close Button */}
        <div className="flex items-center justify-between px-1 pt-1 pb-1 shrink-0 relative">
          <div className="flex-1 flex justify-center">
            <Logo
              className="w-full max-w-[195px] h-auto text-navy-900"
              label="Med Jordan Law"
            />
          </div>
          {isMobile && onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="absolute end-0 top-0 p-1.5 rounded-lg text-gray-400 hover:text-navy-900 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Primary Navigation */}
        <nav className="flex flex-col gap-1 mt-0.5">
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

      {/* Bottom Account & Notifications Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-navy-900 via-navy-950 to-navy-950 p-2.5 text-white border border-white/[0.12] shadow-lg shadow-black/20 shrink-0 mt-4 select-none">
        {/* Subtle architectural grid watermark */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.06] rounded-2xl overflow-hidden">
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

        <div className="relative z-10 flex flex-col gap-2">
          {/* Top Section: Account Identity Row (Clickable to open Account Menu) */}
          <button
            type="button"
            onClick={() => {
              setIsAccountMenuOpen(!isAccountMenuOpen);
              setIsNotificationsOpen(false);
            }}
            className="w-full flex items-center justify-between p-2 -m-0.5 rounded-xl hover:bg-white/[0.08] transition-colors text-start group cursor-pointer"
            title="Open Account Menu"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0 group/avatar">
                <Avatar className="w-12 h-12 rounded-2xl after:rounded-2xl ring-2 ring-white/20 shadow-md transition-transform group-hover/avatar:scale-[1.03]">
                  <AvatarImage
                    src={user.avatar}
                    alt={user.name}
                    className="rounded-2xl object-cover"
                  />
                  <AvatarFallback className="bg-navy-800 text-white text-sm font-bold rounded-2xl">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success ring-2 ring-navy-950 shadow-xs" />

                {/* Quick Upload Hover Overlay */}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  title={currentLang === "ar" ? "اضغط لرفع صورة شخصية" : "Click to upload photo"}
                  className="absolute inset-0 bg-navy-950/70 backdrop-blur-2xs rounded-2xl opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity duration-150 cursor-pointer shadow-inner"
                >
                  <Camera className="w-4 h-4 text-white" />
                </span>
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-[13.5px] font-bold text-white tracking-tight leading-tight truncate group-hover:text-navy-200 transition-colors">
                  {user.name}
                </span>
                <span className="text-[11px] text-navy-200 font-medium leading-none truncate mt-1">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="w-6 h-6 rounded-lg bg-white/5 group-hover:bg-white/15 flex items-center justify-center text-gray-300 group-hover:text-white transition-colors shrink-0 ms-1">
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-200",
                  isAccountMenuOpen && "rotate-180 text-white"
                )}
              />
            </div>
          </button>

          {/* Minimal Notifications Button */}
          <button
            type="button"
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsAccountMenuOpen(false);
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.07] transition-all text-start cursor-pointer group"
            title="Notifications"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative shrink-0 flex items-center justify-center">
                <Bell className="w-3.5 h-3.5 text-navy-200 group-hover:text-white transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-gold-400 ring-1 ring-navy-950" />
                )}
              </div>
              <span className="text-[11.5px] font-medium text-navy-100 group-hover:text-white transition-colors truncate">
                {currentLang === "ar" ? "الإشعارات" : "Notifications"}
              </span>
            </div>

            {unreadCount > 0 ? (
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-white/10 text-white/90 border border-white/15">
                {unreadCount}
              </span>
            ) : (
              <span className="text-[10px] text-white/40">0</span>
            )}
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

        {/* Minimal Account Menu Popover */}
        {isAccountMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsAccountMenuOpen(false)}
            />
            <div className="fixed start-4 bottom-20 lg:start-[264px] lg:bottom-5 w-76 bg-white border border-gray-200/90 rounded-2xl shadow-[0_20px_50px_rgba(26,39,68,0.18),0_2px_8px_rgba(0,0,0,0.04)] z-50 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
              {/* Clean Minimal Profile Header */}
              <div className="p-4 flex items-center gap-3.5 bg-gray-50/80 border-b border-gray-100">
                <div
                  className="relative shrink-0 group/popavatar cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  title={currentLang === "ar" ? "اضغط لرفع صورة جديدة" : "Click to change photo"}
                >
                  <Avatar className="w-14 h-14 rounded-2xl after:rounded-2xl ring-2 ring-navy-900/10 shadow-sm shrink-0">
                    <AvatarImage src={user.avatar} alt={user.name} className="rounded-2xl object-cover" />
                    <AvatarFallback className="bg-navy-900 text-white text-base font-bold rounded-2xl">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/45 backdrop-blur-2xs rounded-2xl opacity-0 group-hover/popavatar:opacity-100 flex items-center justify-center transition-all duration-150 text-white shadow-inner">
                    <Camera className="w-4 h-4" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success ring-2 ring-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-navy-950 truncate">
                      {user.name}
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-navy-100 text-navy-800">
                      Partner
                    </span>
                  </div>
                  <span className="text-[11.5px] text-gray-500 truncate block mt-0.5">
                    {user.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-1.5 text-[11px] font-semibold text-navy-900 hover:text-navy-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{currentLang === "ar" ? "تغيير الصورة" : "Change Photo"}</span>
                  </button>
                </div>
              </div>

              {/* Action List */}
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
                    <span>{currentLang === "ar" ? "رفع صورة شخصية جديدة" : "Upload New Photo"}</span>
                  </div>
                  <Upload className="w-3.5 h-3.5 text-gray-400 group-hover:text-navy-900" />
                </button>

                {/* Reset to Default Photo if customized */}
                {user.avatar !== CURRENT_USER.avatar && (
                  <button
                    type="button"
                    onClick={handleResetAvatar}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-amber-700 hover:text-amber-900 hover:bg-amber-50 transition-colors text-start cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <RotateCcw className="w-4 h-4 text-amber-600" />
                      <span>{currentLang === "ar" ? "استعادة الصورة الافتراضية" : "Reset Photo to Default"}</span>
                    </div>
                  </button>
                )}

                {/* Settings */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectNav?.("settings");
                    setIsAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:text-navy-950 hover:bg-gray-100 transition-colors text-start cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <Settings className="w-4 h-4 text-gray-400 group-hover:text-navy-900 transition-colors" />
                    <span>{currentLang === "ar" ? "الإعدادات" : "Settings"}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </button>

                {/* Audit Trail */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectNav?.("audit");
                    setIsAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:text-navy-950 hover:bg-gray-100 transition-colors text-start cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-gray-400 group-hover:text-navy-900 transition-colors" />
                    <span>{currentLang === "ar" ? "سجل التدقيق والامتثال" : "Audit Trail"}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </button>

                {/* Help & Support */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectNav?.("help");
                    setIsAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:text-navy-950 hover:bg-gray-100 transition-colors text-start cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-navy-900 transition-colors" />
                    <span>{currentLang === "ar" ? "المساعدة والدعم" : "Help & Support"}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </button>

                {/* Language Switcher */}
                <div className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-gray-700">
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span>{currentLang === "ar" ? "اللغة" : "Language"}</span>
                  </div>
                  <div className="inline-flex items-center p-0.5 rounded-lg bg-gray-100 border border-gray-200/80 text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        if (currentLang !== "en") {
                          onSelectLang ? onSelectLang("en") : onToggleLang?.();
                        }
                      }}
                      className={cn(
                        "px-2 py-0.5 rounded-md transition-all cursor-pointer font-medium",
                        currentLang === "en"
                          ? "bg-white text-navy-950 font-bold shadow-2xs"
                          : "text-gray-500 hover:text-gray-900"
                      )}
                    >
                      EN
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (currentLang !== "ar") {
                          onSelectLang ? onSelectLang("ar") : onToggleLang?.();
                        }
                      }}
                      className={cn(
                        "px-2 py-0.5 rounded-md transition-all cursor-pointer font-medium",
                        currentLang === "ar"
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
      {/* Hidden file input for uploading profile photo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleImageFileChange}
        aria-label="Upload profile photo"
      />

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

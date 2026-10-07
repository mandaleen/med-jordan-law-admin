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
} from "@/lib/mock-data";
import { Logo } from "@/components/brand/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const NAV_GROUPS = [
  { label: { en: "Intake", ar: "الاستقبال" }, ids: ["dashboard", "leads", "bookings"] },
  { label: { en: "Practice", ar: "المكتب" }, ids: ["cases", "clients", "contracts"] },
  { label: { en: "Business", ar: "الأعمال" }, ids: ["finance", "content"] },
];

// Short sentence-case labels for the rail; full names stay in mock-data and i18n.
const NAV_LABELS: Record<string, string> = {
  dashboard: "Today",
  bookings: "Consultations",
  cases: "Matters",
  clients: "Clients",
  contracts: "Fee agreements",
  leads: "Inquiries",
  finance: "Finance",
  content: "Publications",
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
  notifications,
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
      <div className="flex flex-col gap-5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center justify-between px-2 pt-2 pb-5 shrink-0 border-b border-white/10">
          <Logo className="w-[158px] h-auto text-gray-50" label="Med Jordan Law" />
          {isMobile && onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <nav aria-label="Primary" className="flex flex-col gap-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.label.en} className="flex flex-col gap-0.5">
              <span className="flex items-center gap-2 px-3 pb-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-gold-300/70 rtl:tracking-normal">
                <span aria-hidden="true" className="h-px w-3 bg-gold-500/60" />
                {currentLang === "ar" ? group.label.ar : group.label.en}
              </span>
              {group.ids.map((id) => {
                const item = NAV_MENU_ITEMS.find((n) => n.id === id);
                if (!item) return null;
                const Icon = iconMap[item.icon] || LayoutDashboard;
                const isActive = activeId === item.id;
                const displayLabel = currentLang === "ar" ? getTranslation(`nav.${item.id}`, "ar") : NAV_LABELS[item.id] ?? item.label;
                const isNew = /new/i.test(item.badge ?? "");
                const count = item.badge?.match(/\d+/)?.[0];
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    type="button"
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "relative w-full flex items-center justify-between gap-2 h-10 px-3 rounded-lg text-[13.5px] transition-colors group text-start cursor-pointer focus-visible:outline-2 focus-visible:outline-gold-300",
                      isActive
                        ? "bg-white/[0.09] text-white font-medium shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
                        : "text-white/65 hover:text-white hover:bg-white/[0.05]"
                    )}
                  >
                    {isActive && (
                      <span aria-hidden="true" className="absolute start-0 top-2 bottom-2 w-[3px] rounded-full bg-gold-500" />
                    )}
                    <span className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={cn("w-[17px] h-[17px] shrink-0 transition-colors", isActive ? "text-gold-300" : "text-white/45 group-hover:text-gold-300")}
                        strokeWidth={1.7}
                        aria-hidden="true"
                      />
                      <span className="truncate">{displayLabel}</span>
                    </span>
                    {count && (
                      <span
                        className={cn(
                          "font-numeric text-[11px] shrink-0 min-w-5 h-5 px-1.5 rounded-full inline-flex items-center justify-center",
                          isNew ? "bg-gold-500 text-navy-950 font-semibold" : "bg-white/10 text-white/70"
                        )}
                      >
                        {count}
                        {isNew && <span className="sr-only"> new</span>}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="relative shrink-0 pt-4 mt-4 border-t border-white/10">
        <button
          type="button"
          onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
          aria-haspopup="menu"
          aria-expanded={isAccountMenuOpen}
          className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] hover:border-gold-500/40 transition-colors text-start group cursor-pointer"
        >
          <div className="relative shrink-0">
            <Avatar className="w-9 h-9 rounded-lg after:rounded-lg">
              <AvatarImage src={user.avatar} alt="" className="rounded-lg object-cover" />
              <AvatarFallback className="bg-navy-700 text-white text-xs font-semibold rounded-lg">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-0.5 -end-0.5 w-2.5 h-2.5 rounded-full bg-success ring-2 ring-navy-900" />
          </div>
          <span className="flex flex-col min-w-0 flex-1">
            <span className="text-[13.5px] font-medium text-white leading-tight truncate">{user.name}</span>
            <span className="text-xs text-gold-300/80 leading-tight truncate mt-0.5">{user.role}</span>
          </span>
          <ChevronDown
            className={cn("w-4 h-4 text-white/50 transition-transform duration-200 shrink-0", isAccountMenuOpen && "rotate-180")}
            aria-hidden="true"
          />
        </button>

        {/* Minimal Account Menu Popover */}
        {isAccountMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsAccountMenuOpen(false)}
            />
            <div className="fixed start-4 bottom-[76px] w-72 bg-white border border-gray-200 rounded-xl shadow-[var(--shadow-float)] z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-1 duration-150">
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
      <aside className="hidden lg:flex w-[248px] h-screen max-h-screen bg-gradient-to-b from-navy-900 to-navy-950 border-e border-navy-950 flex-col justify-between px-3 py-4 shrink-0 select-none sticky top-0 start-0 z-30">
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
          <aside className="fixed inset-y-0 start-0 w-72 max-w-[85vw] h-full bg-gradient-to-b from-navy-900 to-navy-950 border-e border-navy-950 flex flex-col justify-between px-3 py-4 z-10 shadow-2xl animate-in slide-in-from-start duration-250 select-none">
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}
    </>
  );
}

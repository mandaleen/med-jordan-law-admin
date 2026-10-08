"use client";

import React from "react";
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
  FileCheck,
  Mail,
  ShieldAlert,
  ArrowUpRight,
  Video,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NAV_MENU_ITEMS,
  NAV_GENERAL_ITEMS,
  UPCOMING_CONSULTATIONS,
} from "@/lib/mock-data";
import { Logo } from "@/components/brand/logo";
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
  currentLang?: "en" | "ar";
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({
  activeId = "dashboard",
  onSelectNav,
  currentLang = "en",
  isOpenMobile = false,
  onCloseMobile,
}: SidebarProps) {
  const router = useRouter();
  const nextUp = UPCOMING_CONSULTATIONS[0];

  const handleNavClick = (id: string) => {
    onSelectNav?.(id);
    onCloseMobile?.();
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem("mjl_session_user");
    } catch {
      // storage unavailable
    }
    router.push("/login");
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

  const label = (id: string, fallback: string) =>
    currentLang === "ar" ? getTranslation(`nav.${id}`, "ar") : fallback;

  const renderItem = (
    item: { id: string; label: string; icon: string; badge?: string },
    onClick: () => void,
    opts: { active?: boolean; danger?: boolean; text?: string } = {}
  ) => {
    const Icon = iconMap[item.icon] || LayoutDashboard;
    const isActive = !!opts.active;
    return (
      <li key={item.id} className="relative">
        {isActive && (
          <span
            aria-hidden="true"
            className="absolute -start-4 top-1/2 -translate-y-1/2 h-7 w-1 rounded-e-full bg-navy-900"
          />
        )}
        <button
          type="button"
          onClick={onClick}
          aria-current={isActive ? "page" : undefined}
          className={cn(
            "group w-full flex items-center gap-3 ps-2 pe-3 py-[7px] rounded-2xl text-[13.5px] text-start cursor-pointer transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600/40",
            isActive
              ? "bg-navy-50 text-navy-950 font-semibold"
              : opts.danger
              ? "text-gray-500 hover:text-error hover:bg-error/5 font-medium"
              : "text-gray-500 hover:text-navy-900 hover:bg-gray-50 font-medium"
          )}
        >
          <span
            className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200",
              isActive
                ? "bg-navy-900 text-white shadow-[0_6px_14px_-4px_rgba(26,39,68,0.55)]"
                : opts.danger
                ? "bg-transparent text-gray-400 group-hover:text-error"
                : "bg-transparent text-gray-400 group-hover:bg-white group-hover:text-navy-700 group-hover:shadow-xs"
            )}
          >
            <Icon className="w-[17px] h-[17px]" strokeWidth={isActive ? 2.1 : 1.8} />
          </span>
          <span className="flex-1 truncate">{opts.text ?? item.label}</span>
          {item.badge && (
            <span
              className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0",
                isActive ? "bg-navy-900 text-white" : "bg-navy-100 text-navy-700"
              )}
            >
              {item.badge}
            </span>
          )}
        </button>
      </li>
    );
  };

  const renderContent = (isMobile: boolean) => (
    <>
      <div className="flex-1 min-h-0 -mx-4 px-4 flex flex-col gap-5 overflow-y-auto no-scrollbar">
        {/* Brand */}
        <div className="relative flex items-center px-2 pt-1 shrink-0">
          <Logo className="w-full max-w-[164px] h-auto text-navy-900" label="Med Jordan Law" />
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

        {/* Menu */}
        <nav aria-label="Primary" className="flex flex-col gap-1.5">
          <p className="px-2 text-[10.5px] font-semibold tracking-[0.14em] uppercase text-gray-400">
            {getTranslation("sidebar.menu", currentLang)}
          </p>
          <ul className="flex flex-col gap-0.5">
            {NAV_MENU_ITEMS.map((item) =>
              renderItem(item, () => handleNavClick(item.id), {
                active: activeId === item.id,
                text: label(item.id, item.label),
              })
            )}
          </ul>
        </nav>

        {/* General */}
        <nav aria-label="General" className="flex flex-col gap-1.5">
          <p className="px-2 text-[10.5px] font-semibold tracking-[0.14em] uppercase text-gray-400">
            {getTranslation("sidebar.general", currentLang)}
          </p>
          <ul className="flex flex-col gap-0.5">
            {NAV_GENERAL_ITEMS.map((item) =>
              item.id === "logout"
                ? renderItem(item, handleSignOut, {
                    danger: true,
                    text: getTranslation("sidebar.sign_out", currentLang),
                  })
                : renderItem(item, () => handleNavClick(item.id), {
                    active: activeId === item.id,
                    text: label(item.id, item.label),
                  })
            )}
          </ul>
        </nav>
      </div>

      {/* Next consultation card */}
      {nextUp && (
        <div className="surface-dark shrink-0 mt-4 p-4 hidden [@media(min-height:880px)]:block">
          <svg
            aria-hidden="true"
            className="absolute -end-10 -bottom-12 w-44 h-44 text-white/[0.07] pointer-events-none"
            viewBox="0 0 200 200"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="100" cy="100" r="30" />
            <circle cx="100" cy="100" r="55" />
            <circle cx="100" cy="100" r="80" />
            <circle cx="100" cy="100" r="105" />
          </svg>

          <div className="relative flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-gold-500 opacity-60 animate-ping" />
                <span className="relative w-2 h-2 rounded-full bg-gold-500" />
              </span>
              <span className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-white/70">
                {currentLang === "ar" ? "التالي" : "Next up"}
              </span>
            </div>

            <div className="min-w-0">
              <p className="text-[15px] font-semibold leading-tight tracking-tight truncate">
                {nextUp.clientName}
              </p>
              <p className="mt-1 text-[11.5px] text-white/60 flex items-center gap-1.5 truncate">
                <Video className="w-3 h-3 shrink-0" />
                <span className="truncate">{nextUp.countdown}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleNavClick("bookings")}
              className="group w-full inline-flex items-center justify-between gap-2 ps-3.5 pe-1.5 py-1.5 rounded-full bg-white text-navy-900 text-xs font-semibold hover:bg-navy-50 transition-colors cursor-pointer"
            >
              <span>{currentLang === "ar" ? "عرض الجدول" : "View schedule"}</span>
              <span className="w-6 h-6 rounded-full bg-navy-900 text-white flex items-center justify-center transition-transform group-hover:rotate-12">
                <ArrowUpRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop: floating rounded panel */}
      <aside className="hidden lg:flex w-[264px] shrink-0 sticky top-0 h-screen p-3 pe-0 z-30 select-none">
        <div className="flex flex-col w-full h-full surface-card px-4 py-5">
          {renderContent(false)}
        </div>
      </aside>

      {/* Mobile drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-navy-950/45 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 start-0 w-[288px] max-w-[88vw] p-3 z-10 animate-in slide-in-from-start duration-250 select-none">
            <div className="flex flex-col w-full h-full surface-card px-4 py-5 shadow-2xl">
              {renderContent(true)}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

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
  Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_MENU_ITEMS, NAV_GENERAL_ITEMS } from "@/lib/mock-data";

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
}

export function Sidebar({ activeId = "dashboard", onSelectNav }: SidebarProps) {
  const [currentNav, setCurrentNav] = useState(activeId);

  const handleNavClick = (id: string) => {
    setCurrentNav(id);
    if (onSelectNav) onSelectNav(id);
  };

  return (
    <aside className="w-64 h-screen max-h-screen bg-white border-r border-[#EBEFF3] flex flex-col justify-between p-5 shrink-0 select-none sticky top-0 left-0 z-30 overflow-hidden">
      {/* Top Section: Logo & Nav items */}
      <div className="flex flex-col gap-5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-0.5">
        {/* Logo Lockup matching Donezo badge style */}
        <div className="flex items-center gap-3 px-1 py-1 shrink-0">
          <div className="h-10 w-10 rounded-full bg-[#0A2342] flex items-center justify-center text-white font-bold text-sm shadow-xs ring-4 ring-blue-50/80 shrink-0">
            <span className="tracking-tighter">MJL</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-[16px] text-[#0A2342] tracking-tight leading-none truncate">
              Med Jordan Law
            </span>
            <span className="text-[11px] text-slate-400 font-medium tracking-wide mt-1">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Menu Section */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold text-slate-400 tracking-wider px-3 uppercase">
            Menu
          </span>
          <nav className="flex flex-col gap-0.5 mt-1">
            {NAV_MENU_ITEMS.map((item) => {
              const Icon = iconMap[item.icon] || LayoutDashboard;
              const isActive = currentNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  type="button"
                  className={cn(
                    "relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all group text-left cursor-pointer",
                    isActive
                      ? "bg-[#EFF6FF] text-[#0A2342] font-semibold shadow-2xs"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  {/* Left accent indicator pill matching Donezo */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#0A2342]" />
                  )}

                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isActive
                          ? "text-[#0A2342]"
                          : "text-slate-400 group-hover:text-slate-600"
                      )}
                      strokeWidth={isActive ? 2.2 : 1.8}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors",
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
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold text-slate-400 tracking-wider px-3 uppercase">
            General
          </span>
          <nav className="flex flex-col gap-0.5 mt-1">
            {NAV_GENERAL_ITEMS.map((item) => {
              const Icon = iconMap[item.icon] || Settings;
              const isActive = currentNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  type="button"
                  className={cn(
                    "relative flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all group text-left cursor-pointer",
                    isActive
                      ? "bg-[#EFF6FF] text-[#0A2342] font-semibold"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#0A2342]" />
                  )}
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive
                        ? "text-[#0A2342]"
                        : "text-slate-400 group-hover:text-slate-600"
                    )}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Promo / Support Card - Anchored at the bottom */}
      <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#061426] via-[#0A2342] to-[#0D2F56] p-4 text-white shadow-md shrink-0 mt-4">
        {/* Subtle decorative wave SVG */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg
            className="w-full h-full object-cover"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="none"
              stroke="#60A5FA"
              strokeWidth="2"
              d="M-20,100 C40,40 100,160 220,90"
            />
            <path
              fill="none"
              stroke="#93C5FD"
              strokeWidth="1.5"
              d="M-20,130 C50,70 120,190 220,120"
            />
            <path
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2.5"
              d="M-20,70 C30,10 90,130 220,60"
            />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col">
          <div className="h-7 w-7 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center text-white mb-2.5 border border-white/10">
            <Headphones className="w-3.5 h-3.5 text-blue-200" />
          </div>

          <h4 className="text-[13px] font-bold text-white mb-0.5">Need help?</h4>
          <p className="text-[11px] text-slate-300 leading-snug mb-3">
            Contact our senior legal advisory desk anytime.
          </p>

          <button
            type="button"
            className="w-full py-2 px-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-xs text-center active:scale-[0.98] cursor-pointer"
          >
            Contact Support
          </button>
        </div>
      </div>
    </aside>
  );
}

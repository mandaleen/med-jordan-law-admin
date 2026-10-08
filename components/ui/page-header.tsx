"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-1",
        className
      )}
    >
      <div className="flex flex-col gap-1 min-w-0">
        {eyebrow && (
          <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-gold-700">
            {eyebrow}
          </span>
        )}
        <h1 className="text-2xl md:text-[32px] leading-[1.1] font-semibold tracking-[-0.03em] text-navy-950">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-gray-500 max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export interface SectionHeaderProps {
  id?: string;
  title: React.ReactNode;
  count?: number;
  actions?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  id,
  title,
  count,
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <div
      id={id}
      className={cn(
        "flex items-center justify-between mb-3",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <h2 className="text-[17px] font-semibold text-navy-950 tracking-tight">{title}</h2>
        {typeof count === "number" && (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-navy-50 text-navy-700 tabular-nums">
            {count}
          </span>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

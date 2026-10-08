"use client";

import React, { useId, useMemo } from "react";
import { MatterItem } from "@/lib/mock-data";

interface MattersProgressProps {
  matters: MatterItem[];
}

// Semicircle from (30,120) to (210,120); pathLength normalised to 100
const ARC = "M 30 120 A 90 90 0 0 1 210 120";

export function MattersProgress({ matters }: MattersProgressProps) {
  const patternId = useId().replace(/:/g, "");

  const { completed, advanced, early, total } = useMemo(() => {
    const completed = matters.filter((m) => m.isCompleted).length;
    const advanced = matters.filter((m) => !m.isCompleted && m.progress >= 50).length;
    const early = matters.length - completed - advanced;
    return { completed, advanced, early, total: matters.length };
  }, [matters]);

  const pct = (n: number) => (total === 0 ? 0 : (n / total) * 100);
  const donePct = pct(completed);
  const advancedEnd = pct(completed + advanced);
  const headline = Math.round(advancedEnd);

  const legend = [
    { label: "Completed", value: completed, swatch: "bg-navy-900" },
    { label: "Advanced", value: advanced, swatch: "bg-gold-500" },
    { label: "Early stage", value: early, swatch: "pattern-hatch border border-navy-200" },
  ];

  return (
    <section
      className="surface-card rise-in p-5 flex flex-col h-full"
      style={{ "--rise-delay": "420ms" } as React.CSSProperties}
      aria-label="Matter progress"
    >
      <h3 className="text-[17px] font-semibold tracking-tight text-navy-950">Matter Progress</h3>

      <div className="flex-1 flex flex-col items-center justify-center py-4">
        <div
          className="relative w-full max-w-[250px]"
          role="img"
          aria-label={`${completed} completed, ${advanced} advanced, ${early} early stage of ${total} matters`}
        >
          <svg viewBox="0 0 240 132" className="w-full h-auto overflow-visible">
            <defs>
              <pattern
                id={patternId}
                width="7"
                height="7"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <rect width="7" height="7" fill="var(--navy-50)" />
                <rect width="1.8" height="7" fill="var(--navy-300)" />
              </pattern>
            </defs>
            <path d={ARC} pathLength={100} fill="none" stroke={`url(#${patternId})`} strokeWidth="28" strokeLinecap="round" />
            {advancedEnd > 0 && (
              <path
                d={ARC}
                pathLength={100}
                fill="none"
                stroke="var(--gold-500)"
                strokeWidth="28"
                strokeLinecap="round"
                strokeDasharray={`${advancedEnd} 100`}
                className="transition-all duration-700"
              />
            )}
            {donePct > 0 && (
              <path
                d={ARC}
                pathLength={100}
                fill="none"
                stroke="var(--navy-900)"
                strokeWidth="28"
                strokeLinecap="round"
                strokeDasharray={`${donePct} 100`}
                className="transition-all duration-700"
              />
            )}
          </svg>

          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
            <span className="text-[40px] leading-none font-semibold tracking-[-0.04em] tabular-nums text-navy-950">
              {headline}
              <span className="text-2xl text-gray-400 font-medium">%</span>
            </span>
            <span className="mt-1 text-[11.5px] text-gray-500">Well advanced</span>
          </div>
        </div>
      </div>

      <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
        {legend.map((l) => (
          <li key={l.label} className="inline-flex items-center gap-1.5 text-[11.5px] text-gray-500">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${l.swatch}`} />
            {l.label}
            <span className="font-semibold text-navy-900 tabular-nums">{l.value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

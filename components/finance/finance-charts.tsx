"use client";

import React from "react";

interface LawyerAttribution {
  name: string;
  gross: number;
  cases: number;
  percent: number;
}

interface FinanceChartsProps {
  dateRange: "today" | "week" | "month" | "year";
  lawyerAttribution: LawyerAttribution[];
}

export function FinanceCharts({
  dateRange,
  lawyerAttribution,
}: FinanceChartsProps) {
  const bars = [
    { label: "W1", gross: 3200, net: 3120 },
    { label: "W2", gross: 4800, net: 4680 },
    { label: "W3", gross: 2900, net: 2827 },
    { label: "W4 (Current)", gross: 5600, net: 5460, isCurrent: true },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left: Monthly Trend Visualizer */}
      <div className="lg:col-span-2 apple-glass-card p-5 rounded-xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-navy-900">Revenue Trajectory & Gateway Settlement</h3>
            <p className="text-xs text-slate-400">Gross intake volume vs net cleared deposits</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800">
            Filtered: {dateRange.toUpperCase()}
          </span>
        </div>

        {/* Clean Bar Chart Representation */}
        <div className="pt-6 pb-2">
          <div className="flex items-end justify-between gap-4 h-44 px-2">
            {bars.map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full max-w-[54px] flex items-end justify-center gap-1.5 h-full">
                  {/* Gross Bar */}
                  <div
                    className="w-1/2 bg-navy-900 rounded-t-lg transition-all hover:bg-navy-800 cursor-pointer"
                    style={{ height: `${(bar.gross / 6000) * 100}%` }}
                    title={`Gross: $${bar.gross}`}
                  />
                  {/* Net Bar */}
                  <div
                    className="w-1/2 bg-blue-500 rounded-t-lg transition-all hover:bg-blue-400 cursor-pointer"
                    style={{ height: `${(bar.net / 6000) * 100}%` }}
                    title={`Net: $${bar.net}`}
                  />
                </div>
                <span className={`text-[11px] font-semibold ${bar.isCurrent ? "text-blue-600 font-bold" : "text-slate-400"}`}>
                  {bar.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-navy-900" />
              <span className="text-slate-600 font-medium">Gross Gateway Intake</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-blue-500" />
              <span className="text-slate-600 font-medium">Net Payout Received</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Revenue by Lawyer Attribution */}
      <div className="apple-glass-card p-5 rounded-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-navy-900">Counsel Attribution</h3>
              <p className="text-xs text-slate-400">Revenue realization by lawyer</p>
            </div>
          </div>

          <div className="flex flex-col gap-3.5 pt-4">
            {lawyerAttribution.map((lawyer, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-navy-900">{lawyer.name}</span>
                  <span className="font-mono font-bold text-slate-700">${lawyer.gross.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-navy-900 rounded-full"
                    style={{ width: `${lawyer.percent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{lawyer.cases} matters settled</span>
                  <span>{lawyer.percent}% share</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-500 mt-4">
          Consultation fee distribution is audited and reconciled with monthly partner disbursements.
        </div>
      </div>
    </div>
  );
}

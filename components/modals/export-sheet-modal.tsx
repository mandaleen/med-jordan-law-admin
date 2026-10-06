"use client";

import React, { useState } from "react";
import { X, FileText, Table, Lock, Download, Check, Share2 } from "lucide-react";

interface ExportSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportSheetModal({ isOpen, onClose }: ExportSheetModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<"csv" | "pdf" | "json">("csv");
  const [isExporting, setIsExporting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const formats = [
    {
      id: "csv",
      title: "Client & Bookings Ledger",
      subtitle: "Comma-separated spreadsheet format (.csv)",
      icon: Table,
      color: "#34C759", // green
      extension: "csv",
    },
    {
      id: "pdf",
      title: "Executive Partner Brief",
      subtitle: "Full vector PDF with financial graphs (.pdf)",
      icon: FileText,
      color: "#FF3B30", // red
      extension: "pdf",
    },
    {
      id: "json",
      title: "Encrypted Dossier Archive",
      subtitle: "Complete practice data in secure JSON (.json)",
      icon: Lock,
      color: "#007AFF", // blue
      extension: "json",
    },
  ];

  const handleDownload = () => {
    setIsExporting(true);

    setTimeout(() => {
      // Generate actual download
      const content =
        selectedFormat === "csv"
          ? "Client,Case Type,Date,Status,Fee\nLayla Al-Husseini,Corporate Law,2026-10-06,Completed,$4200\nOmar Masri,Real Estate,2026-10-06,In Progress,$8500\nDr. Fadi Haddad,IP Trademark,2026-10-06,Pending,$3100"
          : JSON.stringify({ practice: "Med Jordan Law", exportDate: new Date().toISOString(), status: "active" }, null, 2);

      const mimeType = selectedFormat === "csv" ? "text/csv" : "application/json";
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `med-jordan-law-export-${Date.now()}.${selectedFormat === "pdf" ? "pdf" : selectedFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1000);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-black/35 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-xl shadow-[0_24px_60px_rgba(10,35,66,0.18)] overflow-hidden z-10 animate-in zoom-in-95 duration-250 p-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0A2342]/10 flex items-center justify-center text-[#0A2342]">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#0A2342] tracking-tight whitespace-nowrap">
                Export Practice Data
              </h3>
              <p className="text-xs text-slate-400 whitespace-nowrap">Formal Dossier & Ledger Dispatch</p>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
            }}
            className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 apple-press"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-2">
          {formats.map((f) => {
            const isSelected = selectedFormat === f.id;
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setSelectedFormat(f.id as "csv" | "pdf" | "json");
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-lg border transition-all text-left cursor-pointer apple-press ${
                  isSelected
                    ? "bg-slate-50 border-[#0A2342] shadow-xs"
                    : "bg-white hover:bg-slate-50/80 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-md flex items-center justify-center text-white shrink-0 shadow-xs"
                    style={{ backgroundColor: f.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#0A2342] tracking-tight whitespace-nowrap">
                      {f.title}
                    </div>
                    <div className="text-xs text-slate-400 whitespace-nowrap truncate">{f.subtitle}</div>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ml-2 ${
                    isSelected
                      ? "border-[#0A2342] bg-[#0A2342] text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full py-2.5 rounded-lg bg-[#0A2342] hover:bg-[#0D2F56] text-white text-sm font-semibold shadow-sm border border-[#0A2342] transition-all apple-press flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            {isSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[3] shrink-0" />
                <span className="whitespace-nowrap">Downloaded Successfully</span>
              </>
            ) : isExporting ? (
              <span className="whitespace-nowrap">Preparing Archive...</span>
            ) : (
              <>
                <Download className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Download {selectedFormat.toUpperCase()} Dossier</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

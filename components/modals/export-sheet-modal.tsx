"use client";

import React, { useState } from "react";
import { X, FileText, Table, Lock, Download, Check, Share2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
      title: "Spreadsheet (CSV)",
      subtitle: ".csv format",
      icon: Table,
      color: "#2F9E6E",
      extension: "csv",
    },
    {
      id: "pdf",
      title: "Report (PDF)",
      subtitle: ".pdf format",
      icon: FileText,
      color: "#D64545",
      extension: "pdf",
    },
    {
      id: "json",
      title: "Archive (JSON)",
      subtitle: ".json format",
      icon: Lock,
      color: "#3B82C4",
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-md bg-white/95 backdrop-blur-2xl border border-gray-300 rounded-xl shadow-[0_24px_60px_rgba(26,39,68,0.18)] overflow-hidden p-6"
      >
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-navy-900/10 flex items-center justify-center text-navy-900">
              <Share2 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-navy-900 tracking-tight whitespace-nowrap">
              Export Data
            </h3>
          </div>
          <button
            onClick={() => {
              onClose();
            }}
            className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 press cursor-pointer"
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
                className={`w-full flex items-center justify-between p-3.5 rounded-lg border transition-all text-left cursor-pointer press ${
                  isSelected
                    ? "bg-navy-50 border-navy-900 shadow-xs"
                    : "bg-white hover:bg-gray-50 border-gray-300"
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
                    <div className="text-sm font-semibold text-navy-900 tracking-tight whitespace-nowrap">
                      {f.title}
                    </div>
                    <div className="text-xs text-gray-500 whitespace-nowrap truncate">{f.subtitle}</div>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ml-2 ${
                    isSelected
                      ? "border-navy-900 bg-navy-900 text-white"
                      : "border-gray-300 bg-white"
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
            className="w-full py-2.5 rounded-lg bg-navy-900 hover:bg-navy-950 text-white text-xs font-semibold shadow-sm border border-navy-900 transition-all press flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            {isSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[3] shrink-0" />
                <span className="whitespace-nowrap">Downloaded</span>
              </>
            ) : isExporting ? (
              <span className="whitespace-nowrap">Exporting...</span>
            ) : (
              <>
                <Download className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Download {selectedFormat.toUpperCase()}</span>
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

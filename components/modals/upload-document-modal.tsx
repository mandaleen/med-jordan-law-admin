"use client";

import React, { useState } from "react";
import {
  Upload,
  FileText,
  Lock,
  Eye,
  X,
  ShieldCheck,
} from "lucide-react";
import { DocumentItem, CaseItem } from "@/lib/mock-data";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseNumber?: string;
  availableCases?: CaseItem[];
  selectedCaseId?: string | null;
  onUpload: (newDoc: DocumentItem, targetCaseId?: string) => void;
}

export function UploadDocumentModal({
  isOpen,
  onClose,
  caseNumber = "MJL-2026-089",
  availableCases = [],
  selectedCaseId,
  onUpload,
}: UploadDocumentModalProps) {
  const [docTitle, setDocTitle] = useState("");
  const [docCategory, setDocCategory] = useState("Pleading & Court Memorandum");
  const [isVisibleToClient, setIsVisibleToClient] = useState(true);
  const [fileName, setFileName] = useState("Amman_Court_Evidentiary_Exhibit.pdf");
  const [fileSize, setFileSize] = useState("3.4 MB");
  const [chosenCaseId, setChosenCaseId] = useState(selectedCaseId || availableCases[0]?.id || "");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;

    // Generate random realistic SHA-256 hash
    const hexChars = "0123456789abcdef";
    let hash = "";
    for (let i = 0; i < 64; i++) {
      hash += hexChars[Math.floor(Math.random() * hexChars.length)];
    }

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: docTitle.trim(),
      type: "Office Upload",
      uploadDate: "Today",
      size: fileSize,
      status: "Validated",
      category: docCategory,
      isOfficeVisibleToClient: isVisibleToClient,
      docHash: hash,
    };

    onUpload(newDoc, chosenCaseId);
    setDocTitle("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-lg p-6 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col gap-4 animate-in fade-in duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-navy-50 text-navy-900 border border-navy-100 flex items-center justify-center font-bold shrink-0">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-tight">
                Upload Document
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
          {/* Target Case Selector (if cases available and not already restricted) */}
          {availableCases.length > 0 && !caseNumber && (
            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                Matter:
              </label>
              <select
                value={chosenCaseId}
                onChange={(e) => setChosenCaseId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 hover:bg-gray-100/60 border border-gray-200 rounded-lg text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:border-navy-900 transition-colors cursor-pointer"
              >
                {availableCases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.caseNumber} — {c.title} ({c.clientName})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* File Drag Box */}
          <label className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-navy-900 bg-gray-50/70 hover:bg-white flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer group">
            <input
              type="file"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setFileName(f.name);
                  setFileSize(`${(f.size / (1024 * 1024)).toFixed(1)} MB`);
                  if (!docTitle) setDocTitle(f.name.replace(/\.[^/.]+$/, ""));
                }
              }}
            />
            <div className="w-9 h-9 rounded-xl bg-gray-100 group-hover:bg-navy-50 text-gray-700 group-hover:text-navy-900 flex items-center justify-center transition-colors">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-gray-900 text-xs">
                Click or drag file here
              </span>
              <p className="text-[11px] text-gray-500 mt-0.5">
                PDF, DOCX up to 50 MB
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-md bg-white border border-gray-200 text-gray-800 font-mono text-[11px] shadow-2xs">
              {fileName} ({fileSize})
            </span>
          </label>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">
              Title:
            </label>
            <input
              type="text"
              required
              placeholder="Document title"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-200/90 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-navy-900 transition-colors"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">
              Category:
            </label>
            <select
              value={docCategory}
              onChange={(e) => setDocCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-200/90 rounded-lg text-xs text-gray-800 font-medium focus:outline-none focus:border-navy-900 transition-colors cursor-pointer"
            >
              <option value="Pleading & Court Memorandum">Pleading & Court Memorandum</option>
              <option value="Power of Attorney Scan">Power of Attorney Copy</option>
              <option value="Commercial Register Extract">Commercial Register Extract</option>
              <option value="Expert Financial Report">Expert Financial Report</option>
              <option value="Evidentiary Exhibits">Evidentiary Exhibits</option>
              <option value="Court Decrees & Orders">Court Orders & Decrees</option>
            </select>
          </div>

          {/* Visibility Toggle */}
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/90 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                {isVisibleToClient ? (
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                )}
              </div>
              <div className="min-w-0">
                <span className="font-semibold text-gray-900 block text-xs">
                  {isVisibleToClient ? "Visible to Client" : "Internal Only"}
                </span>
                <p className="text-[11px] text-gray-500 leading-tight">
                  {isVisibleToClient
                    ? "Available in client portal."
                    : "Internal team only."}
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={isVisibleToClient}
                onChange={(e) => setIsVisibleToClient(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-navy-950" />
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium bg-navy-950 hover:bg-navy-900 text-white rounded-full shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Upload</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

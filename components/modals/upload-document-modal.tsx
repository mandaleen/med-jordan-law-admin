"use client";

import React, { useState } from "react";
import {
  Upload,
  FileText,
  Lock,
  Eye,
  X,
} from "lucide-react";
import { DocumentItem } from "@/lib/mock-data";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseNumber?: string;
  onUpload: (newDoc: DocumentItem) => void;
}

export function UploadDocumentModal({
  isOpen,
  onClose,
  caseNumber = "MJL-2026-089",
  onUpload,
}: UploadDocumentModalProps) {
  const [docTitle, setDocTitle] = useState("");
  const [docCategory, setDocCategory] = useState("Pleading & Memorandum");
  const [isVisibleToClient, setIsVisibleToClient] = useState(true);
  const [fileName, setFileName] = useState("Statement_of_Claim_AmmanCourt.pdf");
  const [fileSize, setFileSize] = useState("2.4 MB");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: docTitle.trim(),
      type: "Office Upload",
      uploadDate: "Today",
      size: fileSize,
      status: "Validated",
      isOfficeVisibleToClient: isVisibleToClient,
    };

    onUpload(newDoc);
    setDocTitle("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-lg p-6 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col gap-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0A2342] flex items-center justify-center font-bold">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0A2342]">Upload Legal Document</h3>
              <p className="text-xs text-slate-400">Vault upload for matter {caseNumber} (Page 9)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          {/* File Drag Box */}
          <label className="p-6 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#0A2342] bg-slate-50/60 flex flex-col items-center justify-center text-center gap-2 transition-colors cursor-pointer">
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
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-[#0A2342]">Click to upload or drag file here</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Supports PDF, Word (.docx), or certified scans up to 25 MB</p>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-mono text-[10px]">
              Selected: {fileName} ({fileSize})
            </span>
          </label>

          <div>
            <label className="font-bold text-slate-700">Document Title / Docket Name:</label>
            <input
              type="text"
              required
              placeholder="e.g. Statement of Claim & Factual Memoranda"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl mt-1 text-slate-800"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700">Document Classification:</label>
            <select
              value={docCategory}
              onChange={(e) => setDocCategory(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl mt-1 text-slate-800"
            >
              <option value="Pleading & Memorandum">Pleading & Court Memorandum (لائحة دعوى / مذكرة)</option>
              <option value="Commercial Register Extract">Commercial Register & Authorization Extract</option>
              <option value="Power of Attorney Scan">Power of Attorney Notary Copy (سند وكالة)</option>
              <option value="Expert Financial Report">Expert Financial Assessment & Damage Calculation</option>
              <option value="Hearing Outcome Receipt">Court Hearing Filing Receipt</option>
            </select>
          </div>

          {/* Visibility Toggle */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {isVisibleToClient ? (
                <Eye className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <div>
                <span className="font-bold text-slate-800">
                  {isVisibleToClient ? "Visible in Client Portal" : "Internal Office Vault Only"}
                </span>
                <p className="text-[11px] text-slate-400">
                  {isVisibleToClient
                    ? "Client can view, download, and receive update notifications in their portal."
                    : "Strict attorney-client work product. Hidden from client portal."}
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
              <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0A2342]" />
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-[#0A2342] hover:bg-blue-900 text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload & Seal into Vault
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

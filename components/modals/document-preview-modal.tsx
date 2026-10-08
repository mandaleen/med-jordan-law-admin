"use client";

import React, { useState } from "react";
import {
  FileText,
  ShieldCheck,
  Download,
  Copy,
  Check,
  X,
  Lock,
  Eye,
  Building,
} from "lucide-react";
import { DocumentItem } from "@/lib/mock-data";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface DocumentPreviewModalProps {
  document: DocumentItem | null;
  caseNumber?: string;
  clientName?: string;
  onClose: () => void;
  onOpenAuditTrail?: (doc: DocumentItem) => void;
  onToggleVisibility?: (docId: string) => void;
}

export function DocumentPreviewModal({
  document,
  caseNumber = "MJL-2026-089",
  clientName = "Client Matter",
  onClose,
  onOpenAuditTrail,
  onToggleVisibility,
}: DocumentPreviewModalProps) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!document) return null;

  const docHash =
    document.docHash ||
    "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4";

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(docHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2200);
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <Dialog open={!!document} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-3xl p-0 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in duration-200"
      >
        {/* Header Strip */}
        <div className="bg-navy-950 px-6 py-3.5 text-white flex items-center justify-between shrink-0 border-b border-navy-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-navy-800/80 border border-navy-700/60 flex items-center justify-center font-bold shrink-0">
              <FileText className="w-4 h-4 text-gray-200" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-semibold text-gray-400">
                  {caseNumber}
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  {document.status === "Validated"
                    ? "Sealed"
                    : document.status === "Pending"
                    ? "Pending"
                    : "Action Required"}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight truncate mt-0.5">
                {document.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-navy-800/80 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4 text-xs bg-gray-50/50">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-white border border-gray-200/90 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">
                Category
              </span>
              <span className="font-medium text-gray-900 truncate">
                {document.category || "Memorandum"}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">
                Date & Size
              </span>
              <span className="font-mono text-gray-800 tabular-nums">
                {document.uploadDate} · {document.size}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">
                Source
              </span>
              <span className="font-medium text-gray-800">
                {document.type}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">
                Visibility
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {document.isOfficeVisibleToClient ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                    <Eye className="w-3 h-3 text-emerald-600" />
                    Visible
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700">
                    <Lock className="w-3 h-3 text-amber-600" />
                    Private
                  </span>
                )}
                {onToggleVisibility && (
                  <button
                    type="button"
                    onClick={() => onToggleVisibility(document.id)}
                    className="text-[10px] font-semibold text-navy-700 hover:underline ms-1 cursor-pointer"
                  >
                    (Change)
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Rejection Notice if applicable */}
          {document.status === "Rejected" && document.rejectionReason && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-900 text-xs flex flex-col gap-1">
              <div className="font-semibold text-rose-950 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                Audit Rejection Notice & Client Re-upload Directive
              </div>
              <p className="text-[11.5px] text-rose-800 leading-relaxed ps-3.5">
                {document.rejectionReason}
              </p>
            </div>
          )}

          {/* Simulated Authentic Court Document Viewer */}
          <div className="bg-white rounded-xl border border-gray-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
            {/* Sheet Top Border & Insignia Header */}
            <div className="p-6 border-b border-gray-100 bg-[#FCFBF8] flex flex-col items-center text-center gap-2 relative">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] text-navy-900 font-bold text-5xl rotate-[-18deg] uppercase tracking-widest">
                Authenticated Record
              </div>

              <div className="flex items-center gap-2 text-[11px] text-gray-500 font-serif tracking-wider uppercase">
                <Building className="w-3.5 h-3.5 text-gray-400" />
                <span>The Hashemite Kingdom of Jordan · Judicial Council</span>
              </div>
              <h4 className="text-base font-bold text-navy-950 font-serif tracking-tight max-w-lg">
                {document.title}
              </h4>
              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-gray-500 pt-1">
                <span>Docket: <strong className="font-mono text-gray-800">{caseNumber}</strong></span>
                <span>•</span>
                <span>Client: <strong className="text-gray-800">{clientName}</strong></span>
                <span>•</span>
                <span>Sealed: <strong className="font-mono text-gray-800">{document.uploadDate}</strong></span>
              </div>
            </div>

            {/* Document Content Abstract */}
            <div className="p-6 sm:p-8 space-y-4 text-gray-700 text-xs leading-relaxed font-sans bg-white">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 text-[11px] text-gray-400">
                <span>OFFICIAL LEGAL DOCKET ENTRY — CERTIFIED COPY</span>
                <span className="font-mono">PAGE 1 OF 1 (AUTHENTICATED)</span>
              </div>

              <p className="text-gray-800 leading-relaxed font-serif text-[13px]">
                Pursuant to the provisions of the Civil Procedures Code and the relevant statutory regulations
                governing legal submissions before the competent judicial chambers of Amman, this document
                has been formally submitted, cryptographically archived, and indexed under case matter{" "}
                <strong className="font-mono font-medium text-navy-900">{caseNumber}</strong>.
              </p>

              <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200/70 font-mono text-[11px] text-gray-600 space-y-1">
                <div>[DOCUMENT VERIFICATION SUMMARY]</div>
                <div>Title: {document.title}</div>
                <div>Category: {document.category || "Legal Memorandum"}</div>
                <div>File Payload: {document.size} (Certified PDF Format)</div>
                <div>Origin Source: {document.type} (Verified Identity Handshake)</div>
                <div>Antivirus Sandbox: ClamAV & SecGate Passed Clean (0 threats detected)</div>
              </div>

              <p className="text-gray-600 text-[11.5px] leading-relaxed">
                All signatures and evidentiary attachments contained herein maintain full legal evidentiary weight
                under Jordan Electronic Transactions Law No. (15) of 2015. Access records and forensic download
                timestamps are continuously recorded in the firm compliance audit ledger.
              </p>
            </div>
          </div>

          {/* Cryptographic SHA-256 Digest Bar */}
          <div className="p-3.5 rounded-xl bg-navy-950 text-white flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-mono text-emerald-400 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                SHA-256 Fingerprint:
              </span>
              <button
                type="button"
                onClick={handleCopyHash}
                className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-[10.5px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedHash ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-gray-300" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <code className="text-[10.5px] font-mono text-gray-300 break-all bg-black/40 p-2 rounded-lg border border-navy-800">
              {docHash}
            </code>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200/90 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            {onOpenAuditTrail && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuditTrail(document);
                }}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-medium cursor-pointer transition-colors inline-flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-navy-700" />
                <span>Audit Trail</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200/60 rounded-lg cursor-pointer transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-3.5 py-1.5 text-xs font-medium bg-navy-950 hover:bg-navy-900 text-white rounded-full shadow-2xs cursor-pointer transition-colors inline-flex items-center gap-1.5"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

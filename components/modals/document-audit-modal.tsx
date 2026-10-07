"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  FileText,
  X,
  Globe,
  Copy,
  Check,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { DocumentItem } from "@/lib/mock-data";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface DocumentAuditModalProps {
  document: DocumentItem | null;
  onClose: () => void;
}

export function DocumentAuditModal({ document, onClose }: DocumentAuditModalProps) {
  const [copied, setCopied] = useState(false);

  if (!document) return null;

  const docHash =
    document.docHash ||
    "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4";

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(docHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const auditEvents = [
    {
      action: "ACCESS_DOWNLOAD_AUTHENTICATED",
      actor: "Tariq Qudah",
      role: "Senior Partner",
      timestamp: "Today at 02:45 AM",
      ip: "192.168.1.104 (Chambers Secure LAN)",
      status: "Authorized",
    },
    {
      action: "CLIENT_PORTAL_SESSION_VIEW",
      actor: "Verified Client Portal (TLS 1.3)",
      role: document.type,
      timestamp: "Oct 6, 2026 at 16:10",
      ip: "82.212.94.18 (Orange Jordan Fiber)",
      status: "Authorized",
    },
    {
      action: "ANTIVIRUS_SANDBOX_CERTIFICATION",
      actor: "Med Jordan Law SecGate Sentinel",
      role: "Automated Sandbox Engine",
      timestamp: `Uploaded on ${document.uploadDate}`,
      ip: "10.0.4.12 (Internal Micro-Enclave)",
      status: "Passed Clean (0 Threats)",
    },
    {
      action: "DOCUMENT_REGISTRY_TIMESTAMP",
      actor: document.type === "Client Upload" ? "Client Intake Gateway" : "Layla Haddad (Paralegal)",
      role: document.type,
      timestamp: document.uploadDate,
      ip: "82.212.94.18",
      status: "Cryptographically Sealed",
    },
  ];

  return (
    <Dialog open={!!document} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-xl p-0 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in duration-200"
      >
        {/* Header */}
        <div className="bg-navy-950 px-6 py-4 text-white flex items-center justify-between shrink-0 border-b border-navy-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy-800/80 border border-navy-700/60 text-white flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                  Document Forensic Audit Trail
                </h3>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                  SEALED
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Cryptographic custody log & access telemetry (سجل التدقيق الرقمي)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-navy-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4 text-xs bg-gray-50/50">
          {/* Document Summary Card */}
          <div className="p-3.5 rounded-xl bg-white border border-gray-200/90 flex items-center justify-between gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-semibold text-gray-900 block truncate text-xs">
                  {document.title}
                </span>
                <span className="text-[11px] text-gray-500 font-mono">
                  {document.size} · {document.category || document.type}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[10.5px] font-medium shrink-0">
              ✓ Verified Sealed
            </span>
          </div>

          {/* Cryptographic SHA-256 Digest Bar */}
          <div className="p-3 rounded-xl bg-navy-950 text-white flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-mono text-emerald-400 font-medium flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                SHA-256 Digest:
              </span>
              <button
                type="button"
                onClick={handleCopyHash}
                className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-[10px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-gray-300" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <code className="text-[10px] font-mono text-gray-300 break-all bg-black/40 p-2 rounded-lg border border-navy-800">
              {docHash}
            </code>
          </div>

          {/* Chronological Event History */}
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-gray-700 uppercase tracking-wider text-[11px]">
              Chronological Access & Verification Records:
            </span>

            <div className="flex flex-col gap-2">
              {auditEvents.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white border border-gray-200/90 flex flex-col gap-1 text-[11.5px] shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-gray-900 text-xs">
                      {item.action}
                    </span>
                    <span className="font-mono text-gray-400 text-[10.5px] tabular-nums">
                      {item.timestamp}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between text-gray-600 text-[11px] gap-1 pt-0.5">
                    <span>
                      Actor: <strong className="text-gray-800 font-medium">{item.actor}</strong> ({item.role})
                    </span>
                    <span className="font-mono text-[10px] text-gray-400 flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {item.ip}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-200/90 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200/70 rounded-lg cursor-pointer transition-colors"
          >
            Close Audit Log
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import React from "react";
import {
  ShieldAlert,
  FileText,
  X,
  Globe,
} from "lucide-react";
import { DocumentItem } from "@/lib/mock-data";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface DocumentAuditModalProps {
  document: DocumentItem | null;
  onClose: () => void;
}

export function DocumentAuditModal({ document, onClose }: DocumentAuditModalProps) {
  if (!document) return null;

  const mockAuditTrail = [
    {
      action: "DOWNLOAD_DOCUMENT",
      actor: "Tariq Qudah",
      role: "Senior Partner",
      timestamp: "Today at 02:45 AM",
      ip: "192.168.1.104",
      status: "Authorized",
    },
    {
      action: "VIEW_DOCUMENT",
      actor: "Client Portal (Encrypted Session)",
      role: "Verified Client",
      timestamp: "Oct 6, 2026 at 16:10",
      ip: "82.212.94.18 (Orange Jordan)",
      status: "Authorized",
    },
    {
      action: "SECURITY_ANTIVIRUS_SCAN",
      actor: "Med Jordan Law SecGate",
      role: "Automated Sandbox",
      timestamp: `Uploaded on ${document.uploadDate}`,
      ip: "10.0.4.12 (Internal Gateway)",
      status: "Passed Clean",
    },
    {
      action: "DOCUMENT_UPLOAD",
      actor: document.type === "Client Upload" ? "Client Intake Session" : "Layla Haddad (Paralegal)",
      role: document.type,
      timestamp: document.uploadDate,
      ip: "82.212.94.18",
      status: "Logged",
    },
  ];

  return (
    <Dialog open={!!document} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-lg p-6 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col gap-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0A2342] flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0A2342]">Document Forensic Audit Trail</h3>
              <p className="text-xs text-slate-400">Cryptographic access log (Page 9 · سجل التدقيق)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Document summary */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700">
              <FileText className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[#0A2342]">{document.title}</span>
              <span className="text-[11px] text-slate-500 font-mono">
                {document.size} · {document.type}
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
            Audit Sealed
          </span>
        </div>

        {/* Timeline */}
        <div className="flex flex-col gap-2.5 text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
            Access & Download History:
          </span>

          <div className="flex flex-col gap-2">
            {mockAuditTrail.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col gap-1 text-[11.5px]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0A2342]">{item.action}</span>
                  <span className="font-mono text-slate-400 text-[10.5px]">{item.timestamp}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 text-[11px]">
                  <span>By: <strong>{item.actor}</strong> ({item.role})</span>
                  <span className="font-mono text-[10px] text-slate-400 flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {item.ip}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
          >
            Close Audit Log
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
